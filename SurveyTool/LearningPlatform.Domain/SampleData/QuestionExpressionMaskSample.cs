using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.Questions;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SampleData
{
    public class QuestionExpressionMaskSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public QuestionExpressionMaskSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("5");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            MultipleSelectionQuestionDefinition q1 =
                create.MultipleSelectionQuestion("MultiSelectionQuestion1", "Demo Multiple Selection Question 1",
                    "Please choose your answer",
                    q => { q.Alias = "q1"; q.Id = ObjectId.GenerateNewId().ToString(); },
                    create.Option("1", text: "Option-1"),
                    create.Option("2", text: "Option-2"),
                    create.Option("3", text: "Option-3")
                    );

            OpenEndedTextQuestionDefinition name = create.OpenEndedShortTextQuestion("name", "Your Name", "Please enter your name",
                            q => { q.Alias = "name"; q.Id = ObjectId.GenerateNewId().ToString(); });
            OpenEndedTextQuestionDefinition withMask = create.OpenEndedShortTextQuestion(
                                                                                "WithMask",
                                                                                "Sometimes shown",
                                                                                string.Empty,
                                                                                q => q.Id = ObjectId.GenerateNewId().ToString()
                                                                                );

            withMask.QuestionMaskExpression = new Expression
            {
                SurveyId = surveyId,
                ExpressionItems = new List<ExpressionItem>() {
                    new ExpressionItem
                    {
                        Indent = 1,
                        LogicalOperator = ExpressionLogicalOperator.Or,
                        QuestionId = name.Id,
                        Value = "'Oyvind'",
                        Operator = ExpressionOperator.IsEqual
                    },
                    new ExpressionItem
                    {
                        Indent = 1,
                        QuestionId = q1.Id,
                        Operator = ExpressionOperator.IsSelected,
                        OptionId = q1.OptionList.Options[1].Id
                    }
                }
            };

            var survey = create.Survey(
                create.Folder("Main Page",
                    create.Page(page =>
                    {
                        page.Title = create.CreateLanguageString("Page 1");
                        page.Alias = "Page_" + DateTime.Now.Ticks;
                    }, q1,
                        name),
                    create.Page(page =>
                    {
                        page.Title = create.CreateLanguageString("Page 2");
                        page.Alias = "Page_" + DateTime.Now.Ticks;
                    },
                        withMask,
                        create.Information("Always shown", "Always shown", "Always shown")),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Question Expression Mask Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";

            return survey;
        }
    }
}
