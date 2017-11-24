using System;

namespace LearningPlatform.ResponseDataIndexer
{
    public class ElasticsearchException : Exception
    {
        public ElasticsearchException(string message, Exception innerException = null) : base(message, innerException)
        {
        }
    }
}