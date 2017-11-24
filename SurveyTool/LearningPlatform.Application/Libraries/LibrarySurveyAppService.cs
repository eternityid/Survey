using LearningPlatform.Application.Libraries.Dtos;
using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Libraries;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Application.Libraries
{
    public class LibrarySurveyAppService
    {
        private readonly DuplicateSurveyService _duplicateSurveyService;
        private readonly ReadSurveyService _readSurveyService;
        private readonly ReadLibraryService _readLibraryService;
        private readonly DeleteSurveyService _deleteSurveyService;
        private readonly ILibrarySurveyRepository _librarySurveyRepository;
        private readonly INodeRepository _nodeRepository;

        public LibrarySurveyAppService(DuplicateSurveyService duplicateSurveyService,
            ReadSurveyService readSurveyService,
            ReadLibraryService readLibraryService,
             DeleteSurveyService deleteSurveyService,
             ILibrarySurveyRepository librarySurveyRepository,
             INodeRepository nodeRepository)
        {
            _duplicateSurveyService = duplicateSurveyService;
            _readSurveyService = readSurveyService;
            _readLibraryService = readLibraryService;
            _deleteSurveyService = deleteSurveyService;
            _librarySurveyRepository = librarySurveyRepository;
            _nodeRepository = nodeRepository;
        }

        public void InsertSurvey(Survey survey, string userId)
        {
            _readSurveyService.PopulateSurveyContent(survey);

            var errors = new ValidateSurveyService(survey).Validate();
            if (errors.Any()) throw new InvalidOperationException("Can't add an invalid survey to library");

            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            survey.LibraryId = defaultLibrary.Id;
            survey.Id = null;

            _duplicateSurveyService.DuplicateLibrarySurvey(survey, survey.SurveySettings.SurveyTitle);
        }

        public List<SurveyListItemDto> GetSurveyTitles(string userId)
        {
            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            var surveys = _librarySurveyRepository.GetSurveysByLibraryId(defaultLibrary.Id);

            return surveys.Select(survey => new SurveyListItemDto(survey)).ToList();
        }

        public SearchLibrarySurveyResultDto SearchSurveys(string userId, SearchLibrarySurveyDto searchDto)
        {
            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);

            var totalSurveys = _librarySurveyRepository.CountByLibraryId(defaultLibrary.Id, searchDto.Query);
            var surveys = _librarySurveyRepository.SearchByLibraryId(defaultLibrary.Id, searchDto.Query, searchDto.Limit, searchDto.Offset);
            var surveyIds = surveys.Select(p => p.Id).ToList();

            var nodes = _nodeRepository.GetNodesBySurveyIds(surveyIds);
            var folders = nodes.OfType<Folder>().ToList();
            var pages = nodes.OfType<PageDefinition>().ToList();

            var folderMap = new Dictionary<string, IList<string>>();
            foreach (var folder in folders)
            {
                folderMap[folder.Id] = folder.ChildIds;
            }

            var pageMap = new Dictionary<string, IList<string>>();
            foreach (var page in pages)
            {
                pageMap[page.Id] = page.QuestionIds;
            }

            var result = new SearchLibrarySurveyResultDto
            {
                TotalSurveys = totalSurveys,
                Surveys = new List<LibrarySurveyDetailsDto>()
            };
            foreach (var survey in surveys)
            {
                var surveyDetails = new LibrarySurveyDetailsDto(survey);
                IList<string> pageIds;
                if (!folderMap.TryGetValue(survey.TopFolderId, out pageIds)) continue;

                surveyDetails.NumberOfPages = pageIds.Count;
                surveyDetails.NumberOfQuestions = 0;
                foreach (var pageId in pageIds)
                {
                    IList<string> questionIds;
                    if (pageMap.TryGetValue(pageId, out questionIds)) surveyDetails.NumberOfQuestions = surveyDetails.NumberOfQuestions + questionIds.Count;
                }
                result.Surveys.Add(surveyDetails);
            }
            return result;
        }

        public Survey GetShallowSurvey(string libraryId, string surveyId)
        {
            return _librarySurveyRepository.GetSurvey(libraryId, surveyId);
        }

        public LibrarySurveyDetailsDto DuplicateSurvey(string userId, Survey sourceSurvey)
        {
            _readSurveyService.PopulateSurveyContent(sourceSurvey);
            sourceSurvey.UserId = userId;

            var newSurvey = _duplicateSurveyService.DuplicateLibrarySurvey(sourceSurvey);
            var newLibrarySurveyDetails = new LibrarySurveyDetailsDto(newSurvey)
            {
                NumberOfPages = sourceSurvey.TopFolder.ChildNodes.Count,
                NumberOfQuestions = 0
            };

            foreach (var node in sourceSurvey.TopFolder.ChildNodes)
            {
                var page = node as PageDefinition;
                if (page != null) newLibrarySurveyDetails.NumberOfQuestions += page.QuestionDefinitions.Count;
            }

            return newLibrarySurveyDetails;
        }

        public LibrarySurveyDetailsDto UpdateSurvey(Survey survey, string newSurveyTitle)
        {
            survey.SurveySettings.SurveyTitle = newSurveyTitle.Trim();
            survey.SurveySettings.RowVersion = Guid.NewGuid().ToByteArray();
            survey.SurveySettings.Version = Guid.NewGuid().ToString();
            survey.Modified = DateTime.Now;

            _librarySurveyRepository.Update(survey);
            return new LibrarySurveyDetailsDto(survey);
        }

        public void DeleteSurvey(Survey survey)
        {
            _readSurveyService.PopulateSurveyContent(survey);
            _deleteSurveyService.DeleteLibrarySurvey(survey);
        }
    }
}

