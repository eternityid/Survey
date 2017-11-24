using System;
using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public class JavascriptExpressionBuilder : IExpressionBuilder
    {
        public string GetStartGroup()
        {
            return "(";
        }

        public string GetEndGroup()
        {
            return ")";
        }

        public string GetNegationOperator(ExpressionItem expressionItem)
        {
            if (expressionItem.Operator == ExpressionOperator.IsNotShown ||
                expressionItem.Operator == ExpressionOperator.NotContains)
            {
                return "!";
            }
            return "";
        }

        public string GetLogicalOperator(ExpressionItem expressionItem)
        {
            if (!expressionItem.LogicalOperator.HasValue) return "";
            if (expressionItem.LogicalOperator == ExpressionLogicalOperator.And) return " && ";
            return " || ";
        }

        private readonly Dictionary<ExpressionOperator, string> _expressionOperatorToString = new Dictionary<ExpressionOperator, string>
        {
            {ExpressionOperator.IsEqual, "==="},
            {ExpressionOperator.IsNotEqual, "!=="},
            {ExpressionOperator.LessThan, "<"},
            {ExpressionOperator.LessThanOrEqual, "<="},
            {ExpressionOperator.GreaterThan, ">"},
            {ExpressionOperator.GreaterThanOrEqual, ">="},
            {ExpressionOperator.IsTrue, "=== true"},
            {ExpressionOperator.IsFalse, "=== false"}
        };

        public string GetCompareOperator(ExpressionItem expressionItem)
        {
            string operatorString;
            if (expressionItem.Operator.HasValue && _expressionOperatorToString.TryGetValue(expressionItem.Operator.Value, out operatorString))
            {
                return operatorString;
            }
            return null;
        }

        public string GetExpressionForOption(ExpressionItem expressionItem, string alias)
        {
            if (expressionItem.Operator == ExpressionOperator.IsSelected)
            {
                return string.Format("questions.{0}.optionsSelected", alias);
            }
            if (expressionItem.Operator == ExpressionOperator.IsNotSelected)
            {
                return string.Format("questions.{0}.optionsNotSelected", alias);
            }
            if (expressionItem.Operator == ExpressionOperator.IsShown || expressionItem.Operator == ExpressionOperator.IsNotShown)
            {
                return string.Format("questions.{0}.optionsShown", alias);
            }
            throw new NotImplementedException(expressionItem.Operator + " not implemented");
        }


        public string GetExpressionForAnswer(string alias)
        {
            return string.Format("questions.{0}.answer", alias);
        }

        public string GetExpressionForStringContains(ExpressionItem expressionItem, string alias)
        {
            return string.Format("containsString({0}, {1})",
                GetExpressionForAnswer(alias), "'" + makeValidJavascriptString(expressionItem.Value) + "'");
        }

        public string GetExpressionForCollectionContains(ExpressionItem expressionItem, string alias, string optionId)
        {
            if (expressionItem == null) throw new ArgumentNullException("expressionItem");
            if (expressionItem.OptionId == null) throw new InvalidOperationException("ExpressionItem.OptionId was null");
            return string.Format("contains({0}, '{1}')", GetExpressionForOption(expressionItem, alias), optionId);
        }

        public string RenderCompareOperatorClause(string expressionForAnswer, ExpressionItem expressionItem,
            QuestionDefinition question)
        {
            string comparisonClause;
            var comparator = GetCompareOperator(expressionItem);

            switch (expressionItem.Operator)
            {
                case ExpressionOperator.IsTrue:
                case ExpressionOperator.IsFalse:
                    comparisonClause = expressionForAnswer + comparator;
                    break;
                case ExpressionOperator.IsEqual:
                case ExpressionOperator.IsNotEqual:
                    if (question is OpenEndedShortTextQuestionDefinition ||
                               question is OpenEndedLongTextQuestionDefinition)
                    {
                        comparisonClause = expressionForAnswer + comparator + "'" + makeValidJavascriptString(expressionItem.Value) + "'";
                    }
                    else if (question is NumericQuestionDefinition)
                    {
                        comparisonClause = expressionForAnswer + comparator + expressionItem.Value;
                    }
                    else
                    {
                        comparisonClause = expressionForAnswer + comparator + "'" + expressionItem.Value + "'";
                    }
                    break;
                case ExpressionOperator.GreaterThan:
                    comparisonClause = string.Format("greaterThan({0}, {1})", expressionForAnswer, expressionItem.Value);
                    break;
                case ExpressionOperator.GreaterThanOrEqual:
                    comparisonClause = string.Format("greaterThanOrEqual({0}, {1})", expressionForAnswer, expressionItem.Value);
                    break;
                case ExpressionOperator.LessThan:
                    comparisonClause = string.Format("lessThan({0}, {1})", expressionForAnswer, expressionItem.Value);
                    break;
                case ExpressionOperator.LessThanOrEqual:
                    comparisonClause = string.Format("lessThanOrEqual({0}, {1})", expressionForAnswer, expressionItem.Value);
                    break;
                default:
                    comparisonClause = expressionForAnswer + comparator + expressionItem.Value;
                    break;
            }
            return comparisonClause;
        }

        private string makeValidJavascriptString(string value)
        {
            return value.Replace("\\", "\\\\").Replace("'", "\\'");
        }
    }
}