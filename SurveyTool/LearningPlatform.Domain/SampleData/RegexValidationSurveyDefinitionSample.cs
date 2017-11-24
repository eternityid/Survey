using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class RegexValidationSurveyDefinitionSample
    {
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        public RegexValidationSurveyDefinitionSample(SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("12");
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);
            var survey = create.Survey(
                create.Folder("Main Page",
                    create.Page(page =>
                    {
                        page.Title = create.CreateLanguageString("Page 1");
                        page.Alias = "Page_" + DateTime.Now.Ticks;
                    },create.OpenEndedShortTextQuestion("ZipCode", "Zip", "Please enter your zip code", null,
                        create.RegularExpressionValidation(@"^\d{5}(?:[-\s]\d{4})?$", "Please type a valid zip code"))),
                    create.ThankYouPage()));
            survey.SurveySettings.SurveyTitle = "Regex Validation Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";
            survey.SurveySettings.DefaultLanguage = "en";
            survey.SurveySettings.Languages = new[] { "en" };
            return survey;
        }
    }
}
