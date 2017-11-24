using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    class SkipCommandRepository : ISkipCommandRepository
    {
        public void Delete(long id)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(IEnumerable<SkipCommand> skips)
        {
            throw new System.NotImplementedException();
        }

        public void DeleteBySkipToQuestion(string questionId)
        {
            throw new System.NotImplementedException();
        }

        public SkipCommand Add(SkipCommand skipCommand)
        {
            throw new System.NotImplementedException();
        }

        public SkipCommand Update(SkipCommand skipCommand)
        {
            throw new System.NotImplementedException();
        }

        public SkipCommand GetById(long id)
        {
            throw new System.NotImplementedException();
        }

        public SkipCommand GetByExpression(long expressionId)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<SkipCommand> GetBySurveyId(string surveyId)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<SkipCommand> GetByExpressionIds(IEnumerable<long> expressionIds)
        {
            throw new System.NotImplementedException();
        }
    }
}
