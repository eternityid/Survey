using CsvHelper;
using LearningPlatform.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace LearningPlatform.Domain.UtilServices
{
    public static class CsvService
    {
        public static CsvData ExtractData(string csvFilePath)
        {
            var data = new CsvData();

            using (var csvReader = new CsvReader(new StreamReader(csvFilePath)))
            {
                csvReader.Configuration.Delimiter = GetDelimiterFromFileExtension(csvFilePath);
                csvReader.Configuration.SkipEmptyRecords = true;

                // Get column headings of CSV file
                // If file is empty, it will throw exception
                try
                {
                    csvReader.ReadHeader();
                }
                catch
                {
                    return data;
                }

                data.Headings = csvReader.FieldHeaders.Select(x => x.Trim()).ToList();
                data.RowContents = new List<List<string>>();
                while (csvReader.Read())
                {
                    data.RowContents.Add(csvReader.CurrentRecord.Select(x => x?.Trim()).ToList());
                }
                csvReader.Dispose();
            }

            return data;
        }

        private static string GetDelimiterFromFileExtension(string fileName)
        {
            var fileExtension = Path.GetExtension(fileName);
            return fileExtension != null && fileExtension.Equals(".tsv") ? "\t" : ",";
        }

        public static string ValidateImportingRespondentFile(CsvData importingData)
        {
            const int maxOfInvalidEmails = 10;
            var rowPosition = 1;
            var numberOfInvalidEmails = 0;
            int invalidEmailColumnIndex = -1;
            int emailColumnIndex = GetEmailColumnIndexBy(importingData.Headings);
            var errorMessageBuilder = new StringBuilder();
            errorMessageBuilder.AppendLine("Invalid email-addresses:");

            if (importingData.Headings == null || importingData.Headings.Any() == false) return "Invalid data file: Imported file is empty.";

            IEnumerable<string> invalidHeadings = importingData.Headings.Where(h => h.Equals(string.Empty, StringComparison.CurrentCultureIgnoreCase));
            if (invalidHeadings.Any()) return "Invalid data file:\nInvalid imported format file";

            if (emailColumnIndex <= invalidEmailColumnIndex) return "Invalid data file:\nNot found email heading in the file";
            if (importingData.RowContents == null || !importingData.RowContents.Any()) return null;

            foreach (var rowContent in importingData.RowContents)
            {
                var email = rowContent.ElementAtOrDefault(emailColumnIndex);
                if (!EmailService.ValidateEmail(email))
                {
                    errorMessageBuilder.AppendLine($"<br>Line {rowPosition} : {email}");
                    numberOfInvalidEmails++;
                }
                rowPosition++;
                if (numberOfInvalidEmails >= maxOfInvalidEmails) return errorMessageBuilder.ToString();
            }

            return numberOfInvalidEmails > 0 ? errorMessageBuilder.ToString() : null;
        }

        public static int GetEmailColumnIndexBy(IEnumerable<string> headings)
        {
            try
            {
                const string emailColumnHeading = "email";
                return headings.ToList().FindIndex(h => h.Equals(emailColumnHeading, StringComparison.CurrentCultureIgnoreCase));
            }
            catch(ArgumentNullException ex)
            {
                throw ex;
            }
        }
    }
}
