using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class DeleteLibraryPageService
    {
        private readonly ILibraryNodeRepository _libraryNodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;
        private readonly ReadPageService _readPageService;

        public DeleteLibraryPageService(ILibraryNodeRepository libraryNodeRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository,
            ReadPageService readPageService)
        {
            _libraryNodeRepository = libraryNodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
            _readPageService = readPageService;
        }

        public void Delete(PageDefinition page)
        {
            _libraryNodeRepository.Delete(page);

            var optionListIds = _readPageService.ExtractOptionListIds(page.QuestionDefinitions);
            _optionListRepository.DeleteMany(optionListIds);
            _questionDefinitionRepository.DeleteMany(page.QuestionDefinitions);
        }
    }
}
