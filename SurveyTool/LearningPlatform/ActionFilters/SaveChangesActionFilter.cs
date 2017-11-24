using System.Web.Http.Filters;
using LearningPlatform.Data.EntityFramework.Repositories;
using ActionFilterAttribute = System.Web.Http.Filters.ActionFilterAttribute;

namespace LearningPlatform.ActionFilters
{
    public class SaveChangesActionFilter : ActionFilterAttribute
    {
        private readonly ContextService _contextService;
        public SaveChangesActionFilter(ContextService contextService)
        {
            _contextService = contextService;
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Exception == null && _contextService.HasChanges)
            {
                _contextService.SaveChanges();
            }
        }

    }
}