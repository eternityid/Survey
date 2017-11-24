using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class LanguageSelectionSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        public LanguageSelectionSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("16");

            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var survey = create.Survey(
                create.Folder("Main Page",
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 1");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        }, create.LanguageSelection("language", new[] { "Language", "no::Språk" }, new[] { "Please select language", "no::Vennligst velg språk" })),
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 2");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.OpenEndedShortTextQuestion("FullName", new[] { "Full Name", "no::Navn" }, new[] { "Please enter your full name", "no::Vennligst oppgi ditt fulle navn" }),
                        create.SingleSelectionQuestion("SingleSelectionQuestion1", new[] { "Demo Single Selection Question 1", "no::Demo enkeltvalgspørsmål 1" }, new[] { "Please choose your answer", "no::Vennligst velg" }, q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: new[] { "Option-1", "no::Alternativ-1" }),
                            create.Option("2", text: new[] { "Option-2", "no::Alternativ-2" }),
                            create.Option("3", text: new[] { "Option-3", "no::Alternativ-3" })
                            )),
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 3");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.OpenEndedShortTextQuestion("TextQuestion", "Demo Text Question", "Please enter your answer"),
                        create.SingleSelectionQuestion("SingleSelectionQuestion2", "Demo Single Selection Question 2", "Please choose your answer", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Option-1"),
                            create.Option("2", text: "Option-2"),
                            create.Option("3", text: "Option-3")
                            )),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Language Selection Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";
            survey.SurveySettings.DefaultLanguage = "en";
            survey.SurveySettings.Languages = new[] { "en", "no" };

            return survey;
        }
    }
}
