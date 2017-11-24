using System;
using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    //TODO: Currently has the functionality to move pages. This is no longer needed. 
    // Also exposes GetAllBySurveyAndPageTheme to reset page themes.
    // Not sure we need this class...
    internal class PageDefinitionRepository : IPageDefinitionRepository
    {
        public PageDefinition GetById(string pageId)
        {
            throw new NotImplementedException();
        }

        public PageDefinition GetPageAndThemeById(string pageId)
        {
            throw new NotImplementedException();
        }

        public PageDefinition GetPageWithQuestionsById(string pageId)
        {
            throw new NotImplementedException();
        }

        public PageDefinition GetWithoutIncludingById(string pageId)
        {
            throw new NotImplementedException();
        }

        public List<PageDefinition> GetAllBySurveyId(string surveyId)
        {
            throw new NotImplementedException();
        }

        public IList<PageDefinition> GetAllBySurveyAndPageTheme(string surveyId, string pageThemeId)
        {
            throw new NotImplementedException();
        }

        public void Delete(string surveyId, string pageId)
        {
            throw new NotImplementedException();
        }

        public void Add(PageDefinition page)
        {
            throw new NotImplementedException();
        }

        public bool UpdatePosition(string surveyId, int indexPostion)
        {
            throw new NotImplementedException();
        }

        public void Update(PageDefinition page)
        {
            throw new NotImplementedException();
        }
    }
}
