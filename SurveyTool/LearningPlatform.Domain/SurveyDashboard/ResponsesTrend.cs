using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDashboard
{
    public class ResponsesTrend
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public List<ResponsesPoint> Points { get; set; }
    }
}
