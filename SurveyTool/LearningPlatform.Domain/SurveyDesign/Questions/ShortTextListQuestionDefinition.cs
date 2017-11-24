using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class ShortTextListQuestionDefinition : GridQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.ShortTextList;
    }
}