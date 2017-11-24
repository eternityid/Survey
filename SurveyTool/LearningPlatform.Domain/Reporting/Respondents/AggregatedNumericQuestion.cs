using System.Collections.Generic;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedNumericQuestion: AggregatedQuestion
    {
        public float? Min { get; set; }
        public float? Max { get; set; }
        public float? Avg { get; set; }
        public float? Sum { get; set; }
        public List<AggregatedOption> AggregatedOptions { get; set; }
    }
}
