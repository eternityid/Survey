using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Validation;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class QuestionValidationRepository : IQuestionValidationRepository
    {
        private readonly SurveysContextProvider _contextProvider;
        private readonly GenericRepository<QuestionValidation> _genericQuestionValRepository;

        public QuestionValidationRepository(SurveysContextProvider contextProvider, GenericRepository<QuestionValidation> genericQuestionValRepository)
        {
            _contextProvider = contextProvider;
            _genericQuestionValRepository = genericQuestionValRepository;
        }

        private SurveysDb.SurveysContext Context { get { return _contextProvider.Get(); } }

        public List<QuestionValidation> GetAllByQuestionId(string questionId)
        {
            //TODO: Consider index use (and where clause)
            return Context.QuestionValidations
                .Where(p => p.QuestionDefinitionId == questionId)
                .ToList();
        }

        public QuestionValidation Get(long questionValidationId, string questionId)
        {
            //TODO: Consider index use (and where clause)
            return Context.QuestionValidations
                .FirstOrDefault(p => p.QuestionDefinitionId == questionId && p.Id == questionValidationId);
        }

        public void Add(QuestionValidation validation)
        {
            _genericQuestionValRepository.Add(validation);
        }

        public void Delete(long id)
        {
            _genericQuestionValRepository.Remove(id);
        }
    }
}
