using LearningPlatform.Domain.SurveyDesign.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface IQuestionDefinitionRepository
    {
        List<QuestionDefinition> GetBySurveyId(string surveyId);
        List<QuestionDefinition> GetAllQuestionsInPage(string surveyId, string pageId);
        QuestionDefinition GetById(string questionId);
        ICollection<QuestionAlias> GetQuestionAliases(string surveyId, string questionAlias);
        QuestionDefinition Add(QuestionDefinition questionDefinition);
        void AddMany(IList<QuestionDefinition> question);
        void Update(QuestionDefinition questionDefinition);
        void Delete(string questionId);
        List<QuestionDefinition> GetByIds(IList<string> questionIds);
        void DeleteMany(IList<QuestionDefinition> questions);
    }
}
