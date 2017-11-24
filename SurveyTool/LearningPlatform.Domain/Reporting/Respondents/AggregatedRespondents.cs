using System.Collections.Generic;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedRespondents
    {
        public string SurveyName { get; set; }
        public int TotalRespondents { get; set; }
        public List<AggregatedQuestion> Questions { get; set; }
    }
}
