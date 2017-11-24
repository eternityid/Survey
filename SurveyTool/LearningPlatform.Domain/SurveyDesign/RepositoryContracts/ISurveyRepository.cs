using LearningPlatform.Domain.SurveyDesign.Surveys;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface ISurveyRepository
    {
        Survey GetById(string surveyId);
        void Add(Survey survey);
        void Update(Survey survey);
        void Delete(Survey survey);
        Survey UpdateModifiedDate(string surveyId);
        Survey UpdateLastPublished(string surveyId);
        IEnumerable<Survey> GetByUserId(string userId);
        IList<Survey> GetSurveys(SurveySearchFilter surveySearchModel);
        int Count(SurveySearchFilter surveySearchModel);
        bool Exists(string surveyId);
    }
}