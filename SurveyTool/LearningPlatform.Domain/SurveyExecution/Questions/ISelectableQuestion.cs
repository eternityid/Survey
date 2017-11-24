using LearningPlatform.Domain.SurveyExecution.Options;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public interface ISelectableQuestion
    {
        bool IsChecked(Option option);
    }
}