using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class SplitPageService
    {
        private readonly INodeRepository _nodeRepository;
        private readonly SurveyDesign.Factory _surveyDesignFactory;

        public SplitPageService(INodeRepository nodeRepository,
            SurveyDesign.Factory surveyDesignFactory)
        {
            _nodeRepository = nodeRepository;
            _surveyDesignFactory = surveyDesignFactory;
        }


        public PageDefinition Split(Folder folder, PageDefinition sourcePage, int splitPoint, string pageTitle)
        {
            var newPage = InsertNewPageToFolder(folder, sourcePage, splitPoint, pageTitle);

            UpdateSourcePage(sourcePage, splitPoint);

            return newPage;
        }


        private PageDefinition InsertNewPageToFolder(Folder folder, PageDefinition sourcePage, int splitPoint, string pageTitle)
        {
            var surveyFactory = _surveyDesignFactory.Invoke(sourcePage.SurveyId, useDatabaseIds: true);

            var newPage = surveyFactory.Page(p =>
            {
                p.Alias = "Page_" + DateTime.Now.Ticks;
                p.OrderType = OrderType.InOrder;
                p.NavigationButtonSettings = NavigationButtonSettings.Default;
                p.Title = surveyFactory.CreateLanguageString(pageTitle);
                p.QuestionIds = sourcePage.QuestionIds.Skip(splitPoint).ToList();
                p.Version = Guid.NewGuid().ToString();
            });
            _nodeRepository.Add(newPage);

            if (sourcePage.SkipCommands.Any())
            {
                newPage.SkipCommands = sourcePage.SkipCommands.Select(p => new SkipCommand
                {
                    SurveyId = p.SurveyId,
                    PageDefinitionId = newPage.Id,
                    SkipToQuestionId = p.SkipToQuestionId,
                    Expression = p.Expression
                }).ToList();
                _nodeRepository.Update(newPage);
            }

            var newPageIndex = folder.ChildIds.IndexOf(sourcePage.Id) + 1;
            UpdateParentFolder(folder, newPage, newPageIndex);
            return newPage;
        }

        private void UpdateParentFolder(Folder folder, PageDefinition newPage, int newPageIndex)
        {
            folder.ChildIds.Insert(newPageIndex, newPage.Id);
            folder.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(folder);
        }

        private void UpdateSourcePage(PageDefinition sourcePage, int splitPoint)
        {
            sourcePage.QuestionIds = sourcePage.QuestionIds.Take(splitPoint).ToList();
            sourcePage.SkipCommands = new List<SkipCommand>();
            sourcePage.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(sourcePage);
        }

    }
}
