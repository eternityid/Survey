using LearningPlatform.Domain.SurveyDesign.Libraries;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyThemes;
using System.Web.Mvc;

namespace LearningPlatform.Controllers
{
    public class LibraryQuestionController : BaseController
	{
        private readonly LibraryPageService _libraryPageService;
        private readonly LibraryPreviewerService _libraryPreviewerService;

        public LibraryQuestionController(
            LibraryPageService libraryPageService,
            LibraryPreviewerService libraryPreviewerService)
        {
            _libraryPageService = libraryPageService;
            _libraryPreviewerService = libraryPreviewerService;
        }

        public ActionResult Index(string libraryId, string questionId)
        {
            var defaultLayoutThemeAndEmptySurvey = _libraryPreviewerService.GetLayoutThemeAndEmptySurvey(displayPageTitleAndDescription: false);
            _libraryPreviewerService.SetRequestContext(defaultLayoutThemeAndEmptySurvey);

            var page = _libraryPageService.RenderPageByLibraryQuestionId(libraryId, questionId);
            if (page == null) return View("~/Views/Error/Index.cshtml");

            SetTemplatesOnViewBag(defaultLayoutThemeAndEmptySurvey);
            ViewBag.OnlyPreviewContent = true;

	        return DeviceDetection.IsMobile ?
		        View("~/Views/Survey/Mobile/Index.cshtml", page) :
		        View("~/Views/Survey/Desktop/Index.cshtml", page);
		}

        private void SetTemplatesOnViewBag(LayoutThemeAndSurveyModel defaultLayoutThemeAndSurvey)
        {
            ViewBag.Layout = defaultLayoutThemeAndSurvey.Layout;
            ViewBag.Theme = defaultLayoutThemeAndSurvey.Theme;
            ViewBag.Survey = defaultLayoutThemeAndSurvey.Survey;
            ViewBag.SurveyCreatorUrl = System.Configuration.ConfigurationManager.AppSettings["SurveyCreatorUrl"];
            ViewBag.SurveyUrl = System.Configuration.ConfigurationManager.AppSettings["SurveyUrl"];
            ViewBag.ApiUrl = System.Configuration.ConfigurationManager.AppSettings["ApiUrl"];
            ViewBag.ThemeAdvance = new ThemeAdvance(
                defaultLayoutThemeAndSurvey.Theme,
                null, ViewBag.ApiUrl,
                ViewBag.TemporaryPictures);
            ViewBag.Preview = true;
        }
    }
}