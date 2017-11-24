using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public class ExpressionQueryBuilder
    {
        private readonly IRequestContext _requestContext;
        private readonly IExpressionBuilder _expressionBuilder;

        private class ExpressionBuilderState
        {
            public int CurrentIndent { set; get; }
            public string Result { set; get; }
            public bool HasLogicalOperator { set; get; }
            public bool HasExpression { set; get; }
        }


        public ExpressionQueryBuilder(IRequestContext requestContext, IExpressionBuilder expressionBuilder)
        {
            _requestContext = requestContext;
            _expressionBuilder = expressionBuilder;
        }

        public string Build(IList<ExpressionItem> expressionElements)
        {
            var state = new ExpressionBuilderState();
            if (expressionElements == null || expressionElements.Count == 0) return "";
            if (expressionElements.Last().LogicalOperator.HasValue) throw new InvalidOperationException("Last element should not have logical operator");
            state.CurrentIndent = 0;
            state.Result = "";
            for (int i = 0; i < expressionElements.Count; i++)
            {
                int nextIndent = 0;
                if (i + 1 < expressionElements.Count)
                {
                    nextIndent = expressionElements[i + 1].Indent;
                }
                AppendToExpression(expressionElements[i], nextIndent, state);
            }
            return state.Result;
        }

        private void AppendToExpression(ExpressionItem expressionItem, int nextIndent, ExpressionBuilderState state)
        {
            if (expressionItem.Indent - state.CurrentIndent > 1) throw new InvalidOperationException("Indent can only increase by 1");

            if (expressionItem.Indent > state.CurrentIndent)
            {
                state.Result += _expressionBuilder.GetStartGroup();
            }
            var expression = GetExpression(expressionItem);
            if (state.HasExpression && !state.HasLogicalOperator && !string.IsNullOrEmpty(expression))
            {
                throw new InvalidOperationException("Expression is not valid. Logical operator is missing.");
            }
            state.HasExpression = !string.IsNullOrEmpty(expression);
            var logicalOperator = _expressionBuilder.GetLogicalOperator(expressionItem);
            state.HasLogicalOperator = !string.IsNullOrEmpty(logicalOperator);
            state.Result += expression + GetEndGroups(expressionItem, nextIndent) + logicalOperator;
            state.CurrentIndent = expressionItem.Indent;
        }

        private string GetEndGroups(ExpressionItem expressionItem, int nextIndent)
        {
            if (expressionItem.Indent > nextIndent)
            {
                return
                    string.Concat(Enumerable.Repeat(_expressionBuilder.GetEndGroup(), expressionItem.Indent - nextIndent));
            }
            return "";
        }

        private string GetExpression(ExpressionItem expressionItem)
        {
            if (expressionItem.QuestionId == null &&
                expressionItem.OptionId == null && expressionItem.Operator == null)
            {
                return "";
            }
            var compareOperator = _expressionBuilder.GetCompareOperator(expressionItem);
            if (compareOperator != null)
            {
                return
                    _expressionBuilder.RenderCompareOperatorClause(
                        _expressionBuilder.GetExpressionForAnswer(GetAlias(expressionItem)), expressionItem,
                        GetQuestion(expressionItem));
            }
            if (expressionItem.Operator == ExpressionOperator.Contains ||
                expressionItem.Operator == ExpressionOperator.NotContains)
            {
                return _expressionBuilder.GetNegationOperator(expressionItem) + _expressionBuilder.GetExpressionForStringContains(expressionItem, GetAlias(expressionItem));
            }
            if (expressionItem.Operator == ExpressionOperator.Custom)
            {
                return _expressionBuilder.GetNegationOperator(expressionItem) + expressionItem.Value;
            }

            return _expressionBuilder.GetNegationOperator(expressionItem) + _expressionBuilder.GetExpressionForCollectionContains(expressionItem, GetAlias(expressionItem), GetOptionId(expressionItem));
        }

        private string GetOptionId(ExpressionItem expressionItem)
        {
            Debug.Assert(expressionItem.OptionId != null, "expressionItem.OptionId != null");
            return _requestContext.NodeService.GetOption(expressionItem.OptionId).Alias;
        }

        private QuestionDefinition GetQuestion(ExpressionItem expressionItem)
        {
            return _requestContext.NodeService.GetQuestionDefinitionById(expressionItem.QuestionId);
        }

        private string GetAlias(ExpressionItem expressionItem)
        {
            Debug.Assert(expressionItem.QuestionId != null, "expressionItem.QuestionId != null");
            return _requestContext.NodeService.GetQuestionDefinitionById(expressionItem.QuestionId).Alias;
        }
    }
}