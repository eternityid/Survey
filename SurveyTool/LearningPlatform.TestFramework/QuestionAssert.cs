using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Questions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.TestFramework
{
    public class QuestionAssert
    {
        public static void AreEqual(Question expected, Question actual, AssertMode mode = AssertMode.Partial)
        {
            Assert.AreEqual(expected.Alias, actual.Alias, "Alias");
            Assert.AreEqual(expected.GetType(), actual.GetType(), "Type");
        }


        public static void AreEqual(QuestionWithOptions expected, QuestionWithOptions actual, AssertMode mode = AssertMode.Partial)
        {
            AreEqual((Question)expected, actual, mode);
            if (mode == AssertMode.Full || expected.Options != null)
            {
                CollectionAssertGeneric<Option>.AreEqual(expected.Options, actual.Options, new OptionComparer());
            }
        }
    }
}