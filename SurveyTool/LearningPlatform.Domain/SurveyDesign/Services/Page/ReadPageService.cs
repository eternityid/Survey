using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class ReadPageService
    {
        private readonly INodeRepository _nodeRepository;
        private readonly ILibraryNodeRepository _libraryNodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;

        public ReadPageService(IOptionListRepository optionListRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            INodeRepository nodeRepository,
            ILibraryNodeRepository libraryNodeRepository)
        {
            _optionListRepository = optionListRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _nodeRepository = nodeRepository;
            _libraryNodeRepository = libraryNodeRepository;
        }

        public PageDefinition GetShallowSurveyPage(string pageId)
        {
            var node = _nodeRepository.GetNode(pageId);
            return node as PageDefinition;
        }

        public PageDefinition GetFullSurveyPage(string pageId)
        {
            var shallowPage = GetShallowSurveyPage(pageId);
            if (shallowPage != null) PopulatePageContent(shallowPage);
            return shallowPage;
        }

        public PageDefinition PopulatePageContent(PageDefinition shallowPage)
        {
            var questionMap = ReadQuestions(shallowPage.QuestionIds);
            var optionListMap = ReadOptionLists(ExtractOptionListIds(questionMap.Values));

            BuildPage(shallowPage, questionMap, optionListMap);

            return shallowPage;
        }

        public List<PageDefinition> GetPagesBySurveyIdAndThemeId(string surveyId, string themeId) {
            var pages = _nodeRepository
                    .GetNodesBySurveyId(surveyId)
                    .OfType<PageDefinition>()
                    .Where(p => p.PageThemeId == themeId)
                    .ToList();

            return pages;
        }

        public List<string> ExtractOptionListIds(IEnumerable<QuestionDefinition> questions)
        {
            var optionListIds = new List<string>();

            foreach (var question in questions)
            {
                var questionWithOptions = question as QuestionWithOptionsDefinition;
                if (questionWithOptions != null) optionListIds.Add(questionWithOptions.OptionListId);

                var gridQuestion = question as GridQuestionDefinition;
                var subQuestionWithOptions = gridQuestion?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                if (subQuestionWithOptions != null) optionListIds.Add(subQuestionWithOptions.OptionListId);
            }

            return optionListIds;
        }

        private Dictionary<string, QuestionDefinition> ReadQuestions(IList<string> questionIds)
        {
            var questionMap = new Dictionary<string, QuestionDefinition>();

            var questions = _questionDefinitionRepository.GetByIds(questionIds);
            foreach (var question in questions)
            {
                questionMap[question.Id] = question;
            }

            return questionMap;
        }

        private Dictionary<string, OptionList> ReadOptionLists(IEnumerable<string> optionListIds)
        {
            var optionListMap = new Dictionary<string, OptionList>();

            var optionLists = _optionListRepository.Find(p => optionListIds.Contains(p.Id));
            foreach (var optionList in optionLists)
            {
                optionListMap[optionList.Id] = optionList;
            }

            return optionListMap;
        }

        private void BuildPage(PageDefinition page, Dictionary<string, QuestionDefinition> questionMap, Dictionary<string, OptionList> optionListMap)
        {
            page.QuestionDefinitions = new List<QuestionDefinition>();

            foreach (var questionId in page.QuestionIds)
            {
                var question = questionMap[questionId];

                MapOptionList(question as QuestionWithOptionsDefinition, optionListMap);

                var gridQuestion = question as GridQuestionDefinition;
                if (gridQuestion != null) MapOptionList(gridQuestion.SubQuestionDefinition as QuestionWithOptionsDefinition, optionListMap);

                page.QuestionDefinitions.Add(question);
            }
        }

        private void MapOptionList(QuestionWithOptionsDefinition questionWithOption, Dictionary<string, OptionList> optionListMap)
        {
            if (questionWithOption != null) questionWithOption.OptionList = optionListMap[questionWithOption.OptionListId];
        }
    }
}
