using System.Security.Cryptography;
using LearningPlatform.Domain.SurveyExecution.Security;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.SecurityTests
{
    [TestClass]
    public class VariablesProtector_Should
    {
        [TestMethod]
        public void PreserveVariableValues()
        {
            var variables = new ProtectedVariables
            {
                Credential = "credential",
                PageId = "10",
                RespondentId = 5,
                Ticks = 102338283828
            };
            var protectedString = VariablesProtector.Protect(variables);
            var result = VariablesProtector.Unprotect(protectedString);
            AssertAreEqual(variables, result);
        }

        [TestMethod]
        [ExpectedException(typeof(CryptographicException))]
        public void ThrowCryptographicExceptionWhenPurposeDoesNotMatch()
        {
            var variables = new ProtectedVariables
            {
                Credential = "credential",
                PageId = "10",
                RespondentId = 5,
                Ticks = 102338283828
            };
            var protectedString = VariablesProtector.Protect(variables, "external");
            var result = VariablesProtector.Unprotect(protectedString, "internal");
        }


        private static void AssertAreEqual(ProtectedVariables expected, ProtectedVariables actual)
        {
            Assert.AreEqual(expected.Credential, actual.Credential, "Credential");
            Assert.AreEqual(expected.PageId, actual.PageId, "PageId");
            Assert.AreEqual(expected.RespondentId, actual.RespondentId, "RespondentId");
            Assert.AreEqual(expected.Ticks, actual.Ticks, "Ticks");
        }
    }
}