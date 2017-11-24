using System.Web.Mvc;
using System.Web.Routing;

namespace LearningPlatform
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapMvcAttributeRoutes();
            routes.MapRoute("Preview", "survey/{surveyId}/preview/language/{language}", new { controller = "Survey", action = "Preview" });
            routes.MapRoute("PreviewLookAndFeel", "survey/{surveyId}/preview-look-and-feel/language/{language}", new { controller = "Survey", action = "PreviewLookAndFeel" });
            routes.MapRoute("PreviewLookAndFeelByPage", "survey/{surveyId}/preview-look-and-feel-by-page/language/{language}", new { controller = "Survey", action = "PreviewLookAndFeelByPage" });
            routes.MapRoute("Survey", "survey/{surveyId}", new {controller = "Survey", action = "Index"});
            routes.MapRoute("UpsertIncommingPageAnswers", "survey/{surveyId}/incomming-page/answers", new { controller = "Survey", action = "UpsertIncommingPageAnswers" });
            routes.MapRoute("PeekNextPage", "survey/{surveyId}/peek-next-page", new { controller = "Survey", action = "PeekNextPage" });
            routes.MapRoute("PeekPreviousPage", "survey/{surveyId}/peek-previous-page", new { controller = "Survey", action = "PeekPreviousPage" });

            routes.MapRoute("LibrarySurvey", "library/{libraryId}/survey/{surveyId}", new { controller = "LibrarySurvey", action = "Index" });
            routes.MapRoute("LibraryPage", "library/{libraryId}/page/{pageId}", new { controller = "LibraryPage", action = "Index" });
            routes.MapRoute("LibraryQuestion", "library/{libraryId}/question/{questionId}", new { controller = "LibraryQuestion", action = "Index" });

            routes.MapRoute("TestSurvey", "survey/test/{surveyId}", new { controller = "Survey", action = "Index" });
            routes.MapRoute("Default", "{controller}/{action}/{id}",
                new {controller = "Home", action = "Index", id = UrlParameter.Optional});
        }
    }
}