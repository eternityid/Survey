namespace LearningPlatform.Domain.Common
{
    public interface IPosition : IFixedPosition
    {
        int Position { get; set; }
    }
}