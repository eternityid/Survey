using LearningPlatform.Domain.Reporting.Respondents;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public interface IExpressionBuilder
    {
        string GetStartGroup();
        string GetEndGroup();
        string GetNegationOperator(ExpressionItem expressionItem);
        string GetCompareOperator(ExpressionItem expressionItem);
        string GetExpressionForOption(ExpressionItem expressionItem, string alias);
        string GetLogicalOperator(ExpressionItem expressionItem);
        string GetExpressionForAnswer(string alias);
        string GetExpressionForStringContains(ExpressionItem expressionItem, string alias);
        string GetExpressionForCollectionContains(ExpressionItem expressionItem, string alias, string optionId);
        string RenderCompareOperatorClause(string answer, ExpressionItem expressionItem, QuestionDefinition question);
    }
}