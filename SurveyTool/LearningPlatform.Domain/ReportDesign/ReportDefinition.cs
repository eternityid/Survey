using LearningPlatform.Domain.Common;
using System;


namespace LearningPlatform.Domain.ReportDesign
{
    public class ReportDefinition
    {
        public ReportDefinition()
        {
            Type = ReportType.User;
        }

        public ReportDefinition(string name, string surveyId, string userId, ReportType type)
        {
            Name = name;
            SurveyId = surveyId;
            UserId = userId;
            Type = type;
            Created = DateTime.Now;
            Modified = DateTime.Now;
        }

        public long Id { get; set; }
        public string Name { get; set; }

        public DateTime? Created { get; set; }

        public DateTime? Modified { get; set; }

        public string CreatedDate => Created != null ? Convert.ToDateTime(Created).ToString(SurveyConstants.SURVEY_REPORT_DATE_FORMAT) : string.Empty;

        public string ModifiedDate => Modified != null ? Convert.ToDateTime(Modified).ToString(SurveyConstants.SURVEY_REPORT_DATE_FORMAT) : string.Empty;

        public string SurveyId { get; set; }
        public string UserId { get; set; }

        public ReportType Type { get; set; }

        public bool IsSystemReport => ReportType.System == Type;
    }
}
