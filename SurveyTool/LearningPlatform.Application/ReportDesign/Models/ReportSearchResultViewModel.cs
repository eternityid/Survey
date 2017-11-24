using System.Collections.Generic;

namespace LearningPlatform.Application.ReportDesign.Models
{
    public class ReportSearchResultViewModel
    {
        public List<ReportViewModel> Reports { get; set; }
        public int TotalReportsFound { get; set; }
    }
}
