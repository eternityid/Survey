using System;

namespace LearningPlatform.Domain.Exceptions
{
    public class InvalidQuestionExeption : Exception
    {
        public InvalidQuestionExeption() { }
        public InvalidQuestionExeption(string message) : base(message) { }
    }
}
