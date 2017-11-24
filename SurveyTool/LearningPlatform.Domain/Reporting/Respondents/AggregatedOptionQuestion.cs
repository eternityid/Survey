using System.Collections.Generic;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedOptionQuestion: AggregatedQuestion
    {
        public List<AggregatedOption> Answers { get; set; }
    }
}
