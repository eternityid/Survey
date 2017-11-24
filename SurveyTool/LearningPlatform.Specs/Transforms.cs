using System.Collections.Generic;
using System.Linq;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs
{
    [Binding]
    public class Transforms
    {
        [StepArgumentTransformation(@"aliases (.*)")]
        public List<string> CodesList(string text)
        {
            return ConvertToStringList(text);
        }

        [StepArgumentTransformation(@"ids (.*)")]
        public List<string> StringList(string text)
        {
            return ConvertToStringList(text);
        }

        [StepArgumentTransformation(@"properties (.*)")]
        public List<string> PropertiesList(string text)
        {
            return ConvertToStringList(text);
        }


        private static List<string> ConvertToStringList(string text)
        {
            if (text == "[]") return new List<string>();
            if (text.StartsWith("[") && text.EndsWith("]"))
            {
                text = text.Substring(1, text.Length - 2);
            }
            return text.Split(',').Select(o => o.Trim()).ToList();
        }
    }
}