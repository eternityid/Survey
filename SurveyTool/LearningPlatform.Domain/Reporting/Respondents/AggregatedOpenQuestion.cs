using System.Collections.Generic;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedOpenQuestion: AggregatedQuestion
    {
        public List<string> OpenAnswers { get; set; }
    }
}
