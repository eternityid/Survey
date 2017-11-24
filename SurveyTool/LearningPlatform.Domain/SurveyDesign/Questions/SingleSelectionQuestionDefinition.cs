using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class SingleSelectionQuestionDefinition : QuestionWithOptionsDefinition
    {
        public LanguageString LikertLeftText { get; set; }
        public LanguageString LikertCenterText { get; set; }
        public LanguageString LikertRightText { get; set; }
        public bool? RenderOptionByButton { get; set; }
        public override string Type => QuestionTypeConstants.SingleSelection;
    }
}