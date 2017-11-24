using LearningPlatform.Domain.SurveyDesign.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class DuplicateQuestionsFromLibaryResultDto
    {
        public string SurveyVersion { get; set; }
        public string PageVersion { get; set; }
        public IList<QuestionDefinition> NewQuestions { get; set; }
    }
}
