using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.Security;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;

namespace LearningPlatform.Domain.SurveyExecution
{
    public class PageFactory
    {
        private readonly IRequestContext _requestContext;
        private readonly IQuestionFactory _questionFactory;
        private readonly ProgressService _progressService;
        private readonly IResourceManager _resourceManager;
        private readonly MapperService _mapper;

        public PageFactory(IRequestContext requestContext, IQuestionFactory questionFactory, ProgressService progressService, IResourceManager resourceManager, MapperService mapper)
        {
            _requestContext = requestContext;
            _questionFactory = questionFactory;
            _progressService = progressService;
            _resourceManager = resourceManager;
            _mapper = mapper;
        }

        public Page CreateIncomingPage(ProtectedVariables protectedVariables, NameValueCollection form)
        {
            if (protectedVariables.PageId==null) return null;

            if (protectedVariables.GotoStack != null)
            {
                _requestContext.State.GotoStack = GoToFolderStack.Create(protectedVariables.GotoStack);
            }
            if (protectedVariables.SkipStack != null)
            {
                _requestContext.State.SkipStack = SkipStack.Create(protectedVariables.SkipStack);
            }

            if (protectedVariables.LoopStack != null)
            {
                _requestContext.State.LoopState = LoopState.Create(protectedVariables.LoopStack);
            }
            PageDefinition pageDefinition = GetPageDefinition(protectedVariables.PageId);
            return new Page(_questionFactory.CreateQuestionsForPage(pageDefinition, form))
            {
                // The page uses the context to access PageId and RespondentId
                Context = VariablesProtector.Protect(protectedVariables),
                OrderType = pageDefinition.OrderType,
                Seed = pageDefinition.Seed
            };
        }

        public Page CreateOutgoingPage(PageDefinition pageDefinition, Direction direction, IList<Question> questions, NavigationButtons navigationButtons)
        {
            Respondent respondent = _requestContext.Respondent;
            var gotoStack = _requestContext.State.GotoStack.ToString();
            var skipStack = _requestContext.State.SkipStack.ToString();
            var loopStack = _requestContext.State.LoopState.ToString();
            return new Page(questions)
            {
                Title = _mapper.Map<EvaluationString>(pageDefinition.Title),
                Description = _mapper.Map<EvaluationString>(pageDefinition.Description),
                Context = VariablesProtector.Protect(new ProtectedVariables
                {
                    PageId = pageDefinition.Id,
                    RespondentId = respondent.Id,
                    Ticks = DateTime.UtcNow.Ticks,
                    Credential =  respondent.Credential,
                    GotoStack = gotoStack,
                    SkipStack = skipStack,
                    LoopStack = loopStack
                }),
                NavigationButtons = navigationButtons,
                PreviousButtonText = GetButtonText(_requestContext.Survey.SurveySettings.PreviousButtonText, "PreviousButton"),
                NextButtonText = GetButtonText(_requestContext.Survey.SurveySettings.NextButtonText, "NextButton"),
                FinishButtonText = GetButtonText(_requestContext.Survey.SurveySettings.FinishButtonText, "FinishButton"),
                OrderType = pageDefinition.OrderType,
                Seed = pageDefinition.Seed,
                KeyboardSupport = _requestContext.Survey.SurveySettings.KeyboardSupport,
                DisplayProgressBar = _requestContext.Survey.SurveySettings.DisplayProgressBar,
                DisplayOneQuestionOnScreen = _requestContext.Survey.SurveySettings.DisplayOneQuestionOnScreen,
                Progress = _progressService.GetProgress(pageDefinition.Id)
            };
        }

        private EvaluationString GetButtonText(LanguageString surveyOverridenButtonText, string buttonResourceId)
        {
            if (surveyOverridenButtonText != null)
            {
                return _mapper.Map<EvaluationString>(surveyOverridenButtonText);
            }
            return _resourceManager.GetEvalutationString(buttonResourceId);
        }

        public Page CreateOutgoingPageWithErrors(Page incomingPage, IList<Question> questions, NavigationButtons navigationButtons)
        {
            var pageDefinition = GetPageDefinition(incomingPage.GetPageId());
            Page page = CreateOutgoingPage(pageDefinition, Direction.Forward, questions, navigationButtons);

            var errors = new Dictionary<string, IList<QuestionError>>();
            foreach (Question q in incomingPage.Questions)
            {
                errors[q.Alias] = q.Errors;
            }
            foreach (Question q in page.Questions)
            {
                q.Errors = errors[q.Alias];
            }
            page.Errors = incomingPage.Errors;
            return page;
        }

        private PageDefinition GetPageDefinition(string pageId)
        {
            return _requestContext.NodeService.GetPageDefinition(pageId);
        }
    }
}