using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;

namespace LearningPlatform.Domain.ReportDesign.Models
{
    public class ReportPageQuestionModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Type { get; set; }
        public string QuestionAlias { get; set; }
        public List<Option> Options { get; set; }
        public List<Option> Topics { get; set; }
    }
}