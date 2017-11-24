using System;

namespace LearningPlatform.Domain.SurveyDashboard
{
    public class ResponsesPoint
    {
        public DateTime At { get; set; }
        public int Started { get; set; }
        public int InProgress { get; set; }
        public int Completed { get; set; }
    }
}
