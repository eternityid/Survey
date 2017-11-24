using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class NodeHierarchyBuilder
    {
        private readonly Dictionary<string, Node> _nodeMap;
        private readonly Dictionary<string, QuestionDefinition> _questionMap;
        private readonly Dictionary<string, OptionList> _optionListMap;

        public NodeHierarchyBuilder(Dictionary<string, Node> nodeMap,
            Dictionary<string, QuestionDefinition> questionMap,
            Dictionary<string, OptionList> optionListMap)
        {
            _nodeMap = nodeMap;
            _questionMap = questionMap;
            _optionListMap = optionListMap;
        }

        public void Build(Node node)
        {
            node.ChildNodes = new List<Node>();
            foreach (var childId in node.ChildIds)
            {
                node.ChildNodes.Add(_nodeMap[childId]);
            }

            var pageDefinition = node as PageDefinition;
            if (pageDefinition != null)
            {
                foreach (var questionId in pageDefinition.QuestionIds)
                {
                    var questionDefinition = _questionMap[questionId];
                    pageDefinition.QuestionDefinitions.Add(questionDefinition);
                }
                foreach (var question in pageDefinition.QuestionDefinitions)
                {
                    MapOptionList(question as QuestionWithOptionsDefinition);
                    var gridQuestion = question as GridQuestionDefinition;
                    if (gridQuestion != null)
                    {
                        MapOptionList(gridQuestion.SubQuestionDefinition as QuestionWithOptionsDefinition);
                    }
                }
            }

            foreach (var child in node.ChildNodes)
            {
                Build(child);
            }
        }

        private void MapOptionList(QuestionWithOptionsDefinition questionWithOption)
        {
            if (questionWithOption != null)
            {
                questionWithOption.OptionList = _optionListMap[questionWithOption.OptionListId];
            }
        }
    }
}
