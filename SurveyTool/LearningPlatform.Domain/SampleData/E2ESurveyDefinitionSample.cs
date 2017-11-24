using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class E2ESurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public E2ESurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("10");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var survey = create.Survey(
                create.Folder("allPages",
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 1");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.SingleSelectionQuestion("abcde", "abcde", "", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Option 1"),
                            create.Option("2", text: "Option 2")
                            )),
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 2");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.NetPromoterScoreQuestion("promoteosd", "On a scale from 0-10, how likely are you to recommend Orient Software to a friend or colleague?", "", q =>
                        {
                            q.DisplayOrientation = DisplayOrientation.Horizontal;
                            q.LikertLeftText = create.CreateLanguageString("Not at all likely");
                            q.LikertCenterText = create.CreateLanguageString("");
                            q.LikertRightText = create.CreateLanguageString("Extremely likely");
                        },
                            create.Option("0", "0"),
                            create.Option("1", "1"),
                            create.Option("2", "2"),
                            create.Option("3", "3"),
                            create.Option("4", "4"),
                            create.Option("5", "5"),
                            create.Option("6", "6"),
                            create.Option("7", "7"),
                            create.Option("8", "8"),
                            create.Option("9", "9"),
                            create.Option("10", "10"))),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "E2e Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.Status = SurveyStatus.Open;
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";

            return survey;
        }
    }
}
