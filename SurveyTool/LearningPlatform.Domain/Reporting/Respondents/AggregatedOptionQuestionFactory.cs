using Elasticsearch.Net;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedOptionQuestionFactory
    {
        private readonly ReadQuestionService _readQuestionService;

        public AggregatedOptionQuestionFactory(ReadQuestionService readQuestionService)
        {
            _readQuestionService = readQuestionService;
        }

        public AggregatedQuestion CreateAggregatedOptionQuestion(
            QuestionWithOptionsDefinition questionWithOptions,
            ElasticsearchResponse<dynamic> aggregationsRespondentsResult, List<QuestionDefinition> questionDefinitions)
        {
            var aggregatedOptions = new List<AggregatedOption>();
            var buckets =
                aggregationsRespondentsResult.Body["aggregations"][questionWithOptions.Alias][questionWithOptions.Alias]["buckets"];
            var numberOfRespondents = (int)aggregationsRespondentsResult.Body["aggregations"][questionWithOptions.Alias]["doc_count"];
            var numberOfResponses = 0;
            var expandedOptions = _readQuestionService.GetExpandedOptions(questionDefinitions, questionWithOptions.OptionList.Options);

            foreach (var option in expandedOptions)
            {
                var docCount = 0;
                foreach (var bucket in buckets)
                {
                    if (bucket["key"].Equals(option.Alias))
                    {
                        docCount = (int) bucket["doc_count"];
                        break;
                    }
                }
                aggregatedOptions.Add(new AggregatedOption
                {
                    OptionText = option.Text.GetFirstItemText(),
                    Count = docCount,
                    Percentage = (numberOfRespondents != 0) ? Math.Round(((double)docCount / numberOfRespondents) * 100, 2) : 0
                });
                numberOfResponses += docCount;
            }

            return new AggregatedOptionQuestion {
                Answers = aggregatedOptions,
                NumberOfResponses = numberOfResponses ,
                NumberOfRespondents = numberOfRespondents
            };
        }
    }
}
