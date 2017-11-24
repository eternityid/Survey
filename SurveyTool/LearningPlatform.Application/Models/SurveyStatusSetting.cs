using LearningPlatform.Domain.SurveyDesign.Surveys;

namespace LearningPlatform.Application.Models
{
    public class SurveyStatusSetting
    {
        public string SurveyId { get; set; }
        public SurveyStatus Status { get; set; }
        public byte[] RowVersion { get; set; }
    }
}