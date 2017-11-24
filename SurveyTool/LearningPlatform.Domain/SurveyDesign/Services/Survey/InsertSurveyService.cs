using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Collections.Generic;
using System.Linq;

//TODO: This namespace should be moved to Domain
namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class InsertSurveyService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly ILibrarySurveyRepository _librarySurveyRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;

        private readonly IOptionListRepository _optionListRepository;

        public InsertSurveyService(ISurveyRepository surveyRepository,
            ILibrarySurveyRepository librarySurveyRepository,
            INodeRepository nodeRepository,
            IOptionListRepository optionListRepository,
            IQuestionDefinitionRepository questionDefinitionRepository)
        {
            _surveyRepository = surveyRepository;
            _librarySurveyRepository = librarySurveyRepository;
            _nodeRepository = nodeRepository;
            _optionListRepository = optionListRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
        }

        public void InsertSurvey(Domain.SurveyDesign.Survey survey)
        {
            new EnsureSurveyObjectIdsService().EnsureObjectIds(survey);
            var nodeService = new NodeService(survey);
            _surveyRepository.Add(survey);

            InsertSharedOptionLists(survey);

            var nodes = nodeService.Nodes.ToList();
            _nodeRepository.AddMany(nodes);

            foreach (var node in nodes)
            {
                var folder = node as Folder;
                if (folder?.Loop != null) _optionListRepository.Add(folder.Loop.OptionList);
            }
            InsertQuestions(nodeService.QuestionDefinitions.ToList());
        }

        public void InsertLibrarySurvey(Domain.SurveyDesign.Survey survey)
        {
            new EnsureSurveyObjectIdsService().EnsureObjectIds(survey);
            var nodeService = new NodeService(survey);
            _librarySurveyRepository.Add(survey);

            InsertSharedOptionLists(survey);

            var nodes = nodeService.Nodes.ToList();
            _nodeRepository.AddMany(nodes);

            foreach (var node in nodes)
            {
                var folder = node as Folder;
                if (folder?.Loop != null) _optionListRepository.Add(folder.Loop.OptionList);
            }
            InsertQuestions(nodeService.QuestionDefinitions.ToList());
        }


        private void InsertQuestions(IList<QuestionDefinition> questions)
        {
            _questionDefinitionRepository.AddMany(questions);

            var optionLists = GetOptionLists(questions);
            _optionListRepository.AddMany(optionLists);
        }

        private List<OptionList> GetOptionLists(IList<QuestionDefinition> questions)
        {
            var optionLists = new List<OptionList>();
            foreach (var question in questions)
            {
                var questionWithOptions = question as QuestionWithOptionsDefinition;
                if (questionWithOptions != null) optionLists.Add(questionWithOptions.OptionList);

                var gridOptionsDefinition = question as GridQuestionDefinition;
                var subQuestionWithOptions = gridOptionsDefinition?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                if (subQuestionWithOptions != null) optionLists.Add(subQuestionWithOptions.OptionList);
            }
            return optionLists;
        }


        private void InsertSharedOptionLists(Domain.SurveyDesign.Survey survey)
        {
            if (survey.SharedOptionLists != null)
            {
                foreach (var optionList in survey.SharedOptionLists)
                {
                    _optionListRepository.Add(optionList);
                }
            }
        }
    }
}
