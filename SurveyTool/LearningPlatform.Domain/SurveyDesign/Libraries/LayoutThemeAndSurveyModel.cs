using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyThemes;

namespace LearningPlatform.Domain.SurveyDesign.Libraries
{
    public class LayoutThemeAndSurveyModel
    {
        public Layout Layout { get; set; }
        public Theme Theme { get; set; }
        public Survey Survey { get; set; }
    }
}
