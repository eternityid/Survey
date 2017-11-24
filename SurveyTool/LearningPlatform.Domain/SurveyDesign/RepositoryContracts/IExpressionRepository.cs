using LearningPlatform.Domain.SurveyDesign.Expressions;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    // Need to be implemented as a service
    public interface IExpressionRepository
    {
        IEnumerable<Expression> GetExpressionsUsedQuestionOrOption(string questionId, IEnumerable<string> optionIds);
        IEnumerable<Expression> GetExpressionsUsedQuestionOrOption(string questionId, string optionId);
    }
}
