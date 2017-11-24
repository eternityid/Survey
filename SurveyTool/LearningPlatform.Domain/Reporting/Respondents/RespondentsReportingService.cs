using Elasticsearch.Net;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportElements;
using LearningPlatform.Domain.Results;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class RespondentsReportingService
    {
        private const int MaxResultSize = 10000;

        private readonly ISurveyRepository _surveyRepository;
        private readonly ReadQuestionService _readQuestionService;
        private readonly AggregatedQuestionFactory _aggregatedQuestionFactory;
        private readonly IElasticsearchReportingClient _elasticsearchReportingClient;
        private readonly ReportDefinitionService _reportDefinitionService;

        public RespondentsReportingService(ISurveyRepository surveyRepository,
            ReadQuestionService readQuestionService,
            AggregatedQuestionFactory aggregatedQuestionFactory,
            IElasticsearchReportingClient elasticsearchReportingClient,
            ReportDefinitionService reportDefinitionService)
        {
            _surveyRepository = surveyRepository;
            _readQuestionService = readQuestionService;
            _aggregatedQuestionFactory = aggregatedQuestionFactory;
            _elasticsearchReportingClient = elasticsearchReportingClient;
            _reportDefinitionService = reportDefinitionService;
        }

        public AggregatedRespondents GetAggregatedRespondents(string surveyId, string userId, bool isTesting)
        {
            var survey = _surveyRepository.GetById(surveyId);
            var surveyIndexName = _elasticsearchReportingClient.GetSurveyIndex(surveyId, isTesting);
            var surveyTypeName = _elasticsearchReportingClient.GetDefaultTypeName();
            var elasticsearchClient = _elasticsearchReportingClient.GetInstance();
            var questionsDefinitions = _readQuestionService.GetReportQuestions(surveyId, isTesting);
            var aggregationsCountRespondentsResult = elasticsearchClient.Search<dynamic>(surveyIndexName, surveyTypeName, GetAggregationsCountCondition(questionsDefinitions));
            if (aggregationsCountRespondentsResult.HttpStatusCode == (int)HttpStatusCode.NotFound)
            {
                return new AggregatedRespondents
                {
                    SurveyName = survey.SurveySettings.SurveyTitle,
                    TotalRespondents = 0,
                    Questions = new List<AggregatedQuestion>()
                };
            }
            if (aggregationsCountRespondentsResult.HttpStatusCode != (int)HttpStatusCode.OK) {
                throw new Exception(aggregationsCountRespondentsResult.DebugInformation);
            }

            var aggregationsRespondentsResult = elasticsearchClient.Search<dynamic>(surveyIndexName, surveyTypeName, GetAggregationsSearchCondition(questionsDefinitions));
            var totalRespondents = (int)aggregationsRespondentsResult.Body["hits"]["total"];
            var aggregatedQuestions = questionsDefinitions.Where(q => !(q is ShortTextListQuestionDefinition || q is LongTextListQuestionDefinition)).Select(
                questionDefinition => _aggregatedQuestionFactory.CreateAggregatedQuestion(questionDefinition, aggregationsRespondentsResult, aggregationsCountRespondentsResult, questionsDefinitions)
            ).ToList();

            aggregatedQuestions = AttachedReportQuestionSettings(surveyId, userId, aggregatedQuestions);

            return new AggregatedRespondents
            {
                SurveyName = survey.SurveySettings.SurveyTitle,
                TotalRespondents = totalRespondents,
                Questions = aggregatedQuestions
            };
        }

        public IEnumerable<AggregatedQuestion> GetOpenEndedQuestions(List<AggregatedQuestion> questions)
        {
            var openEndedQuestions = questions?.Where(
                question =>
                    question.QuestionType == (int) QuestionType.OpenEndedShortTextQuestionDefinition
                    || question.QuestionType == (int) QuestionType.OpenEndedLongTextQuestionDefinition);
            return openEndedQuestions;
        }

        public List<AggregatedQuestion> GetAggregatedQuestions(string surveyId, List<QuestionDefinition> questionsDefinitions,
            string userId, bool isTesting)
        {
            var surveyIndexName = _elasticsearchReportingClient.GetSurveyIndex(surveyId, isTesting);
            var surveyTypeName = _elasticsearchReportingClient.GetDefaultTypeName();

            var elasticsearchClient = _elasticsearchReportingClient.GetInstance();
            var aggregationsCountRespondentsResult = elasticsearchClient.Search<dynamic>(surveyIndexName, surveyTypeName,
                GetAggregationsCountCondition(questionsDefinitions));
            var aggregationsRespondentsResult = elasticsearchClient.Search<dynamic>(surveyIndexName, surveyTypeName,
                GetAggregationsSearchCondition(questionsDefinitions));

            var aggregatedQuestions = questionsDefinitions.Select(
                questionDefinition =>
                    _aggregatedQuestionFactory.CreateAggregatedQuestion(questionDefinition, aggregationsRespondentsResult,
                        aggregationsCountRespondentsResult, questionsDefinitions)).ToList();
            aggregatedQuestions = AttachedReportQuestionSettings(surveyId, userId, aggregatedQuestions);
            return aggregatedQuestions;
        }

        private List<AggregatedQuestion> AttachedReportQuestionSettings(string surveyId, string userId, List<AggregatedQuestion> questions)
        {
            var reportPageDefinition = GetReportPageDefinition(surveyId, userId);

            var displaySummaryTabular = reportPageDefinition.IsDisplaySummaryTabular;

            foreach (var question in questions)
            {
                ReportChartType chartTypeDefault;

                var reportElement = reportPageDefinition.GetReportElementDefinition(question.QuestionName);
                var questionSetting = reportElement as ReportChartElement;
                int? columnWidth = null;

                if (questionSetting == null)
                {
                    chartTypeDefault = _reportDefinitionService.GetChartTypeDefault(question.QuestionType);
                }
                else
                {
                    chartTypeDefault = questionSetting.ChartType;
                    var resultSetting = reportElement as ResultElement;
                    if (resultSetting != null)
                    {
                        columnWidth = resultSetting.ColumnWidth;
                    }
                }

                question.QuestionSetting = new AggregatedQuestionSetting
                {
                    ChartType = chartTypeDefault.ToString().ToLower(),
                    DisplaySummaryTabular = displaySummaryTabular,
                    ColumnWidth = columnWidth
                };
            }
            return questions;
        }

        public ReportPageDefinition GetReportPageDefinition(string surveyId, string userId)
        {
            var reportDefinition = _reportDefinitionService.GetSystemReport(surveyId, userId);
            return reportDefinition == null ?
                new ReportPageDefinition() :
                _reportDefinitionService.GetPagesByReportId(reportDefinition.Id).FirstOrDefault();
        }

        public IList<string> GetOpenResponses(string surveyId, string esQuestionName, int limit, bool isTesting)
        {
            var openResponses = new List<string>();

            const string scrollTimeOut = "1m";
            const string responseScrollIdProperty = "_scroll_id";
            const string noDataMessage = "No data for open text responses";

            var surveyIndexName = _elasticsearchReportingClient.GetSurveyIndex(surveyId, isTesting);
            var surveyTypeName = _elasticsearchReportingClient.GetDefaultTypeName();
            var searchCondition = GetOpenResponsesSearchCondition(esQuestionName, limit);
            var elasticsearchClient = _elasticsearchReportingClient.GetInstance();

            var firstScrollData = elasticsearchClient.Search<dynamic>(surveyIndexName, surveyTypeName, searchCondition, GetDelegateForSearching(scrollTimeOut));
            if (firstScrollData.HttpStatusCode != (int)HttpStatusCode.OK) throw new Exception(noDataMessage);
            string scrollId = firstScrollData.Body[responseScrollIdProperty];

            List<dynamic> scrollDocuments = firstScrollData.Body["hits"]["hits"];
            while (scrollDocuments.Any())
            {
                foreach (var document in scrollDocuments)
                {
                    openResponses.Add(document["_source"][esQuestionName]);
                }
                var scrollData = elasticsearchClient.Scroll<dynamic>(BuildScrollRequestBody(scrollTimeOut, scrollId));
                if (scrollData.HttpStatusCode != (int) HttpStatusCode.OK)
                {
                    return openResponses;
                };
                scrollId = scrollData.Body[responseScrollIdProperty];
                scrollDocuments = scrollData.Body["hits"]["hits"];
            }
            return openResponses;
        }

        private string BuildScrollRequestBody(string scrollTimeout, string scrollId)
        {
            return new JObject(
             new JProperty("scroll", scrollTimeout),
             new JProperty("scroll_id", scrollId)).ToString();
        }

        private string GetOpenResponsesSearchCondition(string esQuestionName, int limit) {
            var searchCondition = new JObject(
              new JProperty("_source", new JArray("_RespondentId", esQuestionName)),
              new JProperty("from", 0),
              new JProperty("size", limit < 0 ? MaxResultSize : limit),
              new JProperty("sort", new JArray(new JObject(new JProperty("_RespondentId", "desc")))),
              new JProperty("query", new JObject(
                  new JProperty("bool", new JObject(
                      new JProperty("must", new JObject(
                          new JProperty("term", new JObject(
                              new JProperty("_ResponseStatus", "Completed"))))),
                      new JProperty("filter", new JObject(
                          new JProperty("bool", new JObject(
                              new JProperty("should", new JArray(new JObject(
                                  new JProperty("exists", new JObject(new JProperty("field", esQuestionName)))))))))))))));

            return searchCondition.ToString();
        }

        private Func<SearchRequestParameters, SearchRequestParameters> GetDelegateForSearching(string scrollTimeOut)
        {
            return delegate (SearchRequestParameters searchRequestParameters)
            {
                searchRequestParameters.AddQueryString("scroll", scrollTimeOut);
                return searchRequestParameters;
            };
        }

        private string GetAggregationsSearchCondition(List<QuestionDefinition> questions)
        {
            var aggregationsSearchCondition = new JObject(
                new JProperty("query", new JObject(
                        new JProperty("term", new JObject(
                            new JProperty("_ResponseStatus", "Completed"))))),
                new JProperty("size", MaxResultSize),
                new JProperty("aggs", new JObject()));

            foreach (var question in questions)
            {
                var esQuestionName = question.Alias + EsQuestionNameHelper.GetQuestionNameSuffix(question);
                var gridQuestion = question as GridQuestionDefinition;
                if (gridQuestion != null &&
                    (gridQuestion is SingleSelectionGridQuestionDefinition||
                     gridQuestion is MultipleSelectionGridQuestionDefinition ||
                     gridQuestion is ScaleGridQuestionDefinition ||
                     gridQuestion is RatingGridQuestionDefinition))
                {
                    var expandedOptions = _readQuestionService.GetExpandedOptions(questions, gridQuestion.OptionList.Options);
                    foreach (var option in expandedOptions)
                    {
                        var subQuestionName = gridQuestion.Alias + "_" + option.Alias;
                        var esSubQuestionName = gridQuestion.Alias + "_" + option.Alias + EsQuestionNameHelper.GetQuestionNameSuffix(gridQuestion.SubQuestionDefinition);
                        aggregationsSearchCondition["aggs"][subQuestionName] =
                            new JObject(
                                new JProperty("filter", new JObject(
                                    new JProperty("exists", new JObject(
                                        new JProperty("field", esSubQuestionName))))),
                                new JProperty("aggs", new JObject(
                                    new JProperty(subQuestionName, new JObject(
                                        new JProperty("terms", new JObject(
                                            new JProperty("size", MaxResultSize),
                                            new JProperty("field", esSubQuestionName))))))));
                    }
                    continue;
                }

                var questionWithOptionsDefinition = question as QuestionWithOptionsDefinition;
                if (questionWithOptionsDefinition != null)
                {
                    aggregationsSearchCondition["aggs"][question.Alias] =
                        new JObject(
                            new JProperty("filter", new JObject(
                                new JProperty("exists", new JObject(
                                    new JProperty("field", esQuestionName))))),
                            new JProperty("aggs", new JObject(
                                new JProperty(question.Alias, new JObject(
                                    new JProperty("terms", new JObject(
                                        new JProperty("size", MaxResultSize),
                                        new JProperty("field", esQuestionName))))))));
                    continue;
                }

                var numericQuestionDefinition = question as NumericQuestionDefinition;
                if (numericQuestionDefinition != null)
                {
                    aggregationsSearchCondition["aggs"][question.Alias] =
                        new JObject(
                            new JProperty("terms", new JObject(
                                new JProperty("field", esQuestionName),
                                new JProperty("order", new JObject(new JProperty("_term", "asc"))))));

                    aggregationsSearchCondition["aggs"][question.Alias + "_stats"] =
                        new JObject(
                            new JProperty("stats", new JObject(
                                new JProperty("field", esQuestionName))));
                }
            }

            return aggregationsSearchCondition.ToString();
        }

        private string GetAggregationsCountCondition(List<QuestionDefinition> questionsDefinitions)
        {
            var aggregationsCountCondition = new JObject(
                new JProperty("query", new JObject(
                        new JProperty("term", new JObject(
                            new JProperty("_ResponseStatus", "Completed"))))),
                new JProperty("size", MaxResultSize),
                new JProperty("aggs", new JObject()));

            foreach (var questionDefinition in questionsDefinitions)
            {
                var gridQuestionDefinition = questionDefinition as GridQuestionDefinition;
                if (gridQuestionDefinition != null &&
                    (gridQuestionDefinition is SingleSelectionGridQuestionDefinition ||
                     gridQuestionDefinition is MultipleSelectionGridQuestionDefinition ||
                     gridQuestionDefinition is ScaleGridQuestionDefinition ||
                     gridQuestionDefinition is RatingGridQuestionDefinition))
                {
                    var jArrayOfConditions = new JArray();

                    var expandedOptions = _readQuestionService.GetExpandedOptions(questionsDefinitions, gridQuestionDefinition.OptionList.Options);
                    foreach (var option in expandedOptions)
                    {
                        var esSunQuestionName = gridQuestionDefinition.Alias + "_" + option.Alias + EsQuestionNameHelper.GetQuestionNameSuffix(gridQuestionDefinition.SubQuestionDefinition);

                        jArrayOfConditions.Add(new JObject(
                            new JProperty("exists", new JObject(
                                new JProperty("field", esSunQuestionName)))));
                    }

                    aggregationsCountCondition["aggs"][questionDefinition.Alias] =
                        new JObject(
                            new JProperty("filter", new JObject(
                                new JProperty("bool", new JObject(
                                    new JProperty("should", jArrayOfConditions))))));
                    continue;
                }

                var questionWithOptionsDefinition = questionDefinition as QuestionWithOptionsDefinition;
                if (questionWithOptionsDefinition != null)
                {
                    continue;
                }

                aggregationsCountCondition["aggs"][questionDefinition.Alias] =
                    new JObject(
                        new JProperty("filter", new JObject(
                            new JProperty("exists", new JObject(
                                new JProperty("field", questionDefinition.Alias+ EsQuestionNameHelper.GetQuestionNameSuffix(questionDefinition)))))));
            }

            return aggregationsCountCondition.ToString();
        }
    }
}