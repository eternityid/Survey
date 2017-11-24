using Elasticsearch.Net;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.UtilServices;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedNumericQuestionFactory
    {
        public AggregatedQuestion CreateAggregatedNumericQuestion(
            NumericQuestionDefinition numericQuestion,
            ElasticsearchResponse<dynamic> aggregationsRespondentsResult,
            ElasticsearchResponse<dynamic> aggregationsCountRespondentsResult)
        {
            var questionAggStatsResult =
                aggregationsRespondentsResult.Body["aggregations"][numericQuestion.Alias + "_stats"];

            var aggregatedOptions = new List<AggregatedOption>();
            var buckets =
                aggregationsRespondentsResult.Body["aggregations"][numericQuestion.Alias]["buckets"];

            var numberOfRespondents = (int)aggregationsCountRespondentsResult.Body["aggregations"][numericQuestion.Alias]["doc_count"];

            foreach (var bucket in buckets)
            {
                var docCount = (int)bucket["doc_count"];
                aggregatedOptions.Add(new AggregatedOption
                {
                    OptionText = bucket["key"].ToString(),
                    Count = docCount,
                    Percentage = CalculatingService.CalculatePercentage(docCount, numberOfRespondents)
                });
            }

            return new AggregatedNumericQuestion
            {
                Min = ParseFloatOrNull(questionAggStatsResult["min"]),
                Max = ParseFloatOrNull(questionAggStatsResult["max"]),
                Sum = ParseFloatOrNull(questionAggStatsResult["sum"]),
                Avg = ParseFloatOrNull(questionAggStatsResult["avg"]),
                AggregatedOptions = aggregatedOptions,
                NumberOfRespondents = numberOfRespondents,
                NumberOfResponses = numberOfRespondents
            };
        }

        private dynamic ParseFloatOrNull(dynamic value)
        {
            //TODO ask about Double.MaxValue
            return value == null ?
                null :
                Convert.ToSingle(value);
        }
    }
}