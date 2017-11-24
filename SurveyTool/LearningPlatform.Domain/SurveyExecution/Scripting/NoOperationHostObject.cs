using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public class NoOperationHostObject : IHostObject
    {
        public string GetDescription(string id)
        {
            return "";
        }

        public string GetTitle(string id)
        {
            return "";
        }

        public bool IsForward()
        {
            return true;
        }

        public void Redirect(string url)
        {
        }

        public bool Contains(IList<string> list, string element)
        {
            return true;
        }
    }
}