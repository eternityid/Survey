using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyThemes;

namespace LearningPlatform.Application.SurveyExecution.Models
{
    public class LayoutAndThemeModel
    {
        public Layout Layout { get; set; }
        public Theme Theme { get; set; }
        public Theme OverrideTheme { get; set; }
    }
}
