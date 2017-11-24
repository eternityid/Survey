using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SampleData
{
    public class CarryOverOptionsSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        public CarryOverOptionsSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("4");

            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var carryOverOptions = new OptionsMask
            {
                QuestionId = ObjectId.GenerateNewId().ToString(), //TODO: Generate QuestionId
                OptionsMaskType = OptionsMaskType.OptionsSelected,
            };
            MultipleSelectionQuestionDefinition multipleSelectionQuestionDefinition =
                create.MultipleSelectionQuestion("MultiSelectionQuestion1", 
                "Demo Multiple Selection Question 1", 
                "Please choose your answer", q=> {
                    q.OrderType = OrderType.InOrder;
                    q.Id = carryOverOptions.QuestionId;
                },
                create.Option("1", text: "Option-1"),
                create.Option("2", text: "Option-2"),
                create.Option("3", text: "Option-3")
                );
            var survey = create.Survey(
                create.Folder("Main Page",
                    create.Page(page=> {
                        page.Title = create.CreateLanguageString("Page 1");
                        page.Alias = "Page_" + DateTime.Now.Ticks;
                    },multipleSelectionQuestionDefinition),
                    create.Page(
                        page => {
                            page.Title = create.CreateLanguageString("Page 2");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.SingleSelectionQuestion("SingleSelectionQuestion2", "Demo Single Selection Question 2", "Please choose your answer", q => q.OrderType = OrderType.InOrder,
                            create.Option("", optionsMask: carryOverOptions)
                            )),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Carry Over Answers Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";
            return survey;
        }
    }
}
