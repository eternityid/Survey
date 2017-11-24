using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using System.Linq;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class NodeConverter
    {
        private readonly OptionListConverter _optionListConverter;
        private readonly QuestionConverter _questionConverter;
        private readonly ExpressionConverter _expressionConverter;
        private readonly LayoutConverter _layoutConverter;
        private readonly ThemeConverter _themeConverter;

        public NodeConverter(OptionListConverter optionListConverter,
            QuestionConverter questionConverter,
            ExpressionConverter expressionConverter,
            LayoutConverter layoutConverter,
            ThemeConverter themeConverter)
        {
            _optionListConverter = optionListConverter;
            _questionConverter = questionConverter;
            _expressionConverter = expressionConverter;
            _layoutConverter = layoutConverter;
            _themeConverter = themeConverter;
        }

        public void Convert(NodeService nodeService)
        {
            var nodes = nodeService.Nodes.ToList();
            foreach (var node in nodes)
            {
                node.Id = ObjectIdHelper.GetObjectIdFromLongString(node.Id);
                node.SurveyId = nodeService.Survey.Id;
                HandleFolder(node as Folder);
                HandlePage(node as PageDefinition);
                HandleCondition(node as Condition);
            }

            // Ensure the correct order of child nodes
            foreach (var node in nodes)
            {
                node.ChildNodes = node.ChildNodes.OrderBy(n => n.Position).ToList();
            }
        }

        private void HandleFolder(Folder folder)
        {
            if (folder?.Loop != null)
            {
                var optionList = folder.Loop.OptionList;
                _optionListConverter.UpdateOptions(optionList, _questionConverter);
                folder.Loop.OptionListId = optionList.Id;
            }
        }

        private void HandleCondition(Condition condition)
        {
            if (condition == null) return;
            if (condition.TrueFolder != null)
            {
                // Currently the node service requires Id to be set for condition folders (any folders)
                condition.TrueFolder.Id = ObjectIdHelper.GetObjectIdFromLongString(condition.TrueFolder.Id);
            }
            if (condition.FalseFolder != null)
            {
                // Currently the node service requires Id to be set for condition folders (any folders)
                condition.FalseFolder.Id = ObjectIdHelper.GetObjectIdFromLongString(condition.FalseFolder.Id);
            }
            if (condition.Expression != null)
            {
                _expressionConverter.UpdateExpression(condition.Expression, _questionConverter, _optionListConverter);
            }
        }

        private void HandlePage(PageDefinition page)
        {
            if (page == null) return;

            if (page.PageLayoutId != null)
            {
                page.PageLayoutId = _layoutConverter.IdMap[page.PageLayoutId];
            }
            if (page.PageThemeId != null)
            {
                page.PageThemeId = _themeConverter.IdMap[page.PageThemeId];
            }

            // Ensure correct order of questions
            page.QuestionDefinitions = page.QuestionDefinitions.OrderBy(p => p.Position).ToList();
            if (page.PageThemeId != null)
            {
                page.PageThemeId = ObjectIdHelper.GetObjectIdFromLongString(page.PageThemeId);
            }

            foreach (var skip in page.SkipCommands)
            {
                if (skip.Expression != null)
                {
                    _expressionConverter.UpdateExpression(skip.Expression, _questionConverter, _optionListConverter);
                    skip.SkipToQuestionId = _questionConverter.IdMap[skip.SkipToQuestionId];
                    skip.PageDefinitionId = page.Id;
                }
            }
        }

    }
}
