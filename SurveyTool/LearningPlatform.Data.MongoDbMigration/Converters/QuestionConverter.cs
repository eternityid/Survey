using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using System.Collections.Generic;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class QuestionConverter
    {
        private readonly OptionListConverter _optionListConverter;
        private readonly ExpressionConverter _expressionConverter;

        public QuestionConverter(OptionListConverter optionListConverter, ExpressionConverter expressionConverter)
        {
            _optionListConverter = optionListConverter;
            _expressionConverter = expressionConverter;
        }

        public Dictionary<string, string> IdMap { get; } = new Dictionary<string, string>();


        public void Convert(NodeService nodeService)
        {
            foreach (var question in nodeService.QuestionDefinitions)
            {
                var objectId = ObjectIdHelper.GetObjectIdFromLongString(question.Id);
                IdMap[question.Id] = objectId;
                question.Id = objectId;
                question.SurveyId = nodeService.Survey.Id;
            }

            foreach (var question in nodeService.QuestionDefinitions)
            {
                HandleQuestionWithOption(question as QuestionWithOptionsDefinition);
                HandleGridQuestion(question as GridQuestionDefinition);
                HandleMatrixQuesiton(question as MatrixQuestionDefinition);
            }
            // Need to have built up the IdMap for all questions before updating expressions.
            foreach (var question in nodeService.QuestionDefinitions)
            {
                if (question.QuestionMaskExpression != null)
                {
                    _expressionConverter.UpdateExpression(question.QuestionMaskExpression, this, _optionListConverter);
                }
            }
        }

        private void HandleQuestionWithOption(QuestionWithOptionsDefinition withOptionsDefinition)
        {
            if (withOptionsDefinition == null) return;

            _optionListConverter.UpdateOptions(withOptionsDefinition.OptionList, this);
            withOptionsDefinition.OptionListId = withOptionsDefinition.OptionList.Id;
        }

        private void HandleGridQuestion(GridQuestionDefinition gridQuestionDefinition)
        {
            if (gridQuestionDefinition == null) return;
            // SubQuestionDefinition is contained and is not a separate questiondefinition.
            gridQuestionDefinition.SubQuestionDefinition.Id = null;
            HandleQuestionWithOption(gridQuestionDefinition.SubQuestionDefinition as QuestionWithOptionsDefinition);
        }


        private void HandleMatrixQuesiton(MatrixQuestionDefinition matrixQuestionDefinition)
        {
            if (matrixQuestionDefinition == null) return;
            foreach (var childQuestion in matrixQuestionDefinition.QuestionDefinitions)
            {
                // matrixQuestion's QuestionDefinitions is contained and is not a separate questiondefinition.
                childQuestion.Id = null;

                //Only need to handle grid question specifically
                HandleGridQuestion(childQuestion as GridQuestionDefinition);
            }
        }
    }
}
