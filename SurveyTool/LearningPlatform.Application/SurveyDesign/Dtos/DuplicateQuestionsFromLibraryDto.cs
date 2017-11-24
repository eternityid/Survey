using System.Collections.Generic;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class DuplicateQuestionsFromLibraryDto
    {
        public List<string> SourceQuestionIds { get; set; }
        public string LibraryId { get; set; }
    }
}
