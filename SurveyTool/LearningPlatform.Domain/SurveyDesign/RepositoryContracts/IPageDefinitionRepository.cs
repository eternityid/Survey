using LearningPlatform.Domain.SurveyDesign.Pages;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface IPageDefinitionRepository
    {
        PageDefinition GetById(string pageId);
        PageDefinition GetPageAndThemeById(string pageId);
        PageDefinition GetPageWithQuestionsById(string pageId);
        PageDefinition GetWithoutIncludingById(string pageId);
        List<PageDefinition> GetAllBySurveyId(string surveyId);
        IList<PageDefinition> GetAllBySurveyAndPageTheme(string surveyId, string pageThemeId);
        void Delete(string surveyId, string pageId);
        void Add(PageDefinition page);
        bool UpdatePosition(string surveyId, int indexPostion);
        void Update(PageDefinition page);
    }
}
