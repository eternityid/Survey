using LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class ExportSurveyService
    {
        public string Export(Domain.SurveyDesign.Survey survey)
        {
            var errors = new ValidateSurveyService(survey).Validate();
            if (errors.Any()) throw new InvalidOperationException("Can't export an invalid survey");

            var jsonString = JsonConvert.SerializeObject(survey, Formatting.Indented,
                JsonSerializerSettingsFactory.CreateForExport(new NodeService(survey)));
            return TypeTokenUpdater.Process(jsonString);
        }
    }
}
