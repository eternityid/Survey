using System.Collections.Generic;
using System.Collections.Specialized;

namespace LearningPlatform.Application.Models
{
    public class Form
    {
        public Form()
        {
            Answers = new Dictionary<string, string>();
        }

        public string Context { get; set; }
        public NavigationDirection Direction { get; set; }
        public Dictionary<string, string> Answers { get; private set; }

        public NameValueCollection GetNameValueCollection()
        {
            var ret = Answers.ToNameValueCollection();
            ret["context"] = Context;
            return ret;
        }

    }
}