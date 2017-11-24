using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Expressions
{
    public class ExpressionFactory
    {
        private readonly string _surveyId;
        private readonly int _indent;
        private readonly List<ExpressionItem> _expressionItems;
        private string _questionId;

        public ExpressionFactory(string surveyId, int indent=0)
        {
            _surveyId = surveyId;
            _indent = indent;
            _expressionItems = new List<ExpressionItem>();
        }

        public ExpressionFactory Question(QuestionDefinition question)
        {
            return Question(question.Id);
        }

        public ExpressionFactory Question(string questionId)
        {
            _questionId = questionId;
            return this;
        }

        public ExpressionFactory IsSelected(Option option)
        {
            return AddExpressionItem(ExpressionOperator.IsSelected, option.Id);
        }

        public ExpressionFactory IsSelected(string optionId)
        {
            return AddExpressionItem(ExpressionOperator.IsSelected, optionId);
        }

        public ExpressionFactory IsNotSelected(Option option)
        {
            return AddExpressionItem(ExpressionOperator.IsNotSelected, option.Id);
        }

        public ExpressionFactory IsNotSelected(string optionId)
        {
            return AddExpressionItem(ExpressionOperator.IsNotSelected, optionId);
        }

        public ExpressionFactory IsShown(Option option)
        {
            return AddExpressionItem(ExpressionOperator.IsShown, option.Id);
        }

        public ExpressionFactory IsShown(string optionId)
        {
            return AddExpressionItem(ExpressionOperator.IsShown, optionId);
        }
        public ExpressionFactory IsNotShown(Option option)
        {
            return AddExpressionItem(ExpressionOperator.IsNotShown, option.Id);
        }

        public ExpressionFactory IsNotShown(string optionId)
        {
            return AddExpressionItem(ExpressionOperator.IsNotShown, optionId);
        }

        private ExpressionFactory AddExpressionItem(ExpressionOperator expressionOperator, string optionId)
        {
            _expressionItems.Add(CreateExpressionItem(expressionOperator, optionId: optionId));
            return this;
        }

        public ExpressionFactory IsEqual(string value)
        {
            _expressionItems.Add(CreateExpressionItem(ExpressionOperator.IsEqual, value));
            return this;
        }

        private ExpressionItem CreateExpressionItem(ExpressionOperator expressionOperator, string value=null, string optionId=null)
        {
            return new ExpressionItem
            {
                QuestionId = _questionId,
                Operator = expressionOperator,
                Value = value,
                OptionId = optionId,
                Position = _expressionItems.Count,
                Indent = _indent
            };
        }

        public ExpressionFactory Or()
        {
            _expressionItems.Last().LogicalOperator = ExpressionLogicalOperator.Or;
            return this;
        }

        public ExpressionFactory And()
        {
            _expressionItems.Last().LogicalOperator = ExpressionLogicalOperator.And;
            return this;
        }

        public Expression Build()
        {
            return new Expression
            {
                ExpressionItems = _expressionItems,
                SurveyId = _surveyId
            };
        }

        public ExpressionFactory When(Func<ExpressionFactory, ExpressionFactory> groupFunc)
        {
            AddGroup(null, groupFunc);
            return this;
        }

        public ExpressionFactory AndWhen(Func<ExpressionFactory, ExpressionFactory> groupFunc)
        {
            AddGroup(ExpressionLogicalOperator.And, groupFunc);
            return this;
        }

        public ExpressionFactory OrWhen(Func<ExpressionFactory, ExpressionFactory> groupFunc)
        {
            AddGroup(ExpressionLogicalOperator.Or, groupFunc);
            return this;
        }

        private void AddGroup(ExpressionLogicalOperator? expressionLogicalOperator, Func<ExpressionFactory, ExpressionFactory> func)
        {
            _expressionItems.Add(new ExpressionItem {LogicalOperator = expressionLogicalOperator, Indent = _indent});

            ExpressionFactory t = func(new ExpressionFactory(_surveyId, _indent + 1));
            _expressionItems.AddRange(t.Build().ExpressionItems);
        }

    }
}
