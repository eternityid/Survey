using LearningPlatform.Domain.SurveyDesign.Expressions;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class ExpressionConverter
    {
        public void UpdateExpression(Expression expression, QuestionConverter questionConverter, OptionListConverter optionListConverter)
        {
            foreach (var item in expression.ExpressionItems)
            {
                if (item.QuestionId != null)
                {
                    item.QuestionId = questionConverter.IdMap[item.QuestionId];
                    if (item.OptionId != null)
                    {
                        item.OptionId = optionListConverter.OptionIdMap[item.OptionId];
                    }
                }
            }
        }
    }
}
