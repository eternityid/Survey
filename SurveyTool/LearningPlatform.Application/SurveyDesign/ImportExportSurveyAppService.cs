using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using System.IO;

namespace LearningPlatform.Application.SurveyDesign
{
    public class ImportExportSurveyAppService
    {
        private readonly ExportService _exportService;
        private readonly ImportSurveyService _importSurveyService;

        public ImportExportSurveyAppService(
            ExportService exportService,
            ImportSurveyService importSurveyService)
        {
            _exportService = exportService;
            _importSurveyService = importSurveyService;
        }

        public string Export(string surveyId)
        {
            return _exportService.Export(surveyId);
        }

        public Survey ImportFromFile(string fileName, string surveyName, string userId)
        {
            string content;
            using (var file = File.OpenText(fileName))
            {
                content = file.ReadToEnd();
            }
            return Import(content, surveyName, userId);
        }

        private Survey Import(string content, string surveyName, string userId)
        {
            return _importSurveyService.Import(content, surveyName, userId);
        }
    }
}
