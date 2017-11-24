using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class CustomNavigationTextSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public CustomNavigationTextSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("15");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);
            var survey = create.Survey(
                create.Folder("Main Page",
                    create.Page(page =>
                    {
                        page.Title = create.CreateLanguageString("Page 1");
                        page.Alias = "Page_" + DateTime.Now.Ticks;
                    },
                        create.Information("info", "Welcome.", "Welcome to the machine.")),
                    create.Page(
                         page =>
                         {
                             page.Title = create.CreateLanguageString("Page 2");
                             page.Alias = "Page_" + DateTime.Now.Ticks;
                         },
                        create.ShortTextListQuestion("ShortTextListQuestion", "Please give us some information", "Demo short text list question",
                            create.OpenEndedShortTextQuestion("OpenEndedShortTextQuestion", string.Empty, string.Empty),
                            null,
                            create.Option("1", "What's your name?"),
                            create.Option("2", "What's your address?"),
                            create.Option("3", "Are you married?")
                            ),
                        create.LongTextListQuestion("LongTextListQuestion", "What is your favorite movie in the following genres?", "Demo long text list question",
                            create.OpenEndedLongTextQuestion("OpenEndedLongTextQuestion", string.Empty, string.Empty,
                                delegate (OpenEndedLongTextQuestionDefinition subQuestion)
                                {
                                    subQuestion.Rows = 3;
                                }),
                            null,
                            create.Option("1", "Drama"),
                            create.Option("2", "Comedy"),
                            create.Option("3", "Foreign"),
                            create.Option("4", "Western")
                            )),
                   create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Custom Navigation Button Text Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";
            survey.SurveySettings.DefaultLanguage = "en";
            survey.SurveySettings.Languages = new[] { "en", "no" };
            survey.SurveySettings.NextButtonText = create.CreateLanguageString(">>");
            survey.SurveySettings.PreviousButtonText = create.CreateLanguageString("<<");
            survey.SurveySettings.FinishButtonText = create.CreateLanguageString("Send");
            return survey;
        }
    }
}
