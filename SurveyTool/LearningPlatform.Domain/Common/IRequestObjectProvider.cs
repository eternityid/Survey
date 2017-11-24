namespace LearningPlatform.Domain.Common
{
    public interface IRequestObjectProvider<T>
    {
        T Get();
        void Set(T obj);
    }
}