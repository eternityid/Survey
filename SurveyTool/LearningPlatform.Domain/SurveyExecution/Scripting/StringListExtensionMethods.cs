using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.ClearScript;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public static class StringListExtensionMethods
    {

        public static List<string> ToStringList(this PropertyBag source)
        {
            var list = new List<string>();
            foreach (KeyValuePair<string, object> i in source)
            {
                bool isChecked = i.Value != null && i.Value.ToString() != "False";
                if (isChecked)
                {
                    list.Add(i.Key.ToString(CultureInfo.InvariantCulture));
                }
            }
            return list;
        }


        public static PropertyBag ToPropertyBag(this IDictionary dictionary)
        {
            var propertyBag = new PropertyBag();
            foreach (object key in dictionary.Keys)
            {
                propertyBag.Add(key.ToString(), dictionary[key]);
            }
            return propertyBag;
        }
    }
}