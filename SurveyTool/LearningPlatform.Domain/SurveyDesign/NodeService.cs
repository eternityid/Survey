using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyExecution;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class NodeService : INodeService
    {
        private readonly Folder _topFolder;
        private readonly IDictionary<string, PageDefinition> _pageDefinitions = new Dictionary<string, PageDefinition>();
        private readonly IDictionary<Node, Folder> _childParentFolders = new Dictionary<Node, Folder>();

        private readonly IDictionary<string, Node> _nodes = new Dictionary<string, Node>();
        private readonly IDictionary<string, QuestionDefinition> _questionDefinitionsAliases =
            new Dictionary<string, QuestionDefinition>();
        private readonly IDictionary<string, QuestionDefinition> _questionDefinitionsIds =
            new Dictionary<string, QuestionDefinition>();
        private readonly IDictionary<string, string> _questionIdsInPageId =
            new Dictionary<string, string>();

        private readonly IDictionary<string, Folder> _loops = new Dictionary<string, Folder>();
        private readonly IDictionary<string, OptionList> _optionLists = new Dictionary<string, OptionList>();
        private readonly IDictionary<string, Option> _optionsIds = new Dictionary<string, Option>();
        private readonly IDictionary<string, Option> _optionsAlias = new Dictionary<string, Option>();

        public NodeService(Survey survey)
        {
            Survey = survey;
            if (survey?.TopFolder != null)
            {
                _topFolder = survey.TopFolder;
                Build(survey);

                ProgressState = new ProgressState(survey);
            }
        }

        public Survey Survey { get; }

        public ProgressState ProgressState { get; }

        public Folder GetParentFolder(Node node)
        {
            Folder parent;
            return _childParentFolders.TryGetValue(node, out parent) ? parent : null;
        }

        public PageDefinition GetPageDefinition(string id)
        {
            return _pageDefinitions[id];
        }

        public string GetPageIdContainQuestionId(string id)
        {
            return _questionIdsInPageId[id];
        }

        public QuestionDefinition GetQuestionDefinitionByAlias(string alias)
        {
            return _questionDefinitionsAliases[alias];
        }

        public QuestionDefinition GetQuestionDefinitionById(string id)
        {
            return _questionDefinitionsIds[id];
        }

        public List<string> GetQuestionIds()
        {
            return _questionDefinitionsIds.Values.Select(p => p.Id).ToList();
        }

        public List<string> GetOptionIds()
        {
            return _optionsIds.Values.Select(p => p.Id).ToList();
        }

        public Folder GetFolderWithLoop(string alias)
        {
            return _loops[alias];
        }

        public Node GetNode(string id)
        {
            return _nodes[id];
        }

        public Folder TopFolder => _topFolder;
        public IEnumerable<Node> Nodes => _nodes.Values;

        public IEnumerable<QuestionDefinition> QuestionDefinitions => _questionDefinitionsIds.Values;

        public IEnumerable<OptionList> OptionLists => _optionLists.Values;

        public OptionList GetOptionList(string id)
        {
            return _optionLists[id];
        }

        public Option GetOption(string optionId)
        {
            return _optionsIds[optionId];
        }

        public Option GetOptionByAlias(string alias)
        {
            return _optionsAlias[alias];
        }

        public IDictionary<string, QuestionDefinition> GetQuestionAliasMap()
        {
            return _questionDefinitionsAliases;
        }

        private void Build(Survey survey)
        {
            BuildSharedOptionLists(survey.SharedOptionLists);
            _nodes[_topFolder.Id] = _topFolder;
            BuildFolder(_topFolder);
        }

        private void BuildSharedOptionLists(IEnumerable<OptionList> sharedOptionLists)
        {
            if (sharedOptionLists == null) return;

            foreach (var optionList in sharedOptionLists)
            {
                BuildOptionList(optionList);
            }
        }

        private void BuildOptionList(OptionList optionsList)
        {
            _optionLists[optionsList.Id] = optionsList;
            foreach (var option in optionsList.Options)
            {
                _optionsIds[option.Id] = option;
                _optionsAlias[option.Alias] = option;
            }
        }

        private void BuildFolder(Folder folder)
        {
            BuildCondition(folder as Condition);
            foreach (Node child in folder.ChildNodes)
            {
                _nodes[child.Id] = child;
                BuildLoop(child as Folder);
                BuildChildFolder(child as Folder, folder);
                BuildPage(child as PageDefinition, folder);
            }
        }

        private void BuildCondition(Condition condition)
        {
            if (condition == null) return;

            if (condition.TrueFolder != null)
            {
                _childParentFolders.Add(condition.TrueFolder, condition);
                BuildFolder(condition.TrueFolder);
            }
            if (condition.FalseFolder != null)
            {
                _childParentFolders.Add(condition.FalseFolder, condition);
                BuildFolder(condition.FalseFolder);
            }
        }

        private void BuildLoop(Folder folder)
        {
            if (folder?.Loop == null) return;

            _loops[folder.Alias] = folder;
            BuildOptionList(folder.Loop.OptionList);
        }

        private void BuildChildFolder(Folder childFolder, Folder folder)
        {
            if (childFolder == null) return;

            _childParentFolders.Add(childFolder, folder);
            BuildFolder(childFolder);
        }

        private void BuildPage(PageDefinition pageDefinition, Folder folder)
        {
            if (pageDefinition == null) return;

            _childParentFolders.Add(pageDefinition, folder);
            _pageDefinitions.Add(pageDefinition.Id, pageDefinition);
            foreach (QuestionDefinition questionDefinition in pageDefinition.QuestionDefinitions)
            {
                _questionDefinitionsAliases[questionDefinition.Alias] = questionDefinition;
                _questionDefinitionsIds[questionDefinition.Id] = questionDefinition;
                _questionIdsInPageId[questionDefinition.Id] = pageDefinition.Id;
                BuildQuestionWithOptionsDefinition(questionDefinition as QuestionWithOptionsDefinition);
            }
        }

        private void BuildQuestionWithOptionsDefinition(QuestionWithOptionsDefinition questionDefinitionWithOptions)
        {
            if (questionDefinitionWithOptions == null) return;

            OptionList optionList = questionDefinitionWithOptions.OptionList;
            BuildOptionList(optionList);
            var gridQuestionDefinition = questionDefinitionWithOptions as GridQuestionDefinition;
            var gridWithOptions = gridQuestionDefinition?.SubQuestionDefinition as QuestionWithOptionsDefinition;
            if (gridWithOptions != null)
            {
                BuildOptionList(gridWithOptions.OptionList);
            }
            IEnumerable<QuestionDefinition> otherQuestionDefinitions = questionDefinitionWithOptions.FindOtherQuestions();
            if (otherQuestionDefinitions != null)
            {
                foreach (var other in otherQuestionDefinitions)
                {
                    _questionDefinitionsAliases[other.Alias] = other;
                }
            }
        }
    }
}