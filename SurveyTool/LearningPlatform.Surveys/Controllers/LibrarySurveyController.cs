using LearningPlatform.Application.SurveyExecution;
using LearningPlatform.Application.SurveyExecution.Models;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyThemes;
using System.Linq;
using System.Web.Mvc;

namespace LearningPlatform.Controllers
{
	public class LibrarySurveyController : BaseController
	{
		private readonly LibrarySurveyAppService _librarySurveyAppService;
		private readonly IRequestContext _requestContext;

		public LibrarySurveyController(IRequestContext requestContext,
			LibrarySurveyAppService librarySurveyAppService)
		{
			_requestContext = requestContext;
			_librarySurveyAppService = librarySurveyAppService;
		}

		public ActionResult Index(string libraryId, string surveyId)
		{
			var page = _librarySurveyAppService.BeginSurvey(libraryId, surveyId);
			var layoutAndTheme = _librarySurveyAppService.GetLayoutAndThemeByPageId(page.GetPageId());

			SetTemplatesOnViewBag(layoutAndTheme, page);

			return DeviceDetection.IsMobile ?
				View("~/Views/Survey/Mobile/Index.cshtml", page) :
				View("~/Views/Survey/Desktop/Index.cshtml", page);
		}

		[HttpPost]
		[SubmitValue("Forward")]
		public ActionResult Forward(string libraryId, string surveyId)
		{
			var page = _librarySurveyAppService.Navigate(libraryId, surveyId, Direction.Forward, Request.Unvalidated.Form);
			var layoutAndTheme = _librarySurveyAppService.GetLayoutAndThemeByPageId(page.GetPageId());

			SetTemplatesOnViewBag(layoutAndTheme, page);

			return DeviceDetection.IsMobile ?
				View("~/Views/Survey/Mobile/Index.cshtml", page) :
				View("~/Views/Survey/Desktop/Index.cshtml", page);
		}

		[HttpPost]
		[SubmitValue("Back")]
		public ActionResult Back(string libraryId, string surveyId)
		{
			var page = _librarySurveyAppService.Navigate(libraryId, surveyId, Direction.Back, Request.Unvalidated.Form);
			var layoutAndTheme = _librarySurveyAppService.GetLayoutAndThemeByPageId(page.GetPageId());

			SetTemplatesOnViewBag(layoutAndTheme, page);

			return DeviceDetection.IsMobile ?
				View("~/Views/Survey/Mobile/Index.cshtml", page) :
				View("~/Views/Survey/Desktop/Index.cshtml", page);
		}

		private void SetTemplatesOnViewBag(LayoutAndThemeModel layoutAndTheme, Page incomingPage)
		{
			ViewBag.Layout = layoutAndTheme.Layout;
			ViewBag.Theme = layoutAndTheme.Theme;
			ViewBag.Survey = _requestContext.Survey;
			ViewBag.SurveyCreatorUrl = System.Configuration.ConfigurationManager.AppSettings["SurveyCreatorUrl"];
			ViewBag.SurveyUrl = System.Configuration.ConfigurationManager.AppSettings["SurveyUrl"];
			ViewBag.ApiUrl = System.Configuration.ConfigurationManager.AppSettings["ApiUrl"];
			ViewBag.ThemeAdvance = new ThemeAdvance(
				layoutAndTheme.Theme,
				layoutAndTheme.OverrideTheme, ViewBag.ApiUrl,
				ViewBag.TemporaryPictures);
			ViewBag.QuestionPercent = CanculateQuestionPercent(incomingPage);
		}

		private float CanculateQuestionPercent(Page incomingPage)
		{
			if (!incomingPage.Questions.Any()) return 0;

			var pageCost = _requestContext.NodeService.ProgressState.GetCost(incomingPage.GetPageId());
			var surveyCost = _requestContext.NodeService.ProgressState.SurveyCost;
			var totalQuestionsInPage = incomingPage.Questions.Count;

			return 100 * pageCost / surveyCost / totalQuestionsInPage;
		}
	}
}