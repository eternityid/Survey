using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Bson;
using System;

namespace LearningPlatform.Domain.SampleData
{
    public class SkipSurveyDefinitionSample
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly SurveyDesign.SurveyDesign.Factory _surveyDesignFactory;
        public SkipSurveyDefinitionSample(ISurveyRepository surveyRepository,
            SurveyDesign.SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyRepository = surveyRepository;
            _surveyDesignFactory = surveyDesignFactory;
        }

        public Survey CreateSurvey()
        {
            string surveyId = ObjectIdHelper.GetObjectIdFromLongString("7");
            //To Do
            var create = _surveyDesignFactory.Invoke(surveyId: surveyId, useDatabaseIds: true);

            var skipCommand = new SkipCommand();
            var skipCommand2 = new SkipCommand();
            OpenEndedTextQuestionDefinition name = create.OpenEndedShortTextQuestion("name", "Try John or Oeyvind to skip", string.Empty, q => q.Id = ObjectId.GenerateNewId().ToString());
            QuestionDefinition questionOnLastPage= create.Information("Completed", "Completed");
            questionOnLastPage.Id = ObjectId.GenerateNewId().ToString();
            QuestionDefinition questionOnPage = create.OpenEndedShortTextQuestion("alsoNotForOeyvind", "Also not for Oeyvind", string.Empty, q => q.Id = ObjectId.GenerateNewId().ToString());


            skipCommand.SurveyId = surveyId;
            skipCommand.SkipToQuestionId = questionOnLastPage.Id;
            skipCommand.Expression = new ExpressionFactory(surveyId)
                .When(e => e.Question(name).IsEqual("'Oeyvind'")).Build();
            skipCommand2.SurveyId = surveyId;
            skipCommand2.SkipToQuestionId = questionOnPage.Id;
            skipCommand2.Expression = new ExpressionFactory(surveyId)
                .When(e => e.Question(name).IsEqual("'John'")).Build();


            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(p =>
                    {
                        p.Title = create.CreateLanguageString("Page 1");
                        p.Alias = "Page_" + DateTime.Now.Ticks;
                        p.SkipCommands.Add(skipCommand);
                        p.SkipCommands.Add(skipCommand2);
                    },
                        name ),
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 2");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        create.OpenEndedShortTextQuestion("notForOeyvind", "Not for Oeyvind (or John)")),
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 3");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },questionOnPage),
                    create.Page(
                        page =>
                        {
                            page.Title = create.CreateLanguageString("Page 4");
                            page.Alias = "Page_" + DateTime.Now.Ticks;
                        },
                        questionOnLastPage),
                    create.ThankYouPage()));
           
            survey.SurveySettings.SurveyTitle = "Skip Survey";
            survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString("1");
            survey.UserId = "f6e021af-a6a0-4039-83f4-152595b4671a";


            

            return survey;
        }

    }
}
