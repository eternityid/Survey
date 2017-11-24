using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class ReadSurveyService : IReadSurveyService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly ILibrarySurveyRepository _librarySurveyRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;

        public ReadSurveyService(ISurveyRepository surveyRepository,
            ILibrarySurveyRepository librarySurveyRepository,
            INodeRepository nodeRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository)
        {
            _surveyRepository = surveyRepository;
            _librarySurveyRepository = librarySurveyRepository;
            _nodeRepository = nodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
        }

        public Domain.SurveyDesign.Survey GetFullSurvey(string surveyId)
        {
            var survey = _surveyRepository.GetById(surveyId);
            if (survey != null) PopulateSurveyContent(survey);
            return survey;
        }

        public Domain.SurveyDesign.Survey GetFullLibrarySurvey(string libraryId, string surveyId)
        {
            var survey = _librarySurveyRepository.GetSurvey(libraryId, surveyId);
            if (survey != null) PopulateSurveyContent(survey);
            return survey;
        }

        public void PopulateSurveyContent(Domain.SurveyDesign.Survey survey)
        {
            if (survey == null) throw new ArgumentNullException(nameof(survey));

            var optionListMap = ReadOptionLists(survey.Id);
            var nodeMap = ReadNodes(survey.Id);
            var questionMap = ReadQuestions(survey.Id);
            survey.TopFolder = nodeMap[survey.TopFolderId] as Folder;
            survey.Name = survey.SurveySettings.SurveyTitle;
            new NodeHierarchyBuilder(nodeMap, questionMap, optionListMap).Build(survey.TopFolder);
        }

        private Dictionary<string, Node> ReadNodes(string surveyId)
        {
            var nodes = _nodeRepository.GetNodesBySurveyId(surveyId);
            var nodeMap = new Dictionary<string, Node>();
            foreach (var node in nodes)
            {
                nodeMap[node.Id] = node;
            }
            return nodeMap;
        }

        private Dictionary<string, QuestionDefinition> ReadQuestions(string surveyId)
        {
            var questionDefinitions = _questionDefinitionRepository.GetBySurveyId(surveyId);
            var questionMap = new Dictionary<string, QuestionDefinition>();
            foreach (var question in questionDefinitions)
            {
                questionMap[question.Id] = question;
            }
            return questionMap;
        }

        private Dictionary<string, OptionList> ReadOptionLists(string surveyId)
        {
            var optionLists = _optionListRepository.GetBySurveyId(surveyId);
            var optionListMap = new Dictionary<string, OptionList>();
            foreach (var optionList in optionLists)
            {
                optionListMap[optionList.Id] = optionList;
            }
            return optionListMap;
        }


    }
}
