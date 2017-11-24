using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.Validation;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface IQuestionValidationRepository
    {
        List<QuestionValidation> GetAllByQuestionId(string questionId);
        void Delete(long id);
        QuestionValidation Get(long questionValidationId, string questionId);
    }
}
