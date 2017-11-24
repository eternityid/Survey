using log4net;
using System;
using System.Web.Mvc;
using System.Web.Routing;

namespace LearningPlatform.ErrorHandling
{
    public class GlobalHandleErrorAttribute : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext exceptionContext)
        {
            Exception exception = exceptionContext.Exception;
            var logger = LogManager.GetLogger("ErrorHandler");
            logger.Error("", exception);
            string actionName = exceptionContext.RouteData.Values["action"].ToString();
            if (actionName == "PreviewLookAndFeelByPage")
            {
                exceptionContext.ExceptionHandled = true;
                exceptionContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                {
                    action = "ErrorPage",
                    controller = "Error"
                }));
                return;
            }

            base.OnException(exceptionContext);
        }
    }
}