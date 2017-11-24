using System;

namespace LearningPlatform.Domain.Exceptions
{
    public class SurveyClosedException : Exception
    {
        public SurveyClosedException() { }
        public SurveyClosedException(string message) : base(message) { }
    }
}
