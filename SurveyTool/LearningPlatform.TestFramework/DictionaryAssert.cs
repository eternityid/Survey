using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.TestFramework
{
    public static class DictionaryAssert
    {
        public static void AreEqual<T, TU>(IDictionary<T, TU> expectedResult, IDictionary<T, TU> actual)
        {
            Assert.AreEqual(expectedResult.Count, actual.Count,"Count");
            foreach (var aKey in expectedResult.Keys)
            {
                Assert.AreEqual(expectedResult[aKey], actual[aKey]);
            }
        }
    }
}