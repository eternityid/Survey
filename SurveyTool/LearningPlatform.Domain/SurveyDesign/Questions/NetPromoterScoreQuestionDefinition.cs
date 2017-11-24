using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class NetPromoterScoreQuestionDefinition : SingleSelectionQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.NetPromoterScore;
    }
}