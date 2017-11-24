using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class PageDefinitionRepository : IPageDefinitionRepository
    {
        private readonly SurveysContextProvider _contextProvider;
        private readonly GenericRepository<Node> _genericNodeRepository;

        public PageDefinitionRepository(SurveysContextProvider contextProvider, GenericRepository<Node> genericNodeRepository)
        {
            _contextProvider = contextProvider;
            _genericNodeRepository = genericNodeRepository;
        }

        private SurveysDb.SurveysContext Context { get { return _contextProvider.Get(); } }

        public PageDefinition GetById(string pageId)
        {
            //TODO: Consider index use (and where clause)
            return Context.PageDefinitions
                .Include(p => p.PageThemeOverrides)
                .Include(p => p.SkipCommands.Select(s => s.Expression.ExpressionItems))
                .FirstOrDefault(p => p.Id == pageId);
        }

        public PageDefinition GetPageWithQuestionsById(string pageId)
        {
            //TODO: Consider index use (and where clause)
            return Context.PageDefinitions
                .Include(p => p.Title)
                .Include(p => p.Description)
                .Include(p => p.PageThemeOverrides)                
                .Include(p => p.QuestionDefinitions.Select(s => s.QuestionMaskExpression.ExpressionItems))
                .Include(p => p.SkipCommands.Select(s => s.Expression.ExpressionItems))
                .FirstOrDefault(p => p.Id == pageId);
        }

        public PageDefinition GetWithoutIncludingById(string pageId)
        {
            return Context.PageDefinitions.FirstOrDefault(page => page.Id == pageId);
        }

        public PageDefinition GetPageAndThemeById(string pageId)
        {
            return Context.PageDefinitions
                .Include(p => p.PageThemeOverrides)
                .FirstOrDefault(p => p.Id == pageId);
        }


        public List<PageDefinition> GetAllBySurveyId(string surveyId)
        {
            return Context.PageDefinitions
                    .Where(p => p.SurveyId == surveyId)
                    .OrderBy(p => p.Position)
                    .ToList();
        }

        public IList<PageDefinition> GetAllBySurveyAndPageTheme(string surveyId, string pageThemeId)
        {
            return Context.PageDefinitions
                .Where(p => p.SurveyId == surveyId && p.PageThemeId != null && p.PageThemeId == pageThemeId).ToList();
        }

        public void Delete(string surveyId, string pageId)
        {
            _genericNodeRepository.Remove(pageId);
        }

        public void Add(PageDefinition pageDefinition)
        {
            _genericNodeRepository.Add(pageDefinition);
        }

        public bool UpdatePosition(string surveyId, int postion)
        {
            try
            {
                List<PageDefinition> pages = GetAllBySurveyId(surveyId);
                for (int page = 1; page < pages.Count; page++)
                {
                    if (pages[page].Position >= postion)
                        pages[page].Position = pages[page].Position + 1;
                    _genericNodeRepository.Update(pages[page]);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public void Update(PageDefinition pageDefinition)
        {
            _genericNodeRepository.Update(pageDefinition);
        }
    }
}
