using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.GoToFolder.GivenSurveyWith
{
    [Binding]
    public class GoToFolderNode
    {
        private readonly PageContext _pageContext;

        public GoToFolderNode(PageContext pageContext)
        {
            _pageContext = pageContext;
        }


        [Given(@"I have a survey with go to folder elements")]
        public void GivenGoToFolder()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.GoToFolder("folder1"),
                    create.Page(
                        create.OpenEndedShortTextQuestion("q1")),
                    create.Folder("folder1",
                        create.Page(
                            create.OpenEndedShortTextQuestion("q2"))),
                    create.Page(
                        create.OpenEndedShortTextQuestion("q3")),
                    create.GoToFolder("folder1"),
                    create.Page(
                        create.Information("complete"))));

            //var sw1 = new StringWriter();
            //var settings = new JsonSerializerSettings { Formatting = Formatting.Indented };
            //JsonSerializer.Create(settings).Serialize(sw1, survey);

            //var sw2 = new StringWriter();
            //JsonSerializer.Create(settings).Serialize(sw2, survey2);

            //Assert.AreEqual(sw1.ToString(), sw2.ToString());
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}