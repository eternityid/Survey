using System.Collections.Generic;
using LearningPlatform.Domain.Respondents;

namespace LearningPlatform.Domain.SurveyExecution.RepositoryContracts
{
    public interface IRespondentSurveyExecutionRepository
    {
        Respondent Get(long respondentId, string surveyId, bool isTesting);
        Respondent GetWithExternalId(string externalId, string surveyId, bool isTesting);
        void Add(Respondent respondent, bool isTesting);
        void Update(Respondent respondent, bool isTesting);
        IList<Respondent> GetAll(string surveyId);
    }
}