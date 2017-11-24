using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Collections.Generic;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    // TODO: Will be removed when questiondefinitionservice is refactored. Note! Expressions are also used in skip.
    class ExpressionRepository : IExpressionRepository
    {
        public IEnumerable<Expression> GetExpressionsUsedQuestionOrOption(string questionId, IEnumerable<string> optionIds)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<Expression> GetExpressionsUsedQuestionOrOption(string questionId, string optionId)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new System.NotImplementedException();
        }

        public void DeleteExpressions(IEnumerable<Expression> expressions)
        {
            throw new System.NotImplementedException();
        }
    }
}
