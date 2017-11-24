using Elasticsearch.Net;
using LearningPlatform.Domain.Reporting;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;

namespace LearningPlatform.Domain.SurveyDesign.ExportResponses
{
    public class ExportResponsesService
    {
        private readonly IElasticsearchReportingClient _elasticsearchReportingClient;
        private readonly ReadQuestionService _readQuestionService;
        private readonly char _underscoreCharacter = '_';

        public ExportResponsesService(IElasticsearchReportingClient elasticsearchReportingClient, ReadQuestionService readQuestionService)
        {
            _elasticsearchReportingClient = elasticsearchReportingClient;
            _readQuestionService = readQuestionService;
        }

        public string ExportResponsesData(string surveyId, ExportResponsesSettings settings, bool isTesting)
        {
            var responsesDataBuilder = new StringBuilder();

            var questionsInSurvey = _readQuestionService.GetReportQuestions(surveyId, isTesting);
            if (questionsInSurvey.Count == 0) throw new Exception("Cannot export. There are no questions in the survey.");

            var reportHeading = BuildReportHeading(settings, questionsInSurvey);
            responsesDataBuilder.Append(reportHeading);

            var questionStore = BuildQuestionStoreFromQuestionList(questionsInSurvey);
            var reportBody = BuildReportBody(surveyId, settings, questionStore, questionsInSurvey, isTesting);
            responsesDataBuilder.Append(reportBody);

            return responsesDataBuilder.ToString();
        }

        private string BuildReportHeading(ExportResponsesSettings settings, List<QuestionDefinition> questionsInSurvey)
        {
            var reportHeading = new StringBuilder();

            var columnHeadings = new List<string> {
                ExportResponsesGeneralFields.RespondentId,
                ExportResponsesGeneralFields.LastModified,
                ExportResponsesGeneralFields.Completed,
                ExportResponsesGeneralFields.ResponseStatus
            };
            foreach (var currentQuestion in questionsInSurvey)
            {
                columnHeadings.AddRange(GetColumnHeadingsByQuestion(currentQuestion, questionsInSurvey, settings));
            }
            var columnHeadingsAsString = string.Join(ExportResponsesHelper.GetSeparator(settings.ExportResponsesSeparator), ExportResponsesHelper.UpdateListStringWithQuotationMarks(columnHeadings));

            return reportHeading
                        .Append(columnHeadingsAsString)
                        .AppendLine()
                        .ToString();
        }

        private List<string> GetColumnHeadingsByQuestion(QuestionDefinition question, List<QuestionDefinition> questionList, ExportResponsesSettings settings)
        {
            var columnHeadings = new List<string>();
            var displayedQuestionTitle = settings.ExportResponsesReadingMode == ExportResponsesReadingMode.QuestionTitle ?
                question.Title.GetFirstItemText() :
                question.Alias;

            var gridQuestionDefinition = question as GridQuestionDefinition;
            var multipleSelectionQuestionDefinition = question as MultipleSelectionQuestionDefinition;
            if (gridQuestionDefinition != null && _readQuestionService.IsSelectionGridQuestion(gridQuestionDefinition))
            {
                columnHeadings.AddRange(GetColumnHeadingsByGridQuestionDefinition(gridQuestionDefinition, questionList, settings));
            }
            else if (multipleSelectionQuestionDefinition != null && settings.MultipleSelectionAnswersAsSeparateColumns)
            {
                var allSelectionOptions = _readQuestionService.GetExpandedOptions(questionList, multipleSelectionQuestionDefinition.OptionList.Options);
                foreach (var selectionOption in allSelectionOptions)
                {
                    string displayedOptionTitle = settings.ExportResponsesReadingMode == ExportResponsesReadingMode.QuestionTitle ?
                        selectionOption.Text.GetFirstItemText() :
                        selectionOption.Alias;
                    columnHeadings.Add(ExportResponsesHelper.StripHtmlTags(displayedQuestionTitle + _underscoreCharacter + displayedOptionTitle));
                }
            }
            else
            {
                columnHeadings.Add(ExportResponsesHelper.StripHtmlTags(displayedQuestionTitle));
            }

            return columnHeadings;
        }

        private List<string> GetColumnHeadingsByGridQuestionDefinition(GridQuestionDefinition question, List<QuestionDefinition> questionList, ExportResponsesSettings settings)
        {
            var columnHeadings = new List<string>();

            string heading;
            var questionTitle = question.Title.GetFirstItemText();
            var isIncludeTitle = settings.ExportResponsesReadingMode == ExportResponsesReadingMode.QuestionTitle;
            var allTopics = _readQuestionService.GetExpandedOptions(questionList, question.OptionList.Options);
            var subMultipleSelectionGridQuestion = question.SubQuestionDefinition as MultipleSelectionQuestionDefinition;

            if (settings.MultipleSelectionAnswersAsSeparateColumns && subMultipleSelectionGridQuestion != null)
            {
                var allOptions = _readQuestionService.GetExpandedOptions(questionList, subMultipleSelectionGridQuestion.OptionList.Options);
                foreach (var topic in allTopics)
                {
                    foreach (var option in allOptions)
                    {
                        heading =
                            isIncludeTitle ?
                            questionTitle + _underscoreCharacter + topic.Text.GetFirstItemText() + _underscoreCharacter + option.Text.GetFirstItemText() :
                            question.Alias + _underscoreCharacter + topic.Alias + _underscoreCharacter + option.Alias;
                        columnHeadings.Add(ExportResponsesHelper.StripHtmlTags(heading));
                    }
                }
            }
            else
            {
                foreach (var topic in allTopics)
                {
                    heading =
                        isIncludeTitle ?
                        questionTitle + _underscoreCharacter + topic.Text.GetFirstItemText() :
                        question.Alias + _underscoreCharacter + topic.Alias;
                    columnHeadings.Add(ExportResponsesHelper.StripHtmlTags(heading));
                }
            }

            return columnHeadings;
        }

        private Dictionary<string, QuestionDefinition> BuildQuestionStoreFromQuestionList(List<QuestionDefinition> questionsInSurvey)
        {
            var questionStore = new Dictionary<string, QuestionDefinition>();

            foreach (var question in questionsInSurvey)
            {
                var gridQuestionDefinition = question as GridQuestionDefinition;
                if (gridQuestionDefinition != null && _readQuestionService.IsSelectionGridQuestion(gridQuestionDefinition))
                {
                    var allTopics = _readQuestionService.GetExpandedOptions(questionsInSurvey, gridQuestionDefinition.OptionList.Options);
                    foreach (var topic in allTopics)
                    {
                        questionStore.Add(gridQuestionDefinition.Alias + _underscoreCharacter + topic.Alias, gridQuestionDefinition.SubQuestionDefinition);
                    }
                }
                else
                {
                    questionStore.Add(question.Alias, question);
                }
            }

            return questionStore;
        }

        private string BuildReportBody(string surveyId, ExportResponsesSettings exportSettings,
            Dictionary<string, QuestionDefinition> questionStore,
            List<QuestionDefinition> questionsInSurvey, bool isTesting)
        {
            var surveyIndexName = _elasticsearchReportingClient.GetSurveyIndex(surveyId, isTesting);
            var surveyTypeName = _elasticsearchReportingClient.GetDefaultTypeName();
            var searchCondition = BuildReportBodySearchCondition(exportSettings);

            List<JObject> elasticsearchResponses = GetAllDocumentsFromElasticsearch(surveyIndexName, surveyTypeName, searchCondition);

            return ExtractDataFromElasticsearchResponses(elasticsearchResponses, questionStore, questionsInSurvey, exportSettings);
        }

        private string BuildReportBodySearchCondition(ExportResponsesSettings exportSettings)
        {
            const int maxResultSize = 10000;
            var searchCondition = new JObject(
                new JProperty("size", maxResultSize));

            switch (exportSettings.ExportResponsesInclude)
            {
                case ExportResponsesInclude.All:
                    searchCondition.Add("query", new JObject(
                        new JProperty("match_all", new JObject())));
                    break;
                case ExportResponsesInclude.InCompletedAndCompletedResponses:
                    List<string> responsesStatus = new List<string> {
                        ResponseStatus.InProgress.ToString(),
                        ResponseStatus.Completed.ToString()
                    };
                    searchCondition.Add("query", new JObject(
                        new JProperty("terms", new JObject(
                            new JProperty(ExportResponsesGeneralFields.ElasticSearchResponseStatus, responsesStatus)))));
                    break;
                case ExportResponsesInclude.OnlyCompletedResponses:
                    searchCondition.Add("query", new JObject(
                        new JProperty("term", new JObject(
                            new JProperty(ExportResponsesGeneralFields.ElasticSearchResponseStatus, ResponseStatus.Completed.ToString())))));
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return searchCondition.ToString();
        }

        private List<JObject> GetAllDocumentsFromElasticsearch(string surveyIndexName, string surveyTypeName, string searchCondition)
        {
            var allDocuments = new List<JObject>();

            const string scrollTimeOut = "1m";
            const string responseScrollIdProperty = "_scroll_id";
            const string noDataMessage = "No data for exporting responses";
            var elasticsearchClient = _elasticsearchReportingClient.GetInstance();

            var firstScrollData = elasticsearchClient.Search<dynamic>(surveyIndexName, surveyTypeName, searchCondition, GetDelegateForSearching(scrollTimeOut));
            if (firstScrollData.HttpStatusCode != (int)HttpStatusCode.OK) throw new Exception(noDataMessage);

            string scrollId = firstScrollData.Body[responseScrollIdProperty];

            List<dynamic> scrollDocuments = firstScrollData.Body["hits"]["hits"];
            while (scrollDocuments.Any())
            {
                foreach (var document in scrollDocuments)
                {
                    allDocuments.Add(JsonConvert.DeserializeObject<JObject>(document["_source"].ToString()));
                }

                var scrollData = elasticsearchClient.Scroll<dynamic>(BuildScrollRequestBody(scrollTimeOut, scrollId));
                if (scrollData.HttpStatusCode != (int)HttpStatusCode.OK) return allDocuments;
                scrollId = scrollData.Body[responseScrollIdProperty];
                scrollDocuments = scrollData.Body["hits"]["hits"];
            }

            return allDocuments;
        }

        private Func<SearchRequestParameters, SearchRequestParameters> GetDelegateForSearching(string scrollTimeOut)
        {
            return delegate (SearchRequestParameters searchRequestParameters)
            {
                searchRequestParameters.AddQueryString("scroll", scrollTimeOut);
                //searchRequestParameters.SearchType(SearchType.Scan);
                return searchRequestParameters;
            };
        }

        private string BuildScrollRequestBody(string scrollTimeout, string scrollId)
        {
            var test = new JObject(
                    new JProperty("scroll", scrollTimeout),
                    new JProperty("scroll_id", scrollId)
                );
            return test.ToString();
        }

        private string ExtractDataFromElasticsearchResponses(dynamic elasticsearchResponses, Dictionary<string, QuestionDefinition> questionStore,
            List<QuestionDefinition> questionsInSurvey, ExportResponsesSettings exportSettings)
        {
            var reportBodyBuilder = new StringBuilder();
            var reportFieldNames = BuildReportFieldNames(questionStore);

            foreach (dynamic response in elasticsearchResponses)
            {
                var reportRowData = ExtractDataFromSpecificElasticsearchResponse(response, questionStore, questionsInSurvey, reportFieldNames, exportSettings);
                var reportRowDataAfterFormating = string.Join(ExportResponsesHelper.GetSeparator(exportSettings.ExportResponsesSeparator), ExportResponsesHelper.UpdateListStringWithQuotationMarks(reportRowData));

                reportBodyBuilder
                    .Append(reportRowDataAfterFormating)
                    .AppendLine();
            }

            return reportBodyBuilder.ToString();
        }

        private List<string> ExtractDataFromSpecificElasticsearchResponse(JObject elasticsearchResponse, Dictionary<string, QuestionDefinition> questionStore,
            List<QuestionDefinition> questionsInSurvey, List<string> reportFieldNames, ExportResponsesSettings exportSettings)
        {
            var data = new List<string>();
            var emptyListOfString = new List<string>();

            foreach (var fieldName in reportFieldNames)
            {
                var tempValue = elasticsearchResponse[fieldName];
                MultipleSelectionQuestionDefinition multipleSelectionQuestionDefinition =
                    questionStore.ContainsKey(fieldName) ?
                    questionStore[fieldName] as MultipleSelectionQuestionDefinition : null;

                var multipleAnswers = tempValue as JArray;
                if (tempValue == null)
                {
                    if (!exportSettings.MultipleSelectionAnswersAsSeparateColumns)
                    {
                        data.Add(string.Empty);
                    }
                    else if (multipleSelectionQuestionDefinition != null)
                    {
                        data.AddRange(ExtractDataFromMultipleSelectionQuestion(multipleSelectionQuestionDefinition, questionsInSurvey, emptyListOfString));
                    }
                    else
                    {
                        data.Add(string.Empty);
                    }
                }
                else if (tempValue.ToString() == string.Empty)
                {
                    data.Add(string.Empty);
                }
                else if (multipleAnswers == null)
                {
                    data.Add(tempValue.ToString());
                }
                else
                {
                    var multipleAnswersAsList = multipleAnswers.ToObject<List<string>>();
                    if (exportSettings.MultipleSelectionAnswersAsSeparateColumns) {
                        data.AddRange(ExtractDataFromMultipleSelectionQuestion(multipleSelectionQuestionDefinition, questionsInSurvey, multipleAnswersAsList));
                    }else
                    {
                        data.Add(string.Join(ExportResponsesHelper.GetSeparator(ExportResponsesSeparator.CommaSeparator), multipleAnswersAsList));
                    }
                }
            }

            return data;
        }

        private List<string> ExtractDataFromMultipleSelectionQuestion(MultipleSelectionQuestionDefinition question, List<QuestionDefinition> questionsInSurvey, List<string> answerList)
        {
            var data = new List<string>();

            if (question == null || question.OptionList == null) return data;

            var allOptions = _readQuestionService.GetExpandedOptions(questionsInSurvey, question.OptionList.Options);
            if (answerList.Count == 0)
            {
                for (var optionIndex = 0; optionIndex < allOptions.Count; optionIndex++)
                {
                    data.Add(string.Empty);
                }
                return data;
            }

            foreach (var selectionOption in allOptions)
            {
                string answer = answerList.Contains(selectionOption.Alias) ? true.ToString() : false.ToString();
                data.Add(answer);
            }

            return data;
        }

        private List<string> BuildReportFieldNames(Dictionary<string, QuestionDefinition> questionStore)
        {
            var reportFields = new List<string> {
                ExportResponsesGeneralFields.ElasticSearchRespondentId,
                ExportResponsesGeneralFields.ElasticSearchLastModified,
                ExportResponsesGeneralFields.ElasticSearchCompleted,
                ExportResponsesGeneralFields.ElasticSearchResponseStatus
            };

            foreach (var item in questionStore)
            {
                if (item.Value is DateQuestionDefinition)
                {
                    reportFields.Add($"{item.Key}:date");
                }
                else if (item.Value is NumericQuestionDefinition)
                {
                    reportFields.Add($"{item.Key}:number");
                }
                else if (item.Value is MultipleSelectionQuestionDefinition ||
                    item.Value is MultipleSelectionGridQuestionDefinition ||
                    item.Value is PictureMultipleSelectionQuestionDefinition)
                {
                    reportFields.Add($"{item.Key}:multi");
                }
                else
                {
                    reportFields.Add(item.Key);
                }
            }
            return reportFields;
        }
    }
}
