using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Application.SurveyExecution.Models
{
    public class PagePreviewBindingModel
    {
        public PageDefinition Page { get; set; }
        public List<string> TemporaryPictures { get; set; }
    }
}
