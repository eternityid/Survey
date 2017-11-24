using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SampleData
{
    public class OptionGroupSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        public OptionGroupSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("13");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var survey = create.Survey(
                create.Folder("Main Page",
                    create.Page(page =>
                    {
                        page.Title = create.CreateLanguageString("Page 1");
                        page.Alias = "Page_" + DateTime.Now.Ticks;
                    },
                        create.SingleSelectionQuestion("SingleSelectionQuestion1", "Demo Single Selection Question", "Please choose your answer", s => s.OptionList.OptionGroups = new List<OptionGroup> { new OptionGroup { Alias = "group1", Heading = create.CreateLanguageString("Fruits") }, new OptionGroup { Alias = "group2", Heading = create.CreateLanguageString("Vegetables") } },
                            create.Option("1", text: "Apple", groupAlias: "group1"),
                            create.Option("2", text: "Orange", groupAlias: "group1"),
                            create.Option("3", text: "Banana", groupAlias: "group1"),
                            create.Option("4", text: "Carrot", groupAlias: "group2"),
                            create.Option("5", text: "Broccoli", groupAlias: "group2")
                            )),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Option Groups";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";
            survey.SurveySettings.DefaultLanguage = "en";
            survey.SurveySettings.Languages = new[] { "en", "no" };

            return survey;
        }
    }
}
