using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyThemes;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class UpsertThemeDto
    {
        public string SurveyId { get; set; }
        public string LayoutId { get; set; }
        public Theme Theme { get; set; }
        public string BaseThemeId { get; set; }
        public bool IsSaveNewTheme { get; set; }
    }
}
