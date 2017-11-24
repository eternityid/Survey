using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Domain.Reporting
{
    public static class EsQuestionNameHelper
    {
        public static string GetQuestionNameSuffix(QuestionDefinition question)
        {
            if (question is MultipleSelectionQuestionDefinition)
            {
                return ":multi";
            }
            if (question is DateQuestionDefinition)
            {
                return ":date";
            }
            if (question is NumericQuestionDefinition)
            {
                return ":number";
            }
            return string.Empty;
        }
    }
}
