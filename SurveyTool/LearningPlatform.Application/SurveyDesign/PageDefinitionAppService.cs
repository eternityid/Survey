using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Page;
using LearningPlatform.Domain.SurveyThemes;
using System;
using System.Collections.Generic;
using MergePageService = LearningPlatform.Domain.SurveyDesign.Services.Page.MergePageService;
using SplitPageService = LearningPlatform.Domain.SurveyDesign.Services.Page.SplitPageService;

namespace LearningPlatform.Application.SurveyDesign
{
    public class PageDefinitionAppService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly MergePageService _mergePageService;
        private readonly SplitPageService _splitPageService;
        private readonly MovePageService _movePageDefinitionService;
        private readonly ThemeService _themeService;
        private readonly INodeRepository _nodeRepository;
        private readonly ILibraryNodeRepository _libraryNodeRepository;
        private readonly InsertPageService _insertPageService;
        private readonly UpdatePageService _updatePageService;
        private readonly DeletePageService _deletePageService;
        private readonly ReadPageService _readPageService;
        private readonly DuplicatePageFromLibraryService _duplicatePageFromLibraryService;
        private readonly PictureQuestionService _pictureQuestionService;
        private readonly Domain.SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public PageDefinitionAppService(ISurveyRepository surveyRepository,
            MergePageService mergePageService,
            SplitPageService splitPageService,
            MovePageService movePageDefinitionService,
            ThemeService themeService,
            INodeRepository nodeRepository,
            ILibraryNodeRepository libraryNodeRepository,
            InsertPageService insertPageService,
            UpdatePageService updatePageService,
            DeletePageService deletePageService,
            ReadPageService readPageService,
            DuplicatePageFromLibraryService duplicatePageFromLibraryService,
            PictureQuestionService pictureQuestionService,
            Domain.SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyRepository = surveyRepository;
            _mergePageService = mergePageService;
            _splitPageService = splitPageService;
            _movePageDefinitionService = movePageDefinitionService;
            _themeService = themeService;
            _nodeRepository = nodeRepository;
            _libraryNodeRepository = libraryNodeRepository;
            _insertPageService = insertPageService;
            _updatePageService = updatePageService;
            _deletePageService = deletePageService;
            _readPageService = readPageService;
            _duplicatePageFromLibraryService = duplicatePageFromLibraryService;
            _pictureQuestionService = pictureQuestionService;
            _surveyDesignFactory = surveyDesignFactory;
        }

        public PageDefinition GetShallowPage(string pageId)
        {
            return _readPageService.GetShallowSurveyPage(pageId);
        }

        public PageDefinition GetPage(string pageId)
        {
            return _readPageService.GetFullSurveyPage(pageId);
        }

        public IList<PageDefinition> GetLibraryShallowPages(string libraryId, IList<string> pageIds)
        {
            return _libraryNodeRepository.GetPagesByLibraryId(libraryId, pageIds);
        }

        public CreatePageResultDto CreatePage(Folder folder, int newPageIndex, string newPageTitle)
        {
            var surveyFactory = _surveyDesignFactory.Invoke(useDatabaseIds: true);
            var newPage = surveyFactory.Page(p =>
            {
                p.SurveyId = folder.SurveyId;
                p.Alias = "Page_" + DateTime.Now.Ticks;
                p.OrderType = OrderType.InOrder;
                p.NavigationButtonSettings = NavigationButtonSettings.Default;
                p.Title = surveyFactory.CreateLanguageString(newPageTitle);
                p.Version = Guid.NewGuid().ToString();
            });

            _insertPageService.Insert(folder, newPage, newPageIndex);

            var survey = _surveyRepository.UpdateModifiedDate(newPage.SurveyId);
            return new CreatePageResultDto
            {
                NewPage = newPage,
                FolderVersion = folder.Version,
                SurveyVersion = survey.Version
            };
        }

        public PageWithSurveyEtagDto UpdatePage(PageDefinition page, PageAndThemeDto pageAndTheme, string currentUserId)
        {
            _themeService.UpdateThemeForPage(page, pageAndTheme.Page, pageAndTheme.NewUserTheme, currentUserId);

            pageAndTheme.Page.Id = page.Id;
            _updatePageService.Update(pageAndTheme.Page);

            var survey = _surveyRepository.UpdateModifiedDate(pageAndTheme.Page.SurveyId);
            return new PageWithSurveyEtagDto
            {
                Page =  pageAndTheme.Page,
                SurveyEtag = survey.Version
            };
        }

        public PageWithSurveyEtagDto UpdateSkipCommands(PageDefinition page, List<SkipCommand> skipCommands)
        {
            page.SkipCommands = skipCommands;
            _updatePageService.Update(page);

            var survey = _surveyRepository.UpdateModifiedDate(page.SurveyId);
            return new PageWithSurveyEtagDto
            {
                Page = page,
                SurveyEtag = survey.Version
            };
        }

        public SplitPageResultDto SplitPage(Folder folder, PageDefinition sourcePage, int splitPoint, string pageTitle)
        {
            var newPage = _splitPageService.Split(folder, sourcePage, splitPoint, pageTitle);

            var survey =_surveyRepository.UpdateModifiedDate(folder.SurveyId);
            return new SplitPageResultDto
            {
                SourcePage = sourcePage,
                NewPage = newPage,
                FolderVersion = folder.Version,
                SurveyVersion = survey.Version
            };
        }

        public MergeTwoPagesResultDto MergePages(Folder folder, PageDefinition firstPage, PageDefinition secondPage)
        {
            _mergePageService.Merge(folder, firstPage, secondPage);

            var survey = _surveyRepository.UpdateModifiedDate(folder.SurveyId);
            return new MergeTwoPagesResultDto
            {
                NewPage = firstPage,
                FolderVersion = folder.Version,
                SurveyVersion = survey.Version
            };
        }

        public FolderWithSurveyEtagDto MovePage(Folder folder, string pageId, int newPageIndex)
        {
            _movePageDefinitionService.UpdatePosition(folder, pageId, newPageIndex);

            var survey = _surveyRepository.UpdateModifiedDate(folder.SurveyId);

            return new FolderWithSurveyEtagDto
            {
                Folder = folder,
                SurveyEtag = survey.Version
            };

        }

        public PageWithSurveyEtagDto DeletePage(Folder folder, PageDefinition page)
        {
            folder.ChildIds.Remove(page.Id);
            folder.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(folder);

            _deletePageService.Delete(page);

            var survey = _surveyRepository.UpdateModifiedDate(page.SurveyId);

            _pictureQuestionService.DeleteQuestionPictureFolders(page.SurveyId, page.QuestionIds);

            return new PageWithSurveyEtagDto
            {
                Page = page,
                SurveyEtag = survey.Version
            };
        }

        public DuplicatePagesResultDto DuplicatePages(Folder folder, IList<PageDefinition> sourcePages, int duplicatePoint)
        {
            var newPages = _duplicatePageFromLibraryService.DuplicatePages(folder, sourcePages, duplicatePoint);
            var survey = _surveyRepository.UpdateModifiedDate(folder.SurveyId);

            return new DuplicatePagesResultDto
            {
                NewPages = newPages,
                FolderVersion = folder.Version,
                SurveyVersion = survey.Version
            };
        }
    }
}
