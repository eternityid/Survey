using LearningPlatform.TestFramework;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Then
{
    [Binding]
    public class ThenSurveyShould
    {
        private readonly InstanceContext _instances;
        private readonly SurveyContext _surveyContext;


        public ThenSurveyShould(InstanceContext instances, SurveyContext surveyContext)
        {
            _instances = instances;
            _surveyContext = surveyContext;
        }

        [Then(@"survey should have SurveyId set")]
        public void ThenSurveyShouldHaveSurveyIdSet()
        {
            var survey = _instances.SurveyRepository.GetById(_surveyContext.SurveyId);
            Assert.AreEqual(_surveyContext.SurveyId, survey.TopFolder.ChildNodes[0].SurveyId); //We are only checking first child of top folder, but the all properties that include SurveyId should be set.
        }


    }
}
