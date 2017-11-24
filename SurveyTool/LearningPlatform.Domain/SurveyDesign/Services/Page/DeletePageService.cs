using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class DeletePageService
    {
        private readonly INodeRepository _nodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;
        private readonly ReadPageService _readPageService;

        public DeletePageService(INodeRepository nodeRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository, ReadPageService readPageService)
        {
            _nodeRepository = nodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
            _readPageService = readPageService;
        }

        public void Delete(PageDefinition page)
        {
            var optionListIds = _readPageService.ExtractOptionListIds(page.QuestionDefinitions);

            _optionListRepository.DeleteMany(optionListIds);
            _questionDefinitionRepository.DeleteMany(page.QuestionDefinitions);
            _nodeRepository.Delete(page);
        }
    }
}
