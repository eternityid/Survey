using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Options
{
    public interface IOptions
    {
        IList<Option> Options { get; }
    }
}