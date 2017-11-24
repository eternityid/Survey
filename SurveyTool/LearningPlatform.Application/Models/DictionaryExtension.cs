using System.Collections.Generic;
using System.Collections.Specialized;

namespace LearningPlatform.Application.Models
{
    public static class DictionaryExtension
    {
        public static NameValueCollection ToNameValueCollection(this Dictionary<string, string> dictionary)
        {
            var ret = new NameValueCollection();
            foreach (var keyValue in dictionary)
            {
                ret.Add(keyValue.Key, keyValue.Value);
            }
            return ret;
        }
    }
}