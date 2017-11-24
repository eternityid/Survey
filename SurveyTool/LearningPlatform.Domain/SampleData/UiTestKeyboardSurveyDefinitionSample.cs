using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class UiTestKeyboardSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public UiTestKeyboardSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            var surveyId = ObjectIdHelper.GetObjectIdFromLongString("6");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 1");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.SingleSelectionGridQuestion("carscolors", "What car do you like", "what car",
                            create.SingleSelectionQuestion("placeholdersingle", "", "", q => q.OrderType = OrderType.InOrder,
                                create.Option("1", text: "Green"),
                                create.Option("2", text: "Red"),
                                create.Option("3", text: "Black"),
                                create.Option("4", text: "White")),
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Honda"),
                            create.Option("2", text: "Toyota"),
                            create.Option("3", text: "Mustang"),
                            create.Option("4", text: "Poche"),
                            create.Option("5", text: "Mistshubishi")),
                        create.MultipleSelectionQuestion("carsbest", "which carabc do you like best", "", null,
                            create.Option("1", text: "Honda"),
                            create.Option("2", text: "Toyota"),
                            create.Option("3", text: "Poche"),
                            create.Option("4", text: "Mustang")),
                        create.OpenEndedShortTextQuestion("shortabc", "Short text title", "ABC"),
                        create.Information("infoabc", "abc", "abc"),
                        create.SingleSelectionQuestion("carslike", "Which cars do you like?", "Please choose your answer", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "BMW"),
                            create.Option("2", text: "Mercedes"),
                            create.Option("3", text: "Audi"),
                            create.Option("4", text: "Opel"),
                            create.Option("5", text: "Volkswagen")
                            ),
                        create.NetPromoterScoreQuestion("promoteosd", "Net Promoter Score®", "On a scale from 0-10, how likely are you to recommend Orient Software to a friend or colleague?", q =>
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
                            create.Option("10", "10"))
                    ),
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 2");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.SingleSelectionGridQuestion("planecolors", "abc", "abc",
                            create.MultipleSelectionQuestion("placeholdermulti", "", "", q => q.OrderType = OrderType.InOrder,
                                create.Option("1", text: "Green"),
                                create.Option("2", text: "Read"),
                                create.Option("3", text: "abc")),
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Topic 1"),
                            create.Option("2", text: "Airbus"),
                            create.Option("3", text: "Boeing")),
                        create.SingleSelectionQuestion("selectoption", "Single Selection", "abc", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "Option 1"),
                            create.Option("2", text: "Option 2"),
                            create.Option("3", text: "Option 3"),
                            create.Option("4", text: "Option 4")),
                        create.OpenEndedLongTextQuestion("notsolong", "Long Text Title", "Long Text", q =>
                        {
                            q.Rows = 8;
                        }),
                        create.NumericQuestion("abcnum", "abc Numberic", "abc"),
                        create.ScaleQuestion("bigscale", "LIker Scale", "LIker Scale", q =>
                        {
                            q.DisplayOrientation = DisplayOrientation.Horizontal;
                            q.LikertLeftText = create.CreateLanguageString("left");
                            q.LikertCenterText = create.CreateLanguageString("mid");
                            q.LikertRightText = create.CreateLanguageString("right");
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
                            create.Option("10", "10"),
                            create.Option("11", "11"),
                            create.Option("12", "12"),
                            create.Option("13", "13"),
                            create.Option("14", "14"),
                            create.Option("15", "15"))),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "UI Test Keyboard Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.Status = SurveyStatus.Open;
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";

            return survey;
        }
    }
}
