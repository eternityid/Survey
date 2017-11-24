using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.Domain.SurveyExecution.RepositoryContracts
{
    public interface IResponseRowRepository
    {
        IEnumerable<ResponseRow> GetRows(IList<Question> questions, long respondentId, string surveyId);
        void Update(IEnumerable<ResponseRow> responseRows);
        void Delete(IList<string> questionIds, long respondentId, string surveyId);
        IList<ResponseRow> GetAll(string surveyId);
    }
}