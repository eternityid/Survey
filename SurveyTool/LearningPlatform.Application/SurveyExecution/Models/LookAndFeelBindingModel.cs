using System.Collections.Generic;

namespace LearningPlatform.Application.SurveyExecution.Models
{
    public class LookAndFeelBindingModel
    {
        public string SurveyId { get; set; }
        public string LayoutId { get; set; }
        public string ThemeId { get; set; }
        public string BackgroundImage { get; set; }
        public string Logo { get; set; }
        public List<string> TemporaryPictures { get; set; }
    }
}
