using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class LongTextListQuestionDefinition : GridQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.LongTextList;
    }
}
