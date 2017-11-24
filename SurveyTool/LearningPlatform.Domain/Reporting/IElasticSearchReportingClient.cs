using Elasticsearch.Net;

namespace LearningPlatform.Domain.Reporting
{
    public interface IElasticsearchReportingClient
    {
        ElasticLowLevelClient GetInstance();
        string GetSurveyIndex(string surveyId, bool isTesting);
        string GetDefaultTypeName();
    }
}