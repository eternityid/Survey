using System;

namespace LearningPlatform.Domain.Exceptions
{
    public class InvalidPageExeption : Exception
    {
        public InvalidPageExeption() { }
        public InvalidPageExeption(string message) : base(message) { }
    }
}
