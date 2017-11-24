using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Page;
using LearningPlatform.Domain.SurveyDesign.Services.Question;
using LearningPlatform.Domain.SurveyExecution;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class LibraryPageService
    {
        private readonly MapperService _mapper;
        private readonly ReadPageService _readPageService;
        private readonly ReadQuestionService _readQuestionService;
        private readonly ILibraryNodeRepository _libraryNodeRepository;

        public LibraryPageService(MapperService mapper,
            ReadPageService readPageService,
            ReadQuestionService readQuestionService,
            ILibraryNodeRepository libraryNodeRepository)
        {
            _mapper = mapper;
            _readPageService = readPageService;
            _readQuestionService = readQuestionService;
            _libraryNodeRepository = libraryNodeRepository;
        }

        public SurveyExecution.Page GetLibraryPage(string libraryId, string pageId)
        {
            var libraryPage = _libraryNodeRepository.GetPage(libraryId, pageId);
            if (libraryPage == null) return null;

            _readPageService.PopulatePageContent(libraryPage);
            var questions = libraryPage
                .QuestionDefinitions
                .Select(questionDefinition => _mapper.Map<SurveyExecution.Questions.Question>(questionDefinition))
                .ToList();

            var page = new SurveyExecution.Page(questions)
            {
                Title = _mapper.Map<EvaluationString>(libraryPage.Title),
                Description = _mapper.Map<EvaluationString>(libraryPage.Description),
                NavigationButtons = NavigationButtons.None,
                KeyboardSupport = true,
                OrderType = libraryPage.OrderType,
                Seed = libraryPage.Seed
            };

            return page;
        }

        public SurveyExecution.Page RenderPageByLibraryQuestionId(string libraryId, string questionId) {

            var questionDefinition = _readQuestionService.GetFullLibraryQuestion(libraryId, questionId);
            if (questionDefinition == null) return null;

            var question = _mapper.Map<SurveyExecution.Questions.Question>(questionDefinition);
            var page = new SurveyExecution.Page(new List<SurveyExecution.Questions.Question> { question })
            {
                NavigationButtons = NavigationButtons.None
            };
            return page;
        }
    }
}
