﻿using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Questions;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.ImportExportSurveyDef.GivenSurveyWith
{
    [Binding]
    public class SkipLogic
    {
        private readonly SurveyContext _surveyContext;

        public SkipLogic(SurveyContext surveyContext)
        {
            _surveyContext = surveyContext;
        }

        [Given(@"I have survey with skip logic for export")]
        public void GivenIHaveSurveyWithSkipLogic()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            var skipCommand = new SkipCommand();
            var skipCommand2 = new SkipCommand();
            OpenEndedTextQuestionDefinition name;
            QuestionDefinition questionOnPage;
            QuestionDefinition informationOnLastPage;
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(p =>
                    {
                        p.SkipCommands.Add(skipCommand);
                        p.SkipCommands.Add(skipCommand2);
                    },
                        (name = create.OpenEndedShortTextQuestion("name"))),
                    create.Page(
                        create.OpenEndedShortTextQuestion("notForOeyvind")),
                    create.Page(
                        (questionOnPage = create.OpenEndedShortTextQuestion("alsoNotForOeyvind"))),
                    create.Page(
                        (informationOnLastPage = create.Information("Completed")))));

            survey.SurveySettings.SurveyTitle = "New Survey";

            skipCommand.SurveyId = survey.Id;
            skipCommand.SkipToQuestionId = informationOnLastPage.Id;
            skipCommand.Expression = new ExpressionFactory(survey.Id).Question(name).IsEqual("'Oeyvind'").Build();

            skipCommand2.SurveyId = survey.Id;
            skipCommand2.SkipToQuestionId = questionOnPage.Id;
            skipCommand2.Expression = new ExpressionFactory(survey.Id).Question(name).IsEqual("'John'").Build();

            _surveyContext.AddSurvey(survey);
        }
    }
}
