using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.Security;
using LearningPlatform.Domain.SurveyExecution.Validators;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class PageService
    {
        private readonly PageFactory _pageFactory;
        private readonly IQuestionService _questionService;
        private readonly IPageValidator _validator;
        private readonly IRequestContext _requestContext;
        private readonly RespondentService _respondentService;
        private readonly NavigationButtonService _navigationButtonService;

        public PageService(PageFactory pageFactory,
            IQuestionService questionService,
            IPageValidator validator,
            IRequestContext requestContext,
            RespondentService respondentService,
            NavigationButtonService navigationButtonService)
        {
            _pageFactory = pageFactory;
            _questionService = questionService;
            _validator = validator;
            _requestContext = requestContext;
            _respondentService = respondentService;
            _navigationButtonService = navigationButtonService;
        }

        public void SaveQuestions(Page incomingPage)
        {
            _questionService.SaveQuestions(incomingPage.Questions);
        }

        public Page GetOutgoingPage(string id, Direction direction)
        {
            CleanQuestions();
            var pageDefinition = _requestContext.NodeService.GetPageDefinition(id);
            var questions = GetVisibleQuestionsWithAnswers(pageDefinition);
            var navigation = _navigationButtonService.GetNavigationButtons(pageDefinition, direction);
            var page = _pageFactory.CreateOutgoingPage(pageDefinition, direction, questions, navigation);
            OnResponseComplete(pageDefinition.ResponseStatus);
            return page;
        }

        public Page CreateIncomingPage(ProtectedVariables protectedVariables, NameValueCollection nameValueCollection)
        {
            return _pageFactory.CreateIncomingPage(protectedVariables, nameValueCollection);
        }

        public Page GetPageWithErrorsIfAny(Page incomingPage)
        {
            _validator.Validate(incomingPage);
            if (!incomingPage.Errors.Any()) return null;

            OnResponseComplete(null);
            var pageDefinition = _requestContext.NodeService.GetPageDefinition(incomingPage.GetPageId());
            var questions = GetVisibleQuestionsWithAnswers(pageDefinition);
            var navigation = _navigationButtonService.GetNavigationButtons(pageDefinition, Direction.SamePage);
            var page = _pageFactory.CreateOutgoingPageWithErrors(incomingPage, questions, navigation);
            return page;

        }

        public Page GetContinueWhereLeftOffPage(string firstPageId)
        {
            var respondent = _requestContext.Respondent;
            var respondentPageId = respondent.CurrentPageId;
            if (_requestContext.Survey.SurveySettings.ResumeRespondentWhereLeftOff && respondentPageId != null)
            {
                RestoreStates(respondent, _requestContext);
                var continuePageDefinition = _requestContext.NodeService.GetPageDefinition(respondentPageId);
                {
                    _requestContext.Direction = continuePageDefinition.Id != firstPageId ? Direction.Forward : Direction.FirstPage;
                    return GetOutgoingPage(continuePageDefinition.Id, _requestContext.Direction);
                }
            }
            return null;
        }

        private static void RestoreStates(Respondent respondent, IRequestContext requestContext)
        {
            var requestState = requestContext.State;
            if (!string.IsNullOrEmpty(respondent.CurrentGotoStack))
            {
                requestState.GotoStack = GoToFolderStack.Create(respondent.CurrentGotoStack);
            }
            if (!string.IsNullOrEmpty(respondent.CurrentLoopState))
            {
                requestState.LoopState = LoopState.Create(respondent.CurrentLoopState);
            }
            if (!string.IsNullOrEmpty(respondent.CurrentSkipStack))
            {
                requestState.SkipStack = SkipStack.Create(respondent.CurrentSkipStack);
            }
        }

        public NameValueCollection GetNameValueCollection(Page page)
        {
            var ret = new NameValueCollection { { "context", page.Context } };
            var expanded = _questionService.GetExpandedQuestions(page.Questions);
            foreach (var question in expanded)
            {
                var multipleSelectionQuestion = question as MultipleSelectionQuestion;
                if (multipleSelectionQuestion != null)
                {
                    foreach (var answer in multipleSelectionQuestion.Options)
                    {
                        ret.Add(multipleSelectionQuestion.GetFieldName(answer), multipleSelectionQuestion.IsChecked(answer) ? MultipleSelectionQuestion.CheckTrueValue : "false");
                    }
                }
                else
                {
                    ret.Add(question.Alias, question.Answer?.ToString() ?? string.Empty);
                }
            }
            return ret;
        }

        private IList<Question> GetVisibleQuestionsWithAnswers(PageDefinition pageDefinition)
        {
            List<string> questionIds = pageDefinition.QuestionDefinitions.Select(o => o.Alias).ToList();
            return _questionService.GetQuestionsWithAnswers(questionIds).Where(q => !q.Hidden).ToList();
        }

        private void CleanQuestions()
        {
            _questionService.CleanQuestions(_requestContext.State.QuestionAliasesToClean);
        }

        private void OnResponseComplete(string responseStatus)
        {
            _respondentService.UpdateRespondent(responseStatus);
            if (_requestContext.State.RedirectUrl != null && !_requestContext.IsResume)
            {
                HttpContext.Current.Response.Redirect(_requestContext.State.RedirectUrl);
                HttpContext.Current.Response.End();
            }
        }

    }
}