using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public static class StringListConverter
    {
        public static List<string> ToStringList(object obj)
        {
            var stringList = obj as List<string>;
            if (stringList != null) return stringList;
            dynamic source = obj;
            var result = new List<string>();
            for (int i = 0; i < source.length; i++)
            {
                result.Add(source[i].ToString());
            }
            return result;
        }
    }
}