using System.Collections.Generic;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.Models;
using LearningPlatform.Domain.Reporting.Respondents;

namespace LearningPlatform.Application.ReportDesign.Models
{
    public class ReportPagesViewModel
    {
        public string SurveyId { get; set; }
        public long ReportId { get; set; }
        public string Name { get; set; }
        public ICollection<ReportPageDefinition> Pages { get; set; }
        public AggregatedRespondents Data { get; set; }
        public List<ReportOpenTextViewModel> OpenTextRespondents { get; set; }
        public List<ReportPageQuestionModel> Questions { get; set; }
    }
}
