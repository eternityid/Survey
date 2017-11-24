using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class ValidateSurveyService
    {
        private readonly Domain.SurveyDesign.Survey _survey;
        private readonly IDictionary<string, QuestionDefinition> _questionMap = new Dictionary<string, QuestionDefinition>();
        private readonly IDictionary<string, OptionList> _optionListMap = new Dictionary<string, OptionList>();
        private readonly IDictionary<string, List<Option>> _richOptionListMap = new Dictionary<string, List<Option>>();
        private readonly IDictionary<Type, List<ExpressionOperator>> _expressionOperatorMap = new Dictionary<Type, List<ExpressionOperator>>();

        public ValidateSurveyService(Domain.SurveyDesign.Survey survey)
        {
            _survey = survey;
            BuildMaps(_survey);
        }

        public List<Exception> Validate()
        {
            var errors = new List<Exception>();

            if (_survey?.TopFolder == null)
            {
                errors.Add(new Exception());
                return errors;
            }

            if (string.IsNullOrWhiteSpace(_survey.SurveySettings.SurveyTitle))
            {
                errors.Add(new Exception());
            }

            foreach (var node in _survey.TopFolder.ChildNodes)
            {
                ValidatePage(node as PageDefinition, errors);
            }

            ValidateDuplicatedQuestionAliases(errors);

            return errors;
        }

        private void ValidatePage(PageDefinition page, List<Exception> errors)
        {
            if (page == null)
            {
                return;
            }

            ValidateLanguageString(page.Title, errors);
            ValidateAlias(page.Alias, errors);

            foreach (var question in page.QuestionDefinitions)
            {
                ValidateQuestion(question, errors);
            }

            foreach (var skipCommand in page.SkipCommands)
            {
                ValidateSkipCommand(skipCommand, errors);
            }
        }

        private void ValidateSkipCommand(SkipCommand skipCommand, List<Exception> errors)
        {
            ValidateExpression(skipCommand.Expression, errors);

            if (!_questionMap.ContainsKey(skipCommand.SkipToQuestionId))
            {
                errors.Add(new Exception());
            }
        }

        private void ValidateQuestion(QuestionDefinition question, List<Exception> errors)
        {
            ValidateLanguageString(question.Title, errors);
            ValidateAlias(question.Alias, errors);
            ValidateExpression(question.QuestionMaskExpression, errors);
            ValidateQuestionWithOptions(question as QuestionWithOptionsDefinition, errors);

            var gridQuestion = question as GridQuestionDefinition;
            if (gridQuestion != null)
            {
                ValidateQuestionWithOptions(gridQuestion.SubQuestionDefinition as QuestionWithOptionsDefinition, errors);
            }
        }

        private void ValidateQuestionWithOptions(QuestionWithOptionsDefinition questionWithOptions, List<Exception> errors)
        {
            if (questionWithOptions != null)
            {
                ValidateOptionList(questionWithOptions.OptionList, errors);
                ValidateOptionsMask(questionWithOptions.OptionsMask, errors);
            }
        }

        private void ValidateOptionList(OptionList optionList, List<Exception> errors)
        {
            if (optionList == null)
            {
                errors.Add(new Exception());
                return;
            }

            foreach (var option in optionList.Options)
            {
                ValidateLanguageString(option.Text, errors);
                ValidateAlias(option.Alias, errors);
                ValidateOptionsMask(option.OptionsMask, errors);
            }

            ValidateDuplicateOptionAliases(optionList, errors);
        }

        private void ValidateOptionsMask(OptionsMask optionsMask, List<Exception> errors)
        {
            if (optionsMask?.QuestionId == null)
            {
                return;
            }

            QuestionDefinition refQuestion;
            if (!_questionMap.TryGetValue(optionsMask.QuestionId, out refQuestion))
            {
                errors.Add(new Exception());
                return;
            }

            var refQuestionType = refQuestion.GetType();
            if (refQuestionType != typeof(SingleSelectionQuestionDefinition) &&
                refQuestionType != typeof(MultipleSelectionQuestionDefinition))
            {
                errors.Add(new Exception());
            }
        }

        private void ValidateExpression(Expression expression, List<Exception> errors)
        {
            if (expression == null)
            {
                return;
            }

            foreach (var expressionItem in expression.ExpressionItems)
            {
                ValidateExpressionItem(expressionItem, errors);
            }
        }

        private void ValidateExpressionItem(ExpressionItem expressionItem, List<Exception> errors)
        {
            const int expressionItemGroupIndent = 0;

            if (expressionItem.Indent == expressionItemGroupIndent)
            {
                return;
            }

            QuestionDefinition refQuestion;
            if (!_questionMap.TryGetValue(expressionItem.QuestionId, out refQuestion))
            {
                errors.Add(new Exception());
                return;
            }

            List<ExpressionOperator> expressionOperators;
            if (!_expressionOperatorMap.TryGetValue(refQuestion.GetType(), out expressionOperators))
            {
                errors.Add(new Exception());
                return;
            }

            if (expressionItem.Operator != null && !expressionOperators.Contains(expressionItem.Operator.Value))
            {
                errors.Add(new Exception());
                return;
            }

            if (expressionItem.OptionId == null) return;

            var refQuestionWithOptions = refQuestion as QuestionWithOptionsDefinition;
            if (refQuestionWithOptions == null)
            {
                errors.Add(new Exception());
                return;
            }

            List<Option> richOptionList;
            if (!_richOptionListMap.TryGetValue(refQuestionWithOptions.OptionList.Id, out richOptionList))
            {
                errors.Add(new Exception());
                return;
            }

            if (richOptionList.All(p => p.Id != expressionItem.OptionId))
            {
                errors.Add(new Exception());
            }
        }

        private void ValidateDuplicatedQuestionAliases(List<Exception> errors)
        {
            var questionAliases = _questionMap.Values.Select(p => p.Alias).ToList();
            var uniqueQuestionAliases = questionAliases.Distinct();

            if (questionAliases.Count > uniqueQuestionAliases.Count())
            {
                errors.Add(new Exception());
            }
        }

        private void ValidateDuplicateOptionAliases(OptionList optionList, List<Exception> errors)
        {
            if (optionList == null)
            {
                errors.Add(new Exception());
                return;
            }

            List<Option> richOptionList;
            if (!_richOptionListMap.TryGetValue(optionList.Id, out richOptionList))
            {
                errors.Add(new Exception());
                return;
            }

            var optionAliases = richOptionList.Select(p => p.Alias).ToList();
            var uniqueOptionAliases = optionAliases.Distinct();
            if (optionAliases.Count > uniqueOptionAliases.Count())
            {
                errors.Add(new Exception());
            }
        }

        private void ValidateLanguageString(LanguageString languageString, List<Exception> errors)
        {
            if (languageString?.Items.Count(p => string.IsNullOrWhiteSpace(p.Text)) > 0)
            {
                errors.Add(new Exception());
            }
        }

        private void ValidateAlias(string alias, List<Exception> errors)
        {
            if (string.IsNullOrWhiteSpace(alias))
            {
                errors.Add(new Exception());
            }
        }

        private void BuildMaps(Domain.SurveyDesign.Survey survey)
        {
            if (survey?.TopFolder == null) return;

            BuildQuestionAndOptionListMaps();
            BuildRichOptionListMap();
            BuildExpressionOperatorMap();
        }

        private void BuildQuestionAndOptionListMaps()
        {
            foreach (var node in _survey.TopFolder.ChildNodes)
            {
                var page = node as PageDefinition;
                if (page == null)
                {
                    continue;
                }

                foreach (var question in page.QuestionDefinitions)
                {
                    _questionMap[question.Id] = question;
                    BuildQuestionWithOptions(question as QuestionWithOptionsDefinition);
                }
            }
        }

        private void BuildQuestionWithOptions(QuestionWithOptionsDefinition questionDefinitionWithOptions)
        {
            if (questionDefinitionWithOptions == null) return;

            _optionListMap[questionDefinitionWithOptions.OptionList.Id] = questionDefinitionWithOptions.OptionList;

            var gridQuestionDefinition = questionDefinitionWithOptions as GridQuestionDefinition;
            var subQuestionWithOptions = gridQuestionDefinition?.SubQuestionDefinition as QuestionWithOptionsDefinition;
            if (subQuestionWithOptions != null)
            {
                _optionListMap[subQuestionWithOptions.OptionList.Id] = subQuestionWithOptions.OptionList;
            }
        }

        private void BuildRichOptionListMap()
        {
            foreach (var optionList in _optionListMap.Values)
            {
                var expandedOptions = GetExpandedOptions(optionList.Options);
                _richOptionListMap.Add(optionList.Id, expandedOptions);
            }
        }

        private List<Option> GetExpandedOptions(IEnumerable<Option> options)
        {
            var expandedOptions = new List<Option>();
            foreach (var option in options)
            {
                var optionListId = GetOptionListId(option);
                if (optionListId != null)
                {
                    var optionList = _optionListMap[optionListId];
                    var carryOverOptions = GetExpandedOptions(optionList.Options);
                    expandedOptions.AddRange(carryOverOptions);
                }
                else
                {
                    expandedOptions.Add(option);
                }
            }
            return expandedOptions;
        }

        private string GetOptionListId(Option option)
        {
            if (option.OptionsMask?.QuestionId != null)
            {
                QuestionDefinition refQuestion;
                if (_questionMap.TryGetValue(option.OptionsMask.QuestionId, out refQuestion))
                {
                    var refQuestionWithOptions = _questionMap[option.OptionsMask.QuestionId] as QuestionWithOptionsDefinition;
                    if (refQuestionWithOptions != null)
                    {
                        return refQuestionWithOptions.OptionList.Id;
                    }
                }
            }
            return null;
        }

        private void BuildExpressionOperatorMap()
        {
            var openEndedTextQuestionOperators = new List<ExpressionOperator>
            {
                ExpressionOperator.IsEqual,
                ExpressionOperator.IsNotEqual,
                ExpressionOperator.Contains,
                ExpressionOperator.NotContains
            };
            var numericQuestionOperators = new List<ExpressionOperator>
            {
                ExpressionOperator.IsEqual,
                ExpressionOperator.IsNotEqual,
                ExpressionOperator.GreaterThan,
                ExpressionOperator.GreaterThanOrEqual,
                ExpressionOperator.LessThan,
                ExpressionOperator.LessThanOrEqual
            };
            var selectionQuestionOperators = new List<ExpressionOperator>
            {
                ExpressionOperator.IsSelected,
                ExpressionOperator.IsNotSelected
            };

            _expressionOperatorMap.Add(typeof(OpenEndedShortTextQuestionDefinition), openEndedTextQuestionOperators);
            _expressionOperatorMap.Add(typeof(OpenEndedLongTextQuestionDefinition), openEndedTextQuestionOperators);

            _expressionOperatorMap.Add(typeof(NumericQuestionDefinition), numericQuestionOperators);
            _expressionOperatorMap.Add(typeof(NetPromoterScoreQuestionDefinition), numericQuestionOperators);
            _expressionOperatorMap.Add(typeof(ScaleQuestionDefinition), numericQuestionOperators);
            _expressionOperatorMap.Add(typeof(RatingQuestionDefinition), numericQuestionOperators);

            _expressionOperatorMap.Add(typeof(SingleSelectionQuestionDefinition), selectionQuestionOperators);
            _expressionOperatorMap.Add(typeof(MultipleSelectionQuestionDefinition), selectionQuestionOperators);
            _expressionOperatorMap.Add(typeof(PictureSingleSelectionQuestionDefinition), selectionQuestionOperators);
            _expressionOperatorMap.Add(typeof(PictureMultipleSelectionQuestionDefinition), selectionQuestionOperators);
        }
    }
}
