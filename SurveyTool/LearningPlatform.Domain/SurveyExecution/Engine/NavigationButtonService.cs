using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyExecution.Request;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class NavigationButtonService
    {
        private readonly IRequestContext _requestContext;
        private readonly IPageExecutor _pageExecutor;

        public NavigationButtonService(IRequestContext requestContext, IPageExecutor pageExecutor)
        {
            _requestContext = requestContext;
            _pageExecutor = pageExecutor;
        }

        public NavigationButtons GetNavigationButtons(PageDefinition pageDefinition, Direction direction)
        {
            if (pageDefinition.NavigationButtonSettings == NavigationButtonSettings.None) return NavigationButtons.None;
            if (direction == Direction.FirstPage ||
                pageDefinition.NavigationButtonSettings == NavigationButtonSettings.ForwardOnly ||
                 !_requestContext.Survey.SurveySettings.EnableBackButton)
            {
                return GetButtonWhenForwardOnly(pageDefinition);
            }

            if (direction == Direction.Forward)
            {
                return GetButtonGoingForward(pageDefinition);
            }
            return GetButtonGoingBack(pageDefinition);
        }

        private NavigationButtons GetButtonWhenForwardOnly(PageDefinition pageDefinition)
        {
            var peekNext = _pageExecutor.PeekNext(pageDefinition.Id);
            if (peekNext != null)
            {
                if (pageDefinition.SkipCommands.Count == 0 && peekNext.NodeType == PageType.ThankYouPage.ToString())
                {
                    return NavigationButtons.Finish;
                }
                return NavigationButtons.Next;
            }
            return NavigationButtons.None;
        }

        private NavigationButtons GetButtonGoingForward(PageDefinition pageDefinition)
        {
            var peekNext = _pageExecutor.PeekNext(pageDefinition.Id);
            if (peekNext != null)
            {
                if (peekNext.NodeType == PageType.ThankYouPage.ToString())
                {
                    return NavigationButtons.PreviousAndFinish;
                }
                return NavigationButtons.PreviousAndNext;
            }
            return NavigationButtons.Previous;
        }


        private NavigationButtons GetButtonGoingBack(PageDefinition pageDefinition)
        {
            if (_pageExecutor.PeekPrevious(pageDefinition.Id) != null)
            {
                return NavigationButtons.PreviousAndNext;
            }
            return NavigationButtons.Next;
        }



    }
}