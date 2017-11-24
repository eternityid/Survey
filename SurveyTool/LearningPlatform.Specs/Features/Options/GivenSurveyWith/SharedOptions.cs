using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Options.GivenSurveyWith
{
    [Binding]
    public class SharedOptions
    {
        private readonly PageContext _pageContext;

        public SharedOptions(PageContext pageContext)
        {
            _pageContext = pageContext;
        }


        [Given(@"I have a survey with shared options")]
        public void GivenIHaveASurveyWithSharedOptions()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            var optionsList = create.OptionList("shared",
                create.Option("1"),
                create.Option("2"),
                create.Option("3"));
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion("numbers", (string)null, null, null,
                            create.Option("", referenceListId: optionsList.Id)
                            )),
                    create.Page(
                        create.SingleSelectionQuestion("numbers2", (string)null, null, null,
                            create.Option("", referenceListId: optionsList.Id, optionsMask: new OptionsMask
                            {
                                OptionsMaskType = OptionsMaskType.Custom,
                                CustomOptionsMask = "questions.numbers.optionsSelected"
                            })
                            ))));
            survey.SharedOptionLists = new List<OptionList> {optionsList};
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}