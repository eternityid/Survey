using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using MongoDB.Bson;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class NestedLoopSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public NestedLoopSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("9");

            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 1");
                            page.Alias = "Page_1";
                            page.Id = ObjectId.GenerateNewId().ToString();
                        }, 
                        create.MultipleSelectionQuestion("q1", "", "", q=>q.Id = ObjectId.GenerateNewId().ToString(),
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
                        create.Page(page => {
                            page.Id = ObjectId.GenerateNewId().ToString();
                            page.Alias = "Page_2";
                        },
                            create.OpenEndedShortTextQuestion("q2", "Please describe your opinion on {{loops.loop}}",string.Empty,q=>q.Id=ObjectId.GenerateNewId().ToString())),
                        create.Loop("innerLoop", "", new[]
                        {
                            create.Option("look", text: "Look"),
                            create.Option("quality", text: "Quality")
                        }, create.Page(
                            page => {
                                page.Id = ObjectId.GenerateNewId().ToString();
                                page.Alias = "Page_3";
                            },
                            create.RatingQuestion("Rating", "Please rate {{loops.loop}} for {{loops.innerLoop}}", "", 5, q => q.Id = ObjectId.GenerateNewId().ToString())))
                        ),
                    create.Page(page =>
                    {
                        page.Title = create.CreateLanguageString("Page 4");
                        page.Alias = "Page_4";
                        page.Id = ObjectId.GenerateNewId().ToString();
                    }, create.Information("complete")),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Nested Loop Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";

            return survey;
        }
    }
}
