using System;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class PageExecutor : IPageExecutor
    {
        private readonly IRequestContext _requestContext;
        private readonly INodeExecutor _nodeExecutor;
        private readonly IQuestionService _questionService;

        public PageExecutor(IRequestContext requestContext, INodeExecutor nodeExecutor, IQuestionService questionService)
        {
            _requestContext = requestContext;
            _nodeExecutor = nodeExecutor;
            _questionService = questionService;
        }


        public PageDefinition GotoFirstPage()
        {
            return ScanForPageDefinition(CreateFolderCursor(_requestContext.NodeService.TopFolder, Direction.FirstPage));
        }

        public PageDefinition GotoLastPage()
        {
            return ScanForPageDefinition(CreateFolderCursor(_requestContext.NodeService.TopFolder, Direction.LastPage));
        }

        public PageDefinition MoveToNextPage(string pageId)
        {
            return MoveToNextPage(pageId, doNotSkipPage:false);
        }

        public PageDefinition MoveToNextPage(string pageId, bool doNotSkipPage)
        {
            PageDefinition page = _requestContext.NodeService.GetPageDefinition(pageId);
            Folder parentFolder = _requestContext.NodeService.GetParentFolder(page);
            return ScanForPageDefinition(CreateFolderCursor(parentFolder, Direction.Forward, page, doNotSkipPage));
        }

        public PageDefinition MoveToPreviousPage(string pageId)
        {
            PageDefinition page = _requestContext.NodeService.GetPageDefinition(pageId);
            Folder parentFolder = _requestContext.NodeService.GetParentFolder(page);
            return ScanForPageDefinition(CreateFolderCursor(parentFolder, Direction.Back, page));
        }

        public PageDefinition PeekPrevious(string pageId)
        {
            using (new StateRestorer(_requestContext.State)) 
            {
                return MoveToPreviousPage(pageId);
            }
        }

        public PageDefinition PeekNext(string pageId)
        {
            using (new StateRestorer(_requestContext.State))
            {
                return MoveToNextPage(pageId, doNotSkipPage:true);
            }
        }

        public ICollection<string> GetQuestionsBetweenPages(string fromPageId, string toPageId)
        {
            INodeService nodeService = _requestContext.NodeService;
            PageDefinition destinationPage = nodeService.GetPageDefinition(toPageId);

            var questionAliases = new List<string>();


            PageDefinition page = nodeService.GetPageDefinition(fromPageId);

            while(!HasReachedDestinationPage(page, destinationPage))
            {
                Folder parentFolder = nodeService.GetParentFolder(page);

                var nodeCursor = CreateFolderCursor(parentFolder, Direction.Forward, page);
                page = ScanForPageDefinition(nodeCursor);
                if (!HasReachedDestinationPage(page, destinationPage))
                {
                    questionAliases.AddRange(page.QuestionAliases);
                }
            }
            return questionAliases;
        }

        private static bool HasReachedDestinationPage(PageDefinition page, PageDefinition destinationPage)
        {
            return page==null || page==destinationPage;
        }

        private NodeCursor CreateFolderCursor(Folder folder, Direction direction, PageDefinition page=null, bool doNotSkipPage=false)
        {
            var index = GetIndexForPagePosition(folder, direction, page);
            _requestContext.Direction = direction;
            return new NodeCursor(folder, index, _requestContext) {DoNotSkipPage = doNotSkipPage};
        }

        private int GetIndexForPagePosition(Folder folder, Direction direction, PageDefinition page)
        {
            if (direction == Direction.FirstPage) return 0;
            var orderedChildren = _requestContext.State.GetOrderedChildrenForFolder(folder, _requestContext.Respondent.Id);
            if (direction == Direction.LastPage) return orderedChildren.Count - 1;
            if (direction == Direction.Forward) return orderedChildren.IndexOf(page) + 1;
            if (direction == Direction.Back) return orderedChildren.IndexOf(page) - 1;
            throw new ArgumentOutOfRangeException("direction");
        }

        private PageDefinition ScanForPageDefinition(NodeCursor cursor)
        {
            while (true)
            {
                PageDefinition pageDefinition = ScanForPageDefinitionOnCurrentLevel(cursor);
                if (pageDefinition!=null) return pageDefinition;

                if (_requestContext.State.GotoStack.Items.Count > 0)
                {
                    cursor.ReturnFromGotoFolder();
                }
                else
                {
                    cursor.MoveUp();
                    if (cursor.ParentFolder == null) return null;
                }
            }
        }

        private PageDefinition ScanForPageDefinitionOnCurrentLevel(NodeCursor cursor)
        {
            while (true)
            {
                Node childNode = cursor.CurrentNode;
                if (childNode == null) return null;
                _nodeExecutor.Execute(childNode, cursor);
                var pageDefinition = childNode as PageDefinition;
                if (pageDefinition != null)
                {
                    bool allQuestionsInHidden = _questionService.GetQuestionsWithAnswers(pageDefinition.QuestionAliases).All(p=>p.Hidden);
                    if (!allQuestionsInHidden || cursor.DoNotSkipPage)
                    {
                        _requestContext.State.PageId = pageDefinition.Id;
                        return pageDefinition;
                    }
                    cursor.Move();
                }
            }
        }
    }
}