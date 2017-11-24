using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Diagnostics;

using System.IO;
using System.Linq;

namespace LearningPlatform.TestFramework
{
    public static class JsonAssert
    {
        public static void AreEqual(string expectedContent, string actualContent, string expectedFileName, string[] ignoreProperties)
        {
            var expected = JObject.Parse(expectedContent);
            var actual = JObject.Parse(actualContent);
            var issues = new Dictionary<string, string>();
            AssertAreEqual(expected, actual, ignoreProperties, issues);
            string actualFileName = expectedFileName.Replace("\\expected\\", "\\actual\\");
            var fileInfo = new FileInfo(Path.Combine(@"..\..", actualFileName));
            if (fileInfo.Directory!=null && !fileInfo.Directory.Exists)
            {
                fileInfo.Directory.Create();
            }
            File.WriteAllText(fileInfo.FullName, actualContent);

            if (issues.Count>0)
            {
                Debug.WriteLine("ActualFile:   " + fileInfo.FullName);
                Debug.WriteLine("ExpectedFile: " + new FileInfo(Path.Combine(@"..\..", expectedFileName)).FullName);

                foreach (var issue in issues.Values)
                {
                    Debug.WriteLine(issue);
                }
                Assert.Fail("The JSON did not match expected result");
            }
        }

        private static void AssertAreEqual(JObject expectedJObject, JObject actualJObject, string[] ignoreProperties, Dictionary<string, string> issues)
        {
            if (!JToken.DeepEquals(expectedJObject, actualJObject))
            {
                foreach (KeyValuePair<string, JToken> actualProperty in actualJObject)
                {
                    Compare(issues, ignoreProperties, actualProperty, expectedJObject.Property(actualProperty.Key), "Actual", "Expected");
                }
                foreach (KeyValuePair<string, JToken> expectedProperty in expectedJObject)
                {
                    Compare(issues, ignoreProperties, expectedProperty, actualJObject.Property(expectedProperty.Key), "Expected", "Actual");
                }
            }
        }

        private static void Compare(Dictionary<string, string> issues, string[] ignoreProperties, KeyValuePair<string, JToken> property1, JProperty property2, string property1Text, string property2Text)
        {
            if (ignoreProperties.Contains(property1.Key))
            {
                return;
            }

            if (property2 == null)
            {
                issues[property1.Key] = string.Format("{0} property is missing in {1} result", property1.Key, property2Text);
                return;
            }

            if (!JToken.DeepEquals(property1.Value, property2.Value))
            {
                var property1JObject = property1.Value as JObject;
                var property2JObject = property2.Value as JObject;
                if (property1JObject != null && property2JObject != null)
                {
                    AssertAreEqual(property1JObject, property2JObject, ignoreProperties, issues);
                    return;
                }
                issues[property1.Key] = string.Format(
@"Property did not match:\n\r
{0}\t\t{1}\n\r
{2}\t\t{3}", property1Text, property1.Value.Parent, property2Text, property2.Value.Parent);
            }
        }
    }
}
