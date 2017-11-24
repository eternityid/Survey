using LearningPlatform.Domain.SurveyDesign.LanguageStrings;

namespace LearningPlatform.Domain.SurveyDesign.Validation
{
    public class RegularExpressionValidation : QuestionValidation
    {
        public LanguageString ErrorMessage { get; set; }
        public string MatchPattern { get; set; }
    }
}