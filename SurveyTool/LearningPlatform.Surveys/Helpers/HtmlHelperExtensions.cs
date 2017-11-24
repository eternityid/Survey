using System.Web;
using System.Web.Mvc;
using LearningPlatform.Domain.SurveyExecution.Scripting;

namespace LearningPlatform.Helpers
{
    public static class HtmlHelperExtensions
    {
        public static IHtmlString EvaluateString(this HtmlHelper helper, string html)
        {
            return helper.Raw(DependencyResolver.Current.GetService<IScriptExecutor>().EvaluateString(html));
        }

    }
}