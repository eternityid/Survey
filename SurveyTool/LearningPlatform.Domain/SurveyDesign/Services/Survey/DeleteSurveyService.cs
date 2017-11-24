using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class DeleteSurveyService
    {
        private readonly ILibrarySurveyRepository _librarySurveyRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;
        private readonly IThemeRepository _themeRepository;

        public DeleteSurveyService(ILibrarySurveyRepository librarySurveyRepository,
            INodeRepository nodeRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository,
            IThemeRepository themeRepository)
        {
            _librarySurveyRepository = librarySurveyRepository;
            _nodeRepository = nodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
            _themeRepository = themeRepository;
        }

        public void DeleteLibrarySurvey(Domain.SurveyDesign.Survey survey)
        {
            var nodeService = new NodeService(survey);
            _librarySurveyRepository.Delete(survey);
            _nodeRepository.DeleteMany(nodeService.Nodes.ToList());
            _questionDefinitionRepository.DeleteMany(nodeService.QuestionDefinitions.ToList());
            _optionListRepository.DeleteMany(nodeService.OptionLists.ToList());
            if (survey.CustomThemeId != null) _themeRepository.Delete(survey.CustomThemeId);
        }
    }
}
