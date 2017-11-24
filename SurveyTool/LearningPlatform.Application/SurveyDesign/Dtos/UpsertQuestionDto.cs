using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class UpsertQuestionDto
    {
        public QuestionDefinition Question { get; set; }
        public List<FileUpload> PictureOptions { get; set; }
        public int QuestionIndex { get; set; }
    }
}
