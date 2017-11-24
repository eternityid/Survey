using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class MapSurveyObjectIdsService
    {
        private readonly IDictionary<string, string> _questionIdMap;
        private readonly IDictionary<string, string> _optionIdMap;

        public MapSurveyObjectIdsService(IDictionary<string, string> questionIdMap,
            IDictionary<string, string> optionIdMap)
        {
            _questionIdMap = questionIdMap;
            _optionIdMap = optionIdMap;
        }

        public void Map(Domain.SurveyDesign.Survey survey)
        {
            if (survey?.TopFolder == null) throw new ArgumentNullException(nameof(survey));
            BuildFolder(survey.TopFolder);
        }

        private void BuildFolder(Folder folder)
        {
            BuildCondition(folder as Condition);
            foreach (var child in folder.ChildNodes)
            {
                var childFolder = child as Folder;
                if (childFolder != null)
                {
                    BuildFolder(childFolder);
                }
                BuildPage(child as PageDefinition);
            }

        }

        private void BuildCondition(Condition condition)
        {
            if (condition == null) return;

            if (condition.TrueFolder != null)
            {
                BuildFolder(condition.TrueFolder);
            }
            if (condition.FalseFolder != null)
            {
                BuildFolder(condition.FalseFolder);
            }
        }


        private void BuildPage(PageDefinition page)
        {
            if (page == null) return;

            foreach (var question in page.QuestionDefinitions)
            {
                BuildExpression(question.QuestionMaskExpression);

                var questionWithOptionsDefinition = question as QuestionWithOptionsDefinition;
                if (questionWithOptionsDefinition != null)
                {
                    BuildOptionList(questionWithOptionsDefinition);
                }

                var girdQuestionDefinition = question as GridQuestionDefinition;
                if (girdQuestionDefinition != null)
                {
                    BuildOptionList(girdQuestionDefinition.SubQuestionDefinition as QuestionWithOptionsDefinition);
                }
            }

            foreach (var skipCommand in page.SkipCommands)
            {
                BuildSkipCommand(skipCommand);
            }
        }

        private void BuildSkipCommand(SkipCommand skipCommand)
        {
            if (skipCommand == null) return;

            skipCommand.SkipToQuestionId = _questionIdMap[skipCommand.SkipToQuestionId];
            BuildExpression(skipCommand.Expression);
        }

        private void BuildExpression(Expression expression)
        {
            if (expression == null) return;

            foreach (var expressionItem in expression.ExpressionItems)
            {
                if (expressionItem.QuestionId != null)
                {
                    expressionItem.QuestionId = _questionIdMap[expressionItem.QuestionId];
                }
                if (expressionItem.OptionId != null)
                {
                    expressionItem.OptionId = _optionIdMap[expressionItem.OptionId];
                }
            }

        }

        private void BuildOptionList(QuestionWithOptionsDefinition question)
        {
            if (question?.OptionList == null) return;

            foreach (var option in question.OptionList.Options)
            {
                if (option.OptionsMask?.QuestionId != null)
                {
                    option.OptionsMask.QuestionId = _questionIdMap[option.OptionsMask.QuestionId];
                }
            }
        }
    }
}
