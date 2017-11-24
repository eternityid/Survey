using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Security;
using LearningPlatform.Domain.UtilServices;
using LearningPlatform.Domain.ValueObjects;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace LearningPlatform.Domain.Respondents
{
    public class RespondentImportService
    {
        private readonly IRespondentRepository _respondentRepository;
        private readonly ISurveyRepository _surveyRepository;

        public RespondentImportService(IRespondentRepository respondentRepository,
            ISurveyRepository surveyRepository)
        {
            _respondentRepository = respondentRepository;
            _surveyRepository = surveyRepository;
        }

        public string Import(string surveyId, bool isTesting, string uploadedFilePath)
        {
            CsvData csvData = CsvService.ExtractData(uploadedFilePath);
            string validateResult = CsvService.ValidateImportingRespondentFile(csvData);
            if (validateResult != null) return validateResult;

            AddOrUpdateCustomColumnsData(surveyId, csvData.Headings);
            ImportContactsToDb(surveyId, isTesting, csvData);

            File.Delete(uploadedFilePath);
            return null;
        }

        private void AddOrUpdateCustomColumnsData(string surveyId, List<string> columnHeadings)
        {
            var survey = _surveyRepository.GetById(surveyId);
            if (survey == null) throw new KeyNotFoundException();

            int emailColumnIndex = CsvService.GetEmailColumnIndexBy(columnHeadings);
            List<string> columnHeadingsWithoutEmailHeading = new List<string>(columnHeadings);
            columnHeadingsWithoutEmailHeading.RemoveAt(emailColumnIndex);

            survey.CustomColumns = columnHeadingsWithoutEmailHeading.Any() ? string.Join(",", columnHeadingsWithoutEmailHeading) : null;
            _surveyRepository.Update(survey);
        }


        private void ImportContactsToDb(string surveyId, bool isTesting, CsvData csvData)
        {
            if (!csvData.RowContents.Any()) return;

            int emailColumnIndex = CsvService.GetEmailColumnIndexBy(csvData.Headings);
            List<string> customColumnHeadings = csvData.Headings;
            customColumnHeadings.RemoveAt(emailColumnIndex);

            foreach (var rowContent in csvData.RowContents)
            {
                var email = rowContent.ElementAtOrDefault(emailColumnIndex);
                rowContent.RemoveAt(emailColumnIndex);
                var customColumnsData = rowContent.Any() ? BuildCustomColumnsData(customColumnHeadings, rowContent) : null;

                _respondentRepository.AddUsingMerge(new Respondent
                {
                    Credential = CredentialGenerator.Create(),
                    SurveyId = surveyId,
                    EmailAddress = email,
                    NumberSent = 0,
                    CustomColumns = customColumnsData
                }, isTesting);
            }
        }

        private string BuildCustomColumnsData(List<string> customColumnHeadings, List<string> rowContentComponents)
        {
            var data = new JObject();
            for (var index = 0; index < customColumnHeadings.Count; index++)
            {
                data.Add(customColumnHeadings[index], rowContentComponents.ElementAtOrDefault(index));
            }

            return data.ToString();
        }
        
    }
}
