using System.Collections.Generic;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyThemes;

namespace LearningPlatform.Application.SurveyExecution.Models
{
    public class LookAndFeelByPageBindingModel
    {
        public string SurveyId { get; set; }
        public string PageId { get; set; }

        public string SurveyLayoutId { get; set; }
        public string PageLayoutId { get; set; }
        public string SurveyThemeId { get; set; }
        public string PageThemeId { get; set; }
        public Theme OverridePageTheme { get; set; }

        public OrderType OrderType { get; set; }

        public string BackgroundImage { get; set; }
        public string Logo { get; set; }
        public List<string> TemporaryPictures { get; set; }
    }
}
