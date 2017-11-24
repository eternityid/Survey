using LearningPlatform.Domain.SurveyDesign.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface ILibraryQuestionRepository
    {
        QuestionDefinition Add(QuestionDefinition question);
        void Update(QuestionDefinition question);
        void Delete(QuestionDefinition question);
        QuestionDefinition GetQuestion(string libraryId, string questionId);
        IList<QuestionDefinition> GetQuestionsByLibraryId(string libraryId);
        IList<QuestionDefinition> SearchByLibraryId(string libraryId, string term, int limit, int offset);
        int CountByLibraryId(string libraryId, string query = null);
        IList<QuestionDefinition> GetQuestions(string libraryId, IList<string> questionIds);
    }
}