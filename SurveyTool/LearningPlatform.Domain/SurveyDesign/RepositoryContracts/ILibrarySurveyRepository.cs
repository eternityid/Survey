using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface ILibrarySurveyRepository
    {
        void Add(Survey survey);
        void Update(Survey survey);
        void Delete(Survey survey);
        Survey GetSurvey(string libraryId, string surveyId);
        IList<Survey> GetSurveysByLibraryId(string libraryId);
        IList<Survey> SearchByLibraryId(string libraryId, string query, int limit, int offset);
        int CountByLibraryId(string libraryId, string query = null);
    }
}