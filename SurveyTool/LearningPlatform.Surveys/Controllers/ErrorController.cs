using log4net;
using System;
using System.Web.Http;
using System.Web.Mvc;

namespace LearningPlatform.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult Index([FromUri]string message)
        {
            try
            {
                var logger = LogManager.GetLogger("ErrorHandler");
                logger.Error(message);
            }
            catch(Exception)
            {
                // If logging fails, still display the error page for the user.
            }

            return View();
        }

        public ActionResult ErrorPage()
        {
            return View();
        }
    }
}