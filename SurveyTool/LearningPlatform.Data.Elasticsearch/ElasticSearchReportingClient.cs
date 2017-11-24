using System;
using System.Configuration;
using Elasticsearch.Net;
using LearningPlatform.Domain.Reporting;

namespace LearningPlatform.Data.Elasticsearch
{
    public class ElasticsearchReportingClient : IElasticsearchReportingClient
    {
        private static volatile ElasticLowLevelClient _elasticsearchClient;
        private static readonly object SyncRoot = new object();
        private readonly string _indexName;

        public ElasticsearchReportingClient()
        {
            _indexName = ConfigurationManager.AppSettings["ESSurveyDefaultIndexName"]??"survey";
        }

        public ElasticLowLevelClient GetInstance()
        {
            if (_elasticsearchClient != null) return _elasticsearchClient;
            lock (SyncRoot)
            {
                if (_elasticsearchClient != null) return _elasticsearchClient;
                var node = new Uri(ConfigurationManager.ConnectionStrings["ESConnectionString"].ConnectionString);
                var config = new ConnectionConfiguration(node);
                _elasticsearchClient = new ElasticLowLevelClient(config);
            }

            return _elasticsearchClient;
        }

        public string GetSurveyIndex(string surveyId, bool isTesting)
        {
            return isTesting ? $"{_indexName}_{surveyId}_test" : $"{_indexName}_{surveyId}";
        }

        public string GetDefaultTypeName()
        {
            return "responses";
        }
    }
}