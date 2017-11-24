using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Security;
using LearningPlatform.Domain.SurveyPublishing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{

    public class SurveyExecutor
    {
        private readonly RespondentService _respondentService;
        private readonly IPageExecutor _pageExecutor;
        private readonly SkipService _skipService;
        private readonly PageService _pageService;
        private readonly StandardPageFactory _standardPageFactory;
        private readonly IRequestContext _requestContext;
        private readonly ISurveyRepository _surveyRepository;
        private readonly LanguageService _languageService;
        private readonly SingleSignOnService _singleSignOnService;

        public SurveyExecutor(
            RespondentService respondentService,
            IPageExecutor pageExecutor,
            SkipService skipService,
            PageService pageService,
            StandardPageFactory standardPageFactory,
            IRequestContext requestContext,
            ISurveyRepository surveyRepository,
            LanguageService languageService,
            SingleSignOnService singleSignOnService)
        {
            _respondentService = respondentService;
            _pageExecutor = pageExecutor;
            _skipService = skipService;
            _pageService = pageService;
            _standardPageFactory = standardPageFactory;
            _requestContext = requestContext;
            _surveyRepository = surveyRepository;
            _languageService = languageService;
            _singleSignOnService = singleSignOnService;
        }

        public Page BeginOpenSurvey(SurveyAndLayout surveyAndLayout, string pageIdString = null)
        {
            var survey = _requestContext.Survey;
            var isTesting = _requestContext.IsTesting;
            if (survey.SurveySettings.InvitationOnlySurvey && !isTesting)
            {
                return _standardPageFactory.CreateInvitationOnlyPage();
            }
            if (survey.SurveySettings.SingleSignOnSurvey && !isTesting)
            {
                if (!HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    _singleSignOnService.Challenge();
                    return _standardPageFactory.CreateInvitationOnlyPage();
                }
                _requestContext.Respondent = _singleSignOnService.GetRespondent(survey, isTesting: false);
            }
            else
            {
                _requestContext.Respondent = _respondentService.CreateNewRespondent(survey.Id, isTesting, "");
            }
            _requestContext.Respondent.Language = _languageService.GetRespondentLanguage();

            if (pageIdString != null && isTesting) return GotoPage(pageIdString);
            return Forward(null);
        }

        public Page ResumeSurvey(SurveyAndLayout surveyAndLayout, string securityString, string pageIdString = null)
        {
            if (securityString == null) throw new ArgumentNullException(nameof(securityString));
            var protectedVariables = VariablesProtector.Unprotect(securityString, "external");

            var surveyId = surveyAndLayout.Survey.Id;
            var isTesting = surveyAndLayout.IsTesting;

            _requestContext.Respondent =
                _respondentService.GetExistingRespondent(surveyId, isTesting, protectedVariables);
            if (_requestContext.Respondent.CustomColumns != null)
            {
                _requestContext.CustomColumns =
                    JsonConvert.DeserializeObject<JObject>(_requestContext.Respondent.CustomColumns);
            }
            _requestContext.Respondent.Language = _languageService.GetRespondentLanguage();
            _requestContext.IsResume = true;

            if (pageIdString != null && isTesting) return GotoPage(pageIdString);
            return Forward(_pageService.CreateIncomingPage(protectedVariables, new NameValueCollection()));
        }

        public Page PeekPage(SurveyAndLayout surveyAndLayout, NameValueCollection nameValueCollection,
            Direction direction)
        {
            var protectedVariables = VariablesProtector.Unprotect(nameValueCollection["context"]);
            _requestContext.Respondent = _respondentService.GetExistingRespondent(surveyAndLayout.Survey.Id,
                surveyAndLayout.IsTesting,
                protectedVariables);
            _requestContext.Respondent.Language = _languageService.GetRespondentLanguage();

            var currentPageId = protectedVariables.PageId;
            if (direction == Direction.Forward)
            {
                var nextPageDefinition = _pageExecutor.MoveToNextPage(currentPageId);
                //TODO: Check for dynamic content in the pageDef
                return _pageService.GetOutgoingPage(nextPageDefinition.Id, _requestContext.Direction);
            }
            if (direction == Direction.Back)
            {
                var previousPageDefinition = _pageExecutor.MoveToPreviousPage(currentPageId);
                //TODO: Check for dynamic content in the pageDef
                if (previousPageDefinition == null) return _pageService.GetOutgoingPage(currentPageId, Direction.Back);
                return _pageService.GetOutgoingPage(previousPageDefinition.Id, Direction.Back);
            }
            throw new ArgumentException($"Direction '{direction}' not supported", nameof(direction));
        }

        public Page Navigate(SurveyAndLayout surveyAndLayout, Direction direction,
            NameValueCollection nameValueCollection)
        {
            var protectedVariables = VariablesProtector.Unprotect(nameValueCollection["context"]);
            _requestContext.Respondent = _respondentService.GetExistingRespondent(surveyAndLayout.Survey.Id,
                surveyAndLayout.IsTesting,
                protectedVariables);
            _requestContext.Respondent.Language = _languageService.GetRespondentLanguage();

            var incomingPage = _pageService.CreateIncomingPage(protectedVariables, nameValueCollection);
            if (direction == Direction.Forward || direction == Direction.FirstPage) return Forward(incomingPage);
            if (direction == Direction.Back) return Back(incomingPage);
            throw new NotImplementedException($"Direction {direction} not supported");
        }

        public IList<QuestionError> UpsertIncommingPageAnswers(SurveyAndLayout surveyAndLayout,
            NameValueCollection nameValueCollection)
        {
            var protectedVariables = VariablesProtector.Unprotect(nameValueCollection["context"]);
            _requestContext.Respondent = _respondentService.GetExistingRespondent(surveyAndLayout.Survey.Id,
                surveyAndLayout.IsTesting,
                protectedVariables);
            _requestContext.Respondent.Language = _languageService.GetRespondentLanguage();

            var incomingPage = _pageService.CreateIncomingPage(protectedVariables, nameValueCollection);
            _pageService.SaveQuestions(incomingPage);
            _pageService.GetPageWithErrorsIfAny(incomingPage);
            return incomingPage.Errors;
        }

        public Page ValidateSurvey(SurveyAndLayout surveyAndLayout)
        {
            var survey = _surveyRepository.GetById(surveyAndLayout.Survey.Id);
            if (survey == null) throw new InvalidOperationException("Survey not found");

            if (survey.IsDeleted && !surveyAndLayout.IsTesting) return _standardPageFactory.CreateDeletedSurveyPage();
            if (survey.Status != SurveyStatus.Open && !surveyAndLayout.IsTesting)
                return _standardPageFactory.CreateNotOpenSurveyPage();
            return null;
        }

        private Page Forward(Page incomingPage)
        {
            if (incomingPage == null)
            {
                var firstPage = _pageExecutor.GotoFirstPage();
                var continueWhereLeftOffPage = _pageService.GetContinueWhereLeftOffPage(firstPage.Id);
                return continueWhereLeftOffPage ?? _pageService.GetOutgoingPage(firstPage.Id, _requestContext.Direction);
            }

            if (!_requestContext.IsResume)
            {
                _pageService.SaveQuestions(incomingPage);
                var errorPage = _pageService.GetPageWithErrorsIfAny(incomingPage);
                if (errorPage != null) return errorPage;

                var skipToPage = _skipService.HandleSkippingGoingForward(incomingPage.GetPageId());
                if (skipToPage != null) return skipToPage;
            }
            var incomingPageDefinition = _pageExecutor.MoveToNextPage(incomingPage.GetPageId());
            return _pageService.GetOutgoingPage(incomingPageDefinition.Id, _requestContext.Direction);
        }

        private Page Back(Page incomingPage)
        {
            _pageService.SaveQuestions(incomingPage);
            var skipTo = _skipService.HandleSkippingGoingBack(incomingPage.GetPageId());
            if (skipTo != null) return skipTo;

            var pageDefinition = _pageExecutor.MoveToPreviousPage(incomingPage.GetPageId());
            return _pageService.GetOutgoingPage(pageDefinition == null
                ? incomingPage.GetPageId()
                : pageDefinition.Id, Direction.Back);
        }

        private Page GotoPage(string pageId)
        {
            var firstPage = _pageExecutor.GotoFirstPage();
            var direction = pageId != firstPage.Id ? Direction.Forward : Direction.FirstPage;
            try
            {
                return _pageService.GetOutgoingPage(pageId, direction);
            }
            catch (KeyNotFoundException)
            {
                return _pageService.GetOutgoingPage(firstPage.Id, Direction.FirstPage);
            }
        }

    }
}