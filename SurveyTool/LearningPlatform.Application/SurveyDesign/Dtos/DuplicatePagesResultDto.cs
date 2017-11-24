using LearningPlatform.Domain.SurveyDesign.Pages;
using System.Collections.Generic;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class DuplicatePagesResultDto
    {
        public IList<PageDefinition> NewPages { get; set; }
        public string FolderVersion { get; set; }
        public string SurveyVersion { get; set; }
    }
}