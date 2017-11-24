using Elasticsearch.Net;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using LearningPlatform.Domain.UtilServices;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedSelectionGridQuestionFactory
    {
        private readonly ReadQuestionService _readQuestionService;

        public AggregatedSelectionGridQuestionFactory(ReadQuestionService readQuestionService)
        {
            _readQuestionService = readQuestionService;
        }

        public AggregatedQuestion CreateAggregatedMultipleSelectionGridQuestion(
            GridQuestionDefinition gridQuestion,
            ElasticsearchResponse<dynamic> aggregationsRespondentsResult,
            ElasticsearchResponse<dynamic> aggregationsCountRespondentsResult, List<QuestionDefinition> questionDefinitions)
        {
            var subQuestionDefinition = gridQuestion.SubQuestionDefinition as QuestionWithOptionsDefinition;

            var aggregatedOptionQuestions = new List<AggregatedOptionQuestion>();
            var expandedTopics = _readQuestionService.GetExpandedOptions(questionDefinitions, gridQuestion.OptionList.Options);
            var expandedOptions = _readQuestionService.GetExpandedOptions(questionDefinitions, subQuestionDefinition.OptionList.Options);
            foreach (var topic in expandedTopics)
            {
                var subQuestionName = gridQuestion.Alias + "_" + topic.Alias;
                var buckets = aggregationsRespondentsResult.Body["aggregations"][subQuestionName][subQuestionName]["buckets"];
                var numberOfRespondents = (int)aggregationsRespondentsResult.Body["aggregations"][subQuestionName]["doc_count"];
                var numberOfResponses = 0;
                var aggregatedOptionsGrid = new List<AggregatedOption>();
                var aggregatedOptionQuestion = new AggregatedOptionQuestion();
                foreach (var option in expandedOptions)
                {
                    var docCount = 0;
                    foreach (var bucket in buckets)
                    {
                        if (bucket["key"].Equals(option.Alias))
                        {
                            docCount = (int) bucket["doc_count"];
                        }
                    }
                    aggregatedOptionsGrid.Add(new AggregatedOption
                    {
                        OptionText = option.Text.GetFirstItemText(),
                        Count = docCount,
                        Percentage = CalculatingService.CalculatePercentage(docCount, numberOfRespondents)
                    });
                    numberOfResponses += docCount;
                }
                aggregatedOptionQuestion.NumberOfResponses = numberOfResponses;
                aggregatedOptionQuestion.NumberOfRespondents = numberOfRespondents;
                aggregatedOptionQuestion.QuestionName = topic.Alias;
                aggregatedOptionQuestion.QuestionText = topic.Text.GetFirstItemText();
                aggregatedOptionQuestion.Answers = aggregatedOptionsGrid;
                aggregatedOptionQuestions.Add(aggregatedOptionQuestion);
            }

            return new AggregatedSelectionGridQuestion
            {
                Topics = aggregatedOptionQuestions,
                NumberOfRespondents = (int)aggregationsCountRespondentsResult.Body["aggregations"][gridQuestion.Alias]["doc_count"],
                NumberOfResponses = (int)aggregationsCountRespondentsResult.Body["aggregations"][gridQuestion.Alias]["doc_count"]
            };
        }
    }
}