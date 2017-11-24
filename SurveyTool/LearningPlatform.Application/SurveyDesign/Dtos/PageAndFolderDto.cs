using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class PageAndFolderDto
    {
        public Folder Folder { set; get; }
        public PageDefinition Page { set; get; }
    }
}
