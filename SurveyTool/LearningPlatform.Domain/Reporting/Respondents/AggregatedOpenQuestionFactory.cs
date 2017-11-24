using Elasticsearch.Net;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedOpenQuestionFactory
    {
        public AggregatedQuestion CreateAggregatedOpenQuestion(QuestionDefinition questionDefinition,
            ElasticsearchResponse<dynamic> aggregationsCountRespondentsResult)
        {
            var numberOfRespondents = (int)aggregationsCountRespondentsResult.Body["aggregations"][questionDefinition.Alias]["doc_count"];
            return new AggregatedOpenQuestion {
                NumberOfRespondents = numberOfRespondents,
                NumberOfResponses = numberOfRespondents
            };
        }
    }
}
