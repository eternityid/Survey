using System.Collections.Generic;

namespace LearningPlatform.Domain.ValueObjects
{
    public class CsvData
    {
        public List<string> Headings { get; set; }
        public List<List<string>> RowContents { get; set; }
    }
}
