using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    class ExpressionRepository : IExpressionRepository
    {
        private readonly GenericRepository<Expression> _genericRepository;
        private readonly SurveysContextProvider _contextProvider;

        public ExpressionRepository(SurveysContextProvider contextProvider, GenericRepository<Expression> genericRepository)
        {
            _contextProvider = contextProvider;
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context => _contextProvider.Get();


        public IEnumerable<Expression> GetExpressionsUsedQuestionOrOption(string questionId, IEnumerable<string> optionIds)
        {
            return (from e in Context.Expressions
                    join ei in Context.ExpressionItems on e.Id equals ei.ExpressionId
                    where ei.QuestionId == questionId || optionIds.Contains(ei.OptionId)
                    select e).ToList();
        }

        public IEnumerable<Expression> GetExpressionsUsedQuestionOrOption(string questionId, string optionId)
        {
            return (from e in Context.Expressions
                join ei in Context.ExpressionItems on e.Id equals ei.ExpressionId
                where ei.QuestionId == questionId && ei.OptionId == optionId
                select e).ToList();
        }


        public void Delete(long id)
        {
            _genericRepository.Remove(id);
        }

        public void DeleteExpressions(IEnumerable<Expression> expressions)
        {
            _genericRepository.RemoveRange(expressions);
        }
    }
}
