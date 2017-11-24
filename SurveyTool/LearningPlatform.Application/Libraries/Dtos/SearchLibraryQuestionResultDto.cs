using LearningPlatform.Domain.SurveyDesign.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Application.Libraries.Dtos
{
    public class SearchLibraryQuestionResultDto
    {
        public int TotalQuestions { get; set; }
        public IList<QuestionDefinition> Questions { get; set; }
    }
}