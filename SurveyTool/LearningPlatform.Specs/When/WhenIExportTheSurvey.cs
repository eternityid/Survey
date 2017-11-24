using System;
using System.IO;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.When
{
    [Binding]
    public class WhenIExportTheSurvey
    {
        private readonly InstanceContext _instances;
        private readonly SurveyContext _surveyContext;
        private readonly InMemoryFileSystem _fileSystem;

        public WhenIExportTheSurvey(InstanceContext instances, SurveyContext surveyContext, InMemoryFileSystem fileSystem)
        {
            _instances = instances;
            _surveyContext = surveyContext;
            _fileSystem = fileSystem;
        }

        [When(@"I export the survey as (.*)")]
        public void ExportSurvey(string fileName)
        {
            var content = _instances.ImportExportSurveyService.Export(_surveyContext.SurveyId);
            _fileSystem.Save(fileName, content);
        }

        [When(@"I import the survey (.*)")]
        public void WhenIImportTheSurveyExport_Json(string fileName)
        {
            Import(fileName);
        }

        [Given(@"I import the survey (.*)")]
        public void GivenIImportTheSurveyExport_Json(string fileName)
        {
            Import(fileName);
        }

        private void Import(string fileName)
        {
            var content = _fileSystem.Read(fileName);
            var randomFileName = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            File.WriteAllText(randomFileName, content);
            try
            {
                var survey = _instances.ImportExportSurveyService.ImportFromFile(randomFileName, "New Survey", "");
                _surveyContext.SurveyId = survey.Id;
            }
            finally
            {
                try
                {
                    File.Delete(randomFileName);
                }
                catch (Exception) { /* If we cannot delete the file (clean up), just ignore it. */}
            }
        }
    }
}
