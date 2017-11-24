
using System.Collections.Generic;

namespace LearningPlatform.Application.ReportDesign.Models
{
    public class ReportOpenTextViewModel
    {
        public string QuestionAlias { get; set; }
        public IList<string> Answers { get; set; }
    }
}
