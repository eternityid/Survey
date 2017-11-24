using System;
using System.Diagnostics;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace LearningPlatform.Specs.Then
{
    [Binding]
    public class ThenTheDatabaseShould
    {
        private readonly InstanceContext _instanceContext;

        public ThenTheDatabaseShould(InstanceContext instanceContext)
        {
            _instanceContext = instanceContext;
        }

        [Then(@"the database should have the following responses")]
        public void ThenTheDatabaseShouldHaveTheFollowingResponses(Table table)
        {
            table.CompareToSet(_instanceContext.ResponseRowRepository.AllRows);
        }
    }
}
