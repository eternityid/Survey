using LearningPlatform.TestFramework;
using System.Collections.Generic;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Then
{
    [Binding]
    public class ThenFileShould
    {
        private readonly InMemoryFileSystem _fileSystem;

        public ThenFileShould(InMemoryFileSystem fileSystem)
        {
            _fileSystem = fileSystem;
        }

        [Then(@"json file (.*) should equal (.*) with no properties ignored")]
        public void JsonFileShouldEqual(string expectedFileName, string actualFileName)
        {
            var actualContent = _fileSystem.Read(actualFileName);
            string expectedContent = _fileSystem.Read(expectedFileName);
            JsonAssert.AreEqual(expectedContent, actualContent, expectedFileName, new string[0]);
        }

        [Then(@"json file (.*) should equal (.*) while ignore the (properties .*)")]
        public void JsonFileShouldEqualIgnore(string expectedFileName, string actualFileName, List<string> ignoreProperties)
        {
            var actualContent = _fileSystem.Read(actualFileName);
            string expectedContent = _fileSystem.Read(expectedFileName);
            JsonAssert.AreEqual(expectedContent, actualContent, expectedFileName, ignoreProperties.ToArray());
        }
    }
}
