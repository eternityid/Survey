using System;

namespace LearningPlatform.Domain.Exceptions
{
    public class SurveyNotFoundException : Exception
    {
        public SurveyNotFoundException(string message) : base(message)
        {
        }
    }
}
