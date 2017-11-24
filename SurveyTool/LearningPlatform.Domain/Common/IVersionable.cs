namespace LearningPlatform.Domain.Common
{
    //TODO: Review naming
    public interface IVersionable
    {
        byte[] RowVersion { get; set; }
    }
}
