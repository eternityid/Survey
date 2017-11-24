using System.Collections.Generic;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class DuplicatePagesDto
    {
        public List<string> SourcePageIds { get; set; }
        public string LibraryId { get; set; }
        public int DuplicatePoint { get; set; }
    }
}