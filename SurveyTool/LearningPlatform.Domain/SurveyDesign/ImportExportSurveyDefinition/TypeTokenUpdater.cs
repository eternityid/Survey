using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition
{
    public class TypeTokenUpdater
    {
        private const string DollarTypeString = "$type";

        private static readonly Dictionary<string, string> TypePropertyMappings = new Dictionary<string, string>
        {
            {"", "Survey"},
            {"..topFolder", "Folder"},
            {"..optionList", "OptionList"},
            {"..options", "Option"},
            {"..optionsMask" , "OptionsMask"},
            {"..text", "LanguageString"},
            { "..title", "LanguageString"},
            {"..description" , "LanguageString"},
            {"..items", "LanguageStringItem"},
            {"..surveySettings", "SurveySettings"},
            {"..nextButtonText", "LanguageString"},
            {"..previousButtonText", "LanguageString"},
            {"..likertLeftText" , "LanguageString"},
            {"..likertCenterText" , "LanguageString"},
            {"..likertRightText", "LanguageString"},
            {"..trueFolder", "Folder"},
            {"..falseFolder", "Folder"},
            {"..expression", "Expression"},
            {"..expressionItem", "ExpressionItem"}
        };

        public static string Process(string jsonString)
        {
            var jObject = JObject.Parse(jsonString);
            foreach (var key in TypePropertyMappings.Keys)
            {
                //RemoveTypeTokens(jObject, key);//TODO consider remove more
            }
            return jObject.ToString().Replace("\"$type\": ", "\"type\": ");
        }

        public static string Restore(string jsonString)
        {
            var content = jsonString.Replace("\"type\": ", "\"$type\": ");
            var jObject = JObject.Parse(content);
            foreach (var key in TypePropertyMappings.Keys)
            {
                //AddTypeTokens(jObject, key);//TODO consider remove more
            }
            return jObject.ToString();
        }


        private static void AddTypeTokens(JObject json, string jPath)
        {
            TraverseTokens(json, jPath, AddTypeToken);
        }

        private static void RemoveTypeTokens(JObject json, string jPath)
        {
            TraverseTokens(json, jPath, RemoveTypeToken);
        }

        private static void TraverseTokens(JObject json, string jPath, Action<string, JToken> action)
        {
            foreach (var token in json.SelectTokens(jPath))
            {
                if (token is JObject)
                {
                    action(jPath, token);
                }
                else if (token is JArray)
                {
                    foreach (var tokenItem in ((JArray)token))
                    {
                        action(jPath, tokenItem);
                    }
                }
            }
        }

        private static void AddTypeToken(string jPath, JToken token)
        {
            var jObject = (JObject)token;
            jObject.AddFirst(new JProperty(DollarTypeString, TypePropertyMappings[jPath]));
        }


        private static void RemoveTypeToken(string jPath, JToken token)
        {
            JProperty first = token.FirstOrDefault() as JProperty;
            if (first != null && first.Name == DollarTypeString)
            {
                first.Remove();
            }
        }



    }
}