using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyThemes;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class PageAndThemeDto
    {
        public PageDefinition Page { get; set; }
        public Theme NewUserTheme { get; set; }
    }
}
