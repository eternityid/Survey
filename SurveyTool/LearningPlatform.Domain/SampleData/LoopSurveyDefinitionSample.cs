using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class LoopSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public LoopSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("3");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(page =>
                    {
                        page.Title = create.CreateLanguageString("Page 1");
                        page.Alias = "Page_" + DateTime.Now.Ticks;
                    }, create.MultipleSelectionQuestion("q1", "Cars", "", null,
                        create.Option("bmw", text: "BMW"),
                        create.Option("mercedes", text: "Mercedes"),
                        create.Option("ford", text: "Ford"))),
                    create.Loop("loop", "questions.q1.answer",
                        new[]
                        {
                            create.Option("bmw", text: "BMW"),
                            create.Option("mercedes", text: "Mercedes"),
                            create.Option("ford", text: "Ford")
                        },
                        create.Page(page =>
                        {
                            page.Title = create.CreateLanguageString("Page 2");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                            create.OpenEndedShortTextQuestion("q2", "Please describe your opinion on {{loops.loop}}"))),
                    create.Page(create.Information("complete", "Click finish to complete the survey")),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Loop Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";

            return survey;
        }
    }
}
