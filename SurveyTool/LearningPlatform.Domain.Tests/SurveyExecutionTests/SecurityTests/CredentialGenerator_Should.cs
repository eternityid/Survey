using LearningPlatform.Domain.SurveyExecution.Security;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.SecurityTests
{
    [TestClass]
    public class CredentialGenerator_Should
    {
        [TestMethod]
        public void ReturnStringWithLength10()
        {
            var result = CredentialGenerator.Create();

            Assert.AreEqual(10, result.Length);
        }

        [TestMethod]
        public void ReturnUniqueStrings()
        {
            var result = CredentialGenerator.Create();
            var result2 = CredentialGenerator.Create();

            Assert.AreNotEqual(result, result2);
        }

    }
}