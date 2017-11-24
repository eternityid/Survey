using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public interface IHostObject
    {
        string GetDescription(string id);
        string GetTitle(string id);
        bool IsForward();
        void Redirect(string url);
        bool Contains(IList<string> list, string element);
    }
}