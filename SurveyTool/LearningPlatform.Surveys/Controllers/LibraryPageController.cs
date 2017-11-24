using LearningPlatform.Domain.SurveyDesign.Libraries;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyThemes;
using System.Web.Mvc;

namespace LearningPlatform.Controllers
{
    public class LibraryPageController : BaseController
	{
        private readonly LibraryPreviewerService _libraryPreviewerService;
        private readonly LibraryPageService _libraryPageService;

        public LibraryPageController(LibraryPageService libraryPageService,
            LibraryPreviewerService libraryPreviewerService)
        {
            _libraryPageService = libraryPageService;
            _libraryPreviewerService = libraryPreviewerService;
        }

        public ActionResult Index(string libraryId, string pageId)
        {
            var defaultLayoutThemeAndEmptySurvey = _libraryPreviewerService.GetLayoutThemeAndEmptySurvey(displayPageTitleAndDescription: true);
            _libraryPreviewerService.SetRequestContext(defaultLayoutThemeAndEmptySurvey);

            var page = _libraryPageService.GetLibraryPage(libraryId, pageId);
            if (page == null) return View("~/Views/Error/Index.cshtml");

            SetTemplatesOnViewBag(defaultLayoutThemeAndEmptySurvey);

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
            ViewBag.Preview = true;
            ViewBag.ThemeAdvance = new ThemeAdvance(
                defaultLayoutThemeAndSurvey.Theme,
                null, ViewBag.ApiUrl,
                ViewBag.TemporaryPictures);
        }
    }
}