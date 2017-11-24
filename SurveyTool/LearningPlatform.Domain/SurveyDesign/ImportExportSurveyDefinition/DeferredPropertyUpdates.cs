using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition
{
    public class DeferredPropertyUpdates
    {
        private readonly Dictionary<OptionsMask, string> _carryOvers = new Dictionary<OptionsMask, string>();
        private readonly Dictionary<ExpressionItem, string> _expressionQuestionAlias = new Dictionary<ExpressionItem, string>();
        private readonly Dictionary<ExpressionItem, string> _expressionOptionAlias = new Dictionary<ExpressionItem, string>();
        private readonly Dictionary<SkipCommand, string> _skipToQuestions = new Dictionary<SkipCommand, string>();

        public Dictionary<SkipCommand, string> SkipToQuestions => _skipToQuestions;

        public Dictionary<OptionsMask, string> CarryOvers => _carryOvers;

        public Dictionary<ExpressionItem, string> ExpressionQuestionAlias => _expressionQuestionAlias;

        public Dictionary<ExpressionItem, string> ExpressionOptionAlias => _expressionOptionAlias;

        public void UpdateProperties(Survey newSurvey)
        {
            var nodeService = new NodeService(newSurvey);
            foreach (var keyValue in CarryOvers)
            {
                OptionsMask optionsMask = keyValue.Key;
                var questionDefinition = nodeService.GetQuestionDefinitionByAlias(keyValue.Value);
                optionsMask.QuestionId = questionDefinition.Id;
            }

            foreach (var keyValue in SkipToQuestions)
            {
                SkipCommand skipCommand = keyValue.Key;
                skipCommand.SurveyId = newSurvey.Id;
                skipCommand.Expression.SurveyId = newSurvey.Id;
                var questionDefinition = nodeService.GetQuestionDefinitionByAlias(keyValue.Value);
                skipCommand.PageDefinitionId = questionDefinition.PageDefinitionId;
                skipCommand.SkipToQuestionId = questionDefinition.Id;
            }

            foreach (var keyValue in ExpressionQuestionAlias)
            {
                ExpressionItem expressionItem = keyValue.Key;
                var questionDefinition = nodeService.GetQuestionDefinitionByAlias(keyValue.Value);
                expressionItem.QuestionId = questionDefinition.Id;
            }

            foreach (var keyValue in ExpressionOptionAlias)
            {
                ExpressionItem expressionItem = keyValue.Key;
                var option = nodeService.GetOptionByAlias(keyValue.Value);
                expressionItem.OptionId = option.Id;
            }
        }
    }
}