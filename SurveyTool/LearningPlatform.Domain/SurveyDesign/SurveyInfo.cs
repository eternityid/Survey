using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Surveys;
namespace LearningPlatform.Domain.SurveyDesign
{
    public class SurveyInfo: IVersionable
    {
        public string Name { get; set; }
        public string SurveyPublishUrl { get; set; }
        public bool IsPublished { get; set; }
        public bool IsChangedAfterPublished { get; set; }
        public bool IsInvitationOnlySurvey { get; set; }
        public bool IsSingleSignOnSurvey { get; set; }

        public SurveyStatus SurveyStatus { get; set; }
        public byte[] RowVersion { get; set; }
        public bool IsDeleted { get; set; }
        public string CustomColumns { get; set; }
    }
}
