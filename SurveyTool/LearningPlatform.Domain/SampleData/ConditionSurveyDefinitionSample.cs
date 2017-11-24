using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class ConditionSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        public ConditionSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("8");

            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 1");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.OpenEndedShortTextQuestion("q1", "Oeyvind for true block")),
                    create.Condition("condition", "questions.q1.answer=='Oeyvind'",
                        create.Folder("trueFolder",
                            create.Page(create.OpenEndedShortTextQuestion("true1", "true1")),
                            create.Page(create.OpenEndedShortTextQuestion("true2", "true2")),
                            create.Page(create.OpenEndedShortTextQuestion("true3", "true3"))),
                        create.Folder("falseFolder",
                            create.Page(create.OpenEndedShortTextQuestion("false1", "false1")))),
                        create.Page(
                            page =>
                            {
                                page.Title = create.CreateLanguageString("Page 2");
                                page.Alias = "Page_" + DateTime.Now.Ticks;
                            },
                            create.Information("Complete", "Complete")),
                        create.ThankYouPage()));

            survey.SurveySettings.SurveyTitle = "Condition Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";

            return survey;
        }
    }
}
