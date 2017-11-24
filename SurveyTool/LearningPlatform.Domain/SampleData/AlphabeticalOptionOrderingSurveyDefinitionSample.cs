using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SampleData
{
    public class AlphabeticalOptionOrderingSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;

        public AlphabeticalOptionOrderingSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("11");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var survey = create.Survey(
                create.Folder("Main Page",
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 1");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.SingleSelectionQuestion("SingleSelectionQuestion1", 
                            new[] { "Demo Single Selection Question", "no::Demo enkeltvalgspørsmål" }, 
                            new[] { "Please choose your answer", "no::Vennligst velg" }, 
                            q => {
                                q.OrderType = OrderType.Alphabetical;
                            },
                            create.Option("1", text: new[] { "Apple", "no::Eple" }),
                            create.Option("2", text: new[] { "Orange", "no::Apelsin" }),
                            create.Option("3", text: new[] { "Banana", "no::Banan" })
                            )),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Alphabetical Option Order";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";
            survey.SurveySettings.DefaultLanguage = "en";
            survey.SurveySettings.Languages = new[] { "en", "no" };
            return survey;
        }
    }
}
