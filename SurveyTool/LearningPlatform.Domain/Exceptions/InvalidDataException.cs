using System;
namespace LearningPlatform.Domain.Exceptions
{
    public class InvalidDataException : Exception
    {
        public InvalidDataException()
        {
        }

        public InvalidDataException(string message)
            : base(message)
        {
        }

        public InvalidDataException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
