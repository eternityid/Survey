using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Respondents;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface IRespondentRepository
    {
        void Add(Respondent respondent, bool isTesting);
        void AddUsingMerge(Respondent respondent, bool isTesting);
        void Update(Respondent respondent, bool isTesting);
        Respondent Get(string surveyId, string emailAddress, bool isTesting);
        Respondent Get(long respondentId, string surveyId, bool isTesting);
        IQueryable<Respondent> GetAll(string surveyId, bool isTesting);
        List<Respondent> Search(RespondentSearchFilter filter, int start, int limit, bool isTesting);
        List<Respondent> Search(RespondentSearchFilter filter, bool isTesting);
        int Count(RespondentSearchFilter filter, bool isTesting);
        void DeleteById(long respondentId, bool isTesting);
    }
}