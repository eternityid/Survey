using System.Web.Mvc;
using LearningPlatform.ErrorHandling;

namespace LearningPlatform
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new GlobalHandleErrorAttribute());
        }
    }
}