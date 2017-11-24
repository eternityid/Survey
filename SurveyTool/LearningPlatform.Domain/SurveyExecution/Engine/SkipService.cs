using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Scripting;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class SkipService
    {
        private readonly ExpressionQueryBuilder _expressionQueryBuilder;
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IRequestContext _requestContext;
        private readonly IPageExecutor _pageExecutor;
        private readonly PageService _pageService;

        public SkipService(ExpressionQueryBuilder expressionQueryBuilder, IScriptExecutor scriptExecutor, IRequestContext requestContext, IPageExecutor pageExecutor, PageService pageService)
        {
            _expressionQueryBuilder = expressionQueryBuilder;
            _scriptExecutor = scriptExecutor;
            _requestContext = requestContext;
            _pageExecutor = pageExecutor;
            _pageService = pageService;
        }

        public Page HandleSkippingGoingForward(string pageId)
        {
            INodeService nodeService = _requestContext.NodeService;
            var pageDefinition = nodeService.GetPageDefinition(pageId);

            foreach (var skipCommand in pageDefinition.SkipCommands)
            {
                var script = _expressionQueryBuilder.Build(skipCommand.Expression.GetItems());
                var shouldSkip = _scriptExecutor.EvaluateCode<bool>(script);
                if (shouldSkip)
                {
                    var pageDefinitionId = nodeService.GetPageIdContainQuestionId(skipCommand.SkipToQuestionId);
                    if (pageDefinitionId != null)
                    {
                        _requestContext.State
                            .QuestionAliasesToClean.AddRange(_pageExecutor.GetQuestionsBetweenPages(pageId, pageDefinitionId));
                        _requestContext.State.SkipStack.Items.Push(new SkipPoint {NodeId = pageDefinitionId, ReturnNodeId = pageId});
                        return _pageService.GetOutgoingPage(pageDefinitionId, _requestContext.Direction);
                    }
                }
            }

            return null;
        }

        public Page HandleSkippingGoingBack(string pageId)
        {
            Stack<SkipPoint> skipSurveyPoints = _requestContext.State.SkipStack.Items;
            if(skipSurveyPoints.Count>0)
            {
                var skipSurveyPoint = skipSurveyPoints.Peek();
                if (pageId == skipSurveyPoint.NodeId)
                {
                    skipSurveyPoints.Pop();
                    var pageDefinition = _requestContext.NodeService.GetPageDefinition(skipSurveyPoint.ReturnNodeId);
                    return _pageService.GetOutgoingPage(pageDefinition.Id, Direction.Back);
                }
            }
            return null;
        }
    }
}