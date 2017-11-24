using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    class SkipCommandRepository : ISkipCommandRepository
    {
        private readonly GenericRepository<SkipCommand> _genericRepository;

        public SkipCommandRepository(GenericRepository<SkipCommand> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context { get { return _genericRepository.Context; } }

        public void Delete(long id)
        {
            _genericRepository.Remove(id);
        }

        public void Delete(IEnumerable<SkipCommand> skips)
        {
            _genericRepository.RemoveRange(skips);
        }

        public void DeleteBySkipToQuestion(string questionId)
        {
            var skipsJumpToQuestion = Context.SkipCommand.Where(s=>s.SkipToQuestionId == questionId);
            _genericRepository.RemoveRange(skipsJumpToQuestion);
        }

        public SkipCommand Add(SkipCommand skipCommand)
        {
            _genericRepository.Add(skipCommand);
            return skipCommand;
        }

        public SkipCommand Update(SkipCommand skipCommand)
        {
            _genericRepository.Update(skipCommand);
            return skipCommand;
        }

        public SkipCommand GetById(long id)
        {
            return Context.SkipCommand
                .Include(s => s.Expression.ExpressionItems)
                .FirstOrDefault(s => s.Id == id);
        }

        public SkipCommand GetByExpression(long expressionId)
        {
            //TODO: Consider index use (and where clause)
            return Context.SkipCommand
                .Include(s => s.Expression.ExpressionItems)
                .SingleOrDefault(s => s.Expression.Id == expressionId);
        }

        public IEnumerable<SkipCommand> GetBySurveyId(string surveyId)
        {
            //TODO: Consider index use (and where clause)
            return Context.SkipCommand
                .Include(s => s.Expression.ExpressionItems)
                .Where(s => s.SurveyId == surveyId);
        }

        public IEnumerable<SkipCommand> GetByExpressionIds(IEnumerable<long> expressionIds)
        {
            return Context.SkipCommand.Where(s=>expressionIds.Contains(s.Expression.Id));
        }
    }
}
