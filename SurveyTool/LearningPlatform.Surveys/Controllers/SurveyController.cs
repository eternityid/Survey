using Autofac;
using LearningPlatform.Application.SurveyExecution;
using LearningPlatform.Application.SurveyExecution.Models;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyThemes;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace LearningPlatform.Controllers
{
	public class SurveyController : BaseController
	{
		private readonly SurveyAppService _surveyAppService;
		// PagePreviewAppService requires Data.EntityFramework access. Consider to move the preview to separate web application.
		private readonly PagePreviewAppService _pagePreviewAppService;
		private readonly IComponentContext _componentContext;
		private readonly IRequestContext _requestContext;
		private readonly LookAndFeelAppService _lookAndFeelAppService;

		public SurveyController(SurveyAppService surveyAppService,
			IRequestContext requestContext,
			PagePreviewAppService pagePreviewAppService,
			IComponentContext componentContext,
			LookAndFeelAppService lookAndFeelAppService)
		{
			_surveyAppService = surveyAppService;
			_requestContext = requestContext;
			_pagePreviewAppService = pagePreviewAppService;
			_componentContext = componentContext;
			_lookAndFeelAppService = lookAndFeelAppService;
		}

		public ActionResult Index(string surveyId)
		{
			var securityString = Request["s"];
			var isTesting = GetIsTesting();
			var page = _surveyAppService.BeginSurvey(surveyId, isTesting, Request["pageId"], securityString, DeviceDetection);

			var layoutAndTheme = GetLayoutAndThemeByPageIdFixed(page.GetPageId());

			SetTemplatesOnViewBag(layoutAndTheme, page);
			AttachPageMetadataToResponseHeader(page);

			return DeviceDetection.IsMobile ?
				View("Mobile/Index", page) :
				View("Desktop/Index", page);
		}

		[HttpPost]
		[SubmitValue("Forward")]
		public ActionResult Forward(string surveyId)
		{
			var page = _surveyAppService.Navigate(surveyId, GetIsTesting(), Direction.Forward, Request.Unvalidated.Form);
			var layoutAndTheme = GetLayoutAndThemeByPageIdFixed(page.GetPageId());

			SetTemplatesOnViewBag(layoutAndTheme, page);
			AttachPageMetadataToResponseHeader(page);

			return DeviceDetection.IsMobile ?
				View("Mobile/Index", page) :
				View("Desktop/Index", page);
		}

		[HttpPost]
		[SubmitValue("Back")]
		public ActionResult Back(string surveyId)
		{
			var page = _surveyAppService.Navigate(surveyId, GetIsTesting(), Direction.Back, Request.Unvalidated.Form);
			var layoutAndTheme = GetLayoutAndThemeByPageIdFixed(page.GetPageId());

			SetTemplatesOnViewBag(layoutAndTheme, page);
			AttachPageMetadataToResponseHeader(page);

			return DeviceDetection.IsMobile ?
				View("Mobile/Index", page) :
				View("Desktop/Index", page);
		}

		[HttpPost]
		public ActionResult PeekNextPage(string surveyId)
		{
			var page = _surveyAppService.PeekPage(surveyId, GetIsTesting(), Request.Unvalidated.Form, Direction.Forward);
			var layoutAndTheme = GetLayoutAndThemeByPageIdFixed(page.GetPageId());
			SetTemplatesOnViewBag(layoutAndTheme, page);
			AttachPageMetadataToResponseHeader(page);
			return DeviceDetection.IsMobile ?
				View("Mobile/Index", page) :
				View("Desktop/Index", page);
		}

		[HttpPost]
		public ActionResult PeekPreviousPage(string surveyId)
		{
			var page = _surveyAppService.PeekPage(surveyId, GetIsTesting(), Request.Unvalidated.Form, Direction.Back);
			var layoutAndTheme = GetLayoutAndThemeByPageIdFixed(page.GetPageId());
			SetTemplatesOnViewBag(layoutAndTheme, page);
			AttachPageMetadataToResponseHeader(page);
			return DeviceDetection.IsMobile ?
				View("Mobile/Index", page) :
				View("Desktop/Index", page);
		}

		[HttpPut]
		public ActionResult UpsertIncommingPageAnswers(string surveyId)
		{
			var pageErrors = _surveyAppService.UpsertIncommingPageAnswers(surveyId, GetIsTesting(), Request.Unvalidated.Form);
			var serializedErrors = JsonConvert.SerializeObject(pageErrors, Formatting.Indented, new JsonSerializerSettings
			{
				ContractResolver = new CamelCasePropertyNamesContractResolver()
			});
			return Content(serializedErrors, contentType: "application/json");
		}

		[HttpPost]
		public ActionResult Preview(string surveyId, string language)
		{
			var pagePreviewBindingModel = ReadFromStream<PagePreviewBindingModel>(Request.InputStream);
			var page = _pagePreviewAppService.Preview(surveyId, pagePreviewBindingModel.Page, language);
			var layoutAndThemeModel = _lookAndFeelAppService.MergeLayoutAndTheme(pagePreviewBindingModel.Page, _requestContext.SurveyAndLayout);

			ViewBag.Preview = true;
			ViewBag.TemporaryPictures = pagePreviewBindingModel.TemporaryPictures;

			SetTemplatesOnViewBag(layoutAndThemeModel, page);
			AttachPageMetadataToResponseHeader(page);

			return DeviceDetection.IsMobile ?
				View("Mobile/Index", page) :
				View("Desktop/Index", page);
		}


		[HttpPost]
		public ActionResult PreviewLookAndFeel(string surveyId, string language)
		{
			var lookAndFeelBindingModel = ReadFromStream<LookAndFeelBindingModel>(Request.InputStream);
			var page = _pagePreviewAppService.PreviewLookAndFeel(lookAndFeelBindingModel, language);

			ViewBag.TemporaryPictures = lookAndFeelBindingModel.TemporaryPictures;
			ViewBag.Preview = true;
			ViewBag.PreviewLookAndFeel = true;

			SetTemplatesOnViewBag(new LayoutAndThemeModel
			{
				Layout = _requestContext.SurveyLayout,
				Theme = _requestContext.SurveyTheme
			}, page);

			return DeviceDetection.IsMobile ?
				View("Mobile/Index", page) :
				View("Desktop/Index", page);
		}

		[HttpPost]
		public ActionResult PreviewLookAndFeelByPage(string surveyId, string pageId, string language)
		{
			var lookAndFeelByPageBindingModel = ReadFromStream<LookAndFeelByPageBindingModel>(Request.InputStream);

			var page = _surveyAppService.BeginOpenSurvey(surveyId, true, pageId);
			page.DisplayProgressBar = false;
			page.KeyboardSupport = false;
			page.NavigationButtons = NavigationButtons.None;
			page.OrderType = lookAndFeelByPageBindingModel.OrderType;
			page.DisplayOneQuestionOnScreen = false;

			ViewBag.TemporaryPictures = lookAndFeelByPageBindingModel.TemporaryPictures;
			ViewBag.Preview = true;
			ViewBag.PreviewLookAndFeel = true;

			var layoutAndTheme = _lookAndFeelAppService.MergeLayoutAndTheme(lookAndFeelByPageBindingModel);
			SetTemplatesOnViewBag(layoutAndTheme, page);

			return DeviceDetection.IsMobile ?
				View("Mobile/Index", page) :
				View("Desktop/Index", page);
		}

		private T ReadFromStream<T>(Stream stream)
		{
			using (stream)
			{
				stream.Seek(0, SeekOrigin.Begin);
				var json = new StreamReader(stream).ReadToEnd();
				return JsonConvert.DeserializeObject<T>(json, JsonSerializerSettingsFactory.Create(_componentContext));
			}
		}

		private bool GetIsTesting()
		{
			return Request.Url != null && Request.Url.AbsolutePath.Contains("/survey/test/");
		}

		private void SetTemplatesOnViewBag(LayoutAndThemeModel layoutAndTheme, Page incomingPage)
		{
			ViewBag.Layout = layoutAndTheme.Layout;
			ViewBag.Theme = layoutAndTheme.Theme;
			ViewBag.Survey = _requestContext.Survey;
			ViewBag.SurveyCreatorUrl = System.Configuration.ConfigurationManager.AppSettings["SurveyCreatorUrl"];
			ViewBag.SurveyUrl = System.Configuration.ConfigurationManager.AppSettings["SurveyUrl"];
			ViewBag.ApiUrl = System.Configuration.ConfigurationManager.AppSettings["ApiUrl"];
			ViewBag.ThemeAdvance = new ThemeAdvance(layoutAndTheme.Theme, layoutAndTheme.OverrideTheme, ViewBag.ApiUrl,
				ViewBag.TemporaryPictures);
			ViewBag.QuestionPercent = CalculateQuestionPercent(incomingPage);            
        }

		private float CalculateQuestionPercent(Page incomingPage)
		{
			var incomingPageId = incomingPage.GetPageId();
			if (incomingPageId == null || !incomingPage.Questions.Any()) return 0;

			var pageCost = _requestContext.NodeService.ProgressState.GetCost(incomingPageId);
			var surveyCost = _requestContext.NodeService.ProgressState.SurveyCost;
			var totalQuestionsInPage = incomingPage.Questions.Count;

			return 100 * pageCost / surveyCost / totalQuestionsInPage;
		}

		private LayoutAndThemeModel GetLayoutAndThemeByPageIdFixed(string pageId)
		{
			if (pageId == null)
			{
				return new LayoutAndThemeModel
				{
					Layout = _requestContext.SurveyLayout,
					Theme = _requestContext.SurveyTheme
				};
			}

			var pageDefinition = _requestContext.NodeService.GetPageDefinition(pageId);
			return _lookAndFeelAppService.MergeLayoutAndTheme(pageDefinition, _requestContext.SurveyAndLayout);
		}

		private void AttachPageMetadataToResponseHeader(Page page)
		{
			HttpContext.Response.AppendHeader("X-Survey-Page-Id", page.GetPageId());
			HttpContext.Response.AppendHeader("X-Survey-Page-IsDynamic", page.IsDynamicPage.ToString());
			HttpContext.Response.AppendHeader("X-Survey-Page-HasSkipActions", page.HasSkipActions.ToString());
		}
	}
}