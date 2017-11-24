using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace LearningPlatform.Domain.SurveyDesign.ExportResponses
{
    public static class ExportResponsesHelper
    {
        public static string StripHtmlTags(string source)
        {
            var htmlRegex = new Regex("<.*?>", RegexOptions.Compiled);
            string breakLineTag = "\n";

            string result = htmlRegex.Replace(source, string.Empty);

            if (!result.EndsWith(breakLineTag)) return result;
            return result.Substring(0, result.Length - breakLineTag.Length);
        }

        public static List<string> UpdateListStringWithQuotationMarks(List<string> source)
        {
            var specialCharacters = new[] { ',', '\n', '\t', '\"' };

            for (var i = 0; i < source.Count; i++)
            {
                if (IsNeedDoubleQuotes(source[i], specialCharacters))
                {
                    source[i] = "\"" + source[i].Replace("\"", "\"\"") + "\"";
                }
            }

            return source;
        }

        public static bool IsNeedDoubleQuotes(string source, char[] characters)
        {
            return source.IndexOfAny(characters) >= 0;
        }

        public static string GetSeparator(ExportResponsesSeparator separator)
        {
            switch (separator)
            {
                case ExportResponsesSeparator.CommaSeparator:
                    return ",";
                case ExportResponsesSeparator.TabSeparator:
                    return "\t";
                default:
                    return ",";
            }
        }
    }
}
