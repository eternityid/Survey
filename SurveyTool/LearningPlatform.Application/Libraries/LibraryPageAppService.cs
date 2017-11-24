using LearningPlatform.Application.Libraries.Dtos;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Libraries;
using LearningPlatform.Domain.SurveyDesign.Services.Page;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Application.Libraries
{
    public class LibraryPageAppService
    {
        private readonly ReadLibraryService _readLibraryService;
        private readonly ReadPageService _readPageService;
        private readonly InsertLibraryPageService _insertLibraryPageService;
        private readonly Domain.SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        private readonly DeleteLibraryPageService _deleteLibraryPageService;
        private readonly DuplicateLibraryPageService _duplicateLibraryPageService;
        private readonly ILibraryNodeRepository _libraryNodeRepository;

        public LibraryPageAppService(ReadLibraryService readLibraryService,
            ReadPageService readPageService,
            InsertLibraryPageService insertLibraryPageService,
            Domain.SurveyDesign.SurveyDesign.Factory surveyDesignFactory,
            DeleteLibraryPageService deleteLibraryPageService,
            DuplicateLibraryPageService duplicateLibraryPageService,
            ILibraryNodeRepository libraryNodeRepository)
        {
            _readLibraryService = readLibraryService;
            _readPageService = readPageService;
            _insertLibraryPageService = insertLibraryPageService;
            _surveyDesignFactory = surveyDesignFactory;
            _deleteLibraryPageService = deleteLibraryPageService;
            _duplicateLibraryPageService = duplicateLibraryPageService;
            _libraryNodeRepository = libraryNodeRepository;
        }

        public void InsertPage(PageDefinition page, string userId)
        {
            _readPageService.PopulatePageContent(page);

            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            _insertLibraryPageService.Insert(page, defaultLibrary.Id);
        }

        public IList<PageDefinition> GetShallowPages(string userId)
        {
            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            return _libraryNodeRepository.GetPagesByLibraryId(defaultLibrary.Id);
        }

        public PageDefinition GetShallowPage(string userId, string pageId)
        {
            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            return _libraryNodeRepository.GetPage(defaultLibrary.Id, pageId);
        }

        public SearchLibraryPageResultDto SearchPages(string userId, SearchLibraryPageDto searchDto)
        {
            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);

            var totalPages = _libraryNodeRepository.CountPagesByLibraryId(defaultLibrary.Id, searchDto.Query);
            var pages = _libraryNodeRepository.SearchPagesByLibraryId(defaultLibrary.Id, searchDto.Query, searchDto.Limit, searchDto.Offset);

            var result = new SearchLibraryPageResultDto
            {
                TotalPages = totalPages,
                Pages = new List<LibraryPageDetailsDto>()
            };

            foreach (var page in pages)
            {
                var pageDetail = new LibraryPageDetailsDto(page) {NumberOfQuestions = page.QuestionIds.Count};
                result.Pages.Add(pageDetail);
            }

            return result;
        }

        public LibraryPageDetailsDto DuplicatePage(string userId, PageDefinition sourcePage)
        {
            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            var defaultPageTitle = sourcePage.Title.Items.FirstOrDefault();
            if (defaultPageTitle != null) defaultPageTitle.Text = $"Copy of {defaultPageTitle.Text}";

            _readPageService.PopulatePageContent(sourcePage);
            sourcePage.LibraryId = defaultLibrary.Id;

            var newLibraryPage = _duplicateLibraryPageService.DuplicatePage(sourcePage);
            var newLibraryPageDetail = new LibraryPageDetailsDto(newLibraryPage)
            {
                NumberOfQuestions = newLibraryPage.QuestionIds.Count()
            };

            return newLibraryPageDetail;
        }

        public PageDefinition UpdatePage(PageDefinition page, string title, string description) {
            var surveyFactory = _surveyDesignFactory.Invoke(useDatabaseIds: true);
            var newGuid = Guid.NewGuid();

            page.Title = surveyFactory.CreateLanguageString(title);
            page.Description = surveyFactory.CreateLanguageString(description ?? string.Empty);
            page.RowVersion = newGuid.ToByteArray();
            page.Version = newGuid.ToString();
            _libraryNodeRepository.Update(page);

            return page;
        }

        public void DeletePage(PageDefinition page) {
            _readPageService.PopulatePageContent(page);
            _deleteLibraryPageService.Delete(page);
        }
    }
}
