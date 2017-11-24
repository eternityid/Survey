namespace LearningPlatform.Domain.Common
{
    public class DummyRequestObjectProvider<T> : IRequestObjectProvider<T>
    {
        private T _obj;

        public T Get()
        {
            return _obj;
        }

        public void Set(T obj)
        {
            _obj = obj;
        }
    }
}