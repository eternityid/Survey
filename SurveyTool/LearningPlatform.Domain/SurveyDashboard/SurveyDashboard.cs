
using System;

namespace LearningPlatform.Domain.SurveyDashboard
{
    public class SurveyDashboard
    {
        public int Total { get; set; }
        public int Started { get; set; }
        public int InProgress { get; set; }
        public int Completed { get; set; }
        public short DropoutRate { get; set; }
        public ResponsesTrend Trend { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? LastPublishedDate { get; set; }
    }
}