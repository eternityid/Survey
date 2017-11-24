using System.Web.Http.ExceptionHandling;
using log4net;
using Microsoft.ApplicationInsights;

namespace LearningPlatform.ErrorHandling
{
    public class GlobalErrorLogger : ExceptionLogger
    {
        public override void Log(ExceptionLoggerContext context)
        {
            var exception = context.Exception;
            ILog logger = LogManager.GetLogger(typeof(GlobalErrorLogger));
            logger.Error("", exception);
        }
    }
}