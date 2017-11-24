using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition
{

    public class ExportService
    {
        private readonly ISurveyRepository _surveyRepository;

        public ExportService(ISurveyRepository surveyRepository, 
            IThemeRepository themeRepository, SurveyDesign.Factory surveyDesignFactory)
        {
            _surveyRepository = surveyRepository;
        }

        public string Export(string surveyId)
        {
            Survey survey = _surveyRepository.GetById(surveyId);

            var jsonString = JsonConvert.SerializeObject(survey, Formatting.Indented,
                JsonSerializerSettingsFactory.CreateForExport(new NodeService(survey)));
            return TypeTokenUpdater.Process(jsonString);
        }
    }
}
