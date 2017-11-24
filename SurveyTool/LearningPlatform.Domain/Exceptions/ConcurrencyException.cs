using System;

namespace LearningPlatform.Domain.Exceptions
{
    public class ConcurrencyException : Exception
    {
        public ConcurrencyException() { }
        public ConcurrencyException(string message) : base(message) { }
    }
}
