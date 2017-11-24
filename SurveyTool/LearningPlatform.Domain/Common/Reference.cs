namespace LearningPlatform.Domain.Common
{
    public class Reference<T> where T:class
    {
        public Reference(T value)
        {
            Value = value;
        }

        public T Value { get; set; }
    }
}