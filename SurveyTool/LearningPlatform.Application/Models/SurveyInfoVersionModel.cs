using LearningPlatform.Domain.Common;

namespace LearningPlatform.Application.Models
{
    public class SurveyInfoVersionModel: IVersionable
    {
        public string SurveyId { get; set; }
        public byte[] RowVersion { get; set; }
    }
}