using LearningPlatform.Domain.SurveyDesign.Expressions;
using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyDesign.FlowLogic
{
    public class SkipCommand
    {
        [JsonIgnore]
        public long Id { get; set; }
        public Expression Expression { get; set; }
        public string SkipToQuestionId { get; set; }
        public string PageDefinitionId { get; set; }
        public string SurveyId { get; set; }
    }
}