using System;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyExecution.Request;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{

    public class NodeCursor
    {
        private readonly IRequestContext _requestContext;

        private Folder _parentFolder;
        private int _index;

        public NodeCursor(Folder parentFolder, int index, IRequestContext requestContext)
        {
            _parentFolder = parentFolder;
            _index = index;
            _requestContext = requestContext;
        }

        public Node CurrentNode
        {
            get
            {
                if (!HasMore) return null;

                return ChildrenOfParentFolder[_index];
            }
        }

        private bool HasMore
        {
            get
            {
                return _requestContext.IsForward ? !HasPassedEnd : !HasPassedBeginning;
            }
        }

        public void PushGotoReturnState()
        {
            int index = _index + Increment;
            var nodeId = index == -1 ? null: ParentFolder.ChildNodes[index].Id;
            _requestContext.State.GotoStack.Items.Push(nodeId);
        }

        public void ReturnFromGotoFolder()
        {
            var nodeId = _requestContext.State.GotoStack.Items.Pop();
            var nodeService = _requestContext.NodeService;
            if (nodeId == null)
            {
                _parentFolder = nodeService.TopFolder;
                _index = -1;
            }
            else
            {
                Node node = nodeService.GetNode(nodeId);
                Folder parentFolder = nodeService.GetParentFolder(node);
                _parentFolder = parentFolder;
                _index = parentFolder.ChildNodes.IndexOf(node);                
            }           
        }

        public void Move()
        {
            _index += Increment;
        }

        public void MoveToFolder(Folder folder)
        {
            if (folder == null) throw new ArgumentNullException("folder");
            
            _parentFolder = folder;
            _index = _requestContext.IsForward ? 0 : Count - 1;
        }

        public void MoveUp()
        {
            var parentOfParentFolder = GetParentOfParentFolder();
            if (parentOfParentFolder is Condition)
            {
                _parentFolder = parentOfParentFolder;
                parentOfParentFolder = GetParentOfParentFolder();
            }
            if (parentOfParentFolder == null)
            {
                _parentFolder = null;
                return;
            }
            Folder previousParentFolder = ParentFolder;
            _parentFolder = parentOfParentFolder;
            if (previousParentFolder.Loop!=null)
            {
                _index = ChildrenOfParentFolder.IndexOf(previousParentFolder);
                return;
            }
            _index = ChildrenOfParentFolder.IndexOf(previousParentFolder) + Increment;
        }

        private Folder GetParentOfParentFolder()
        {
            return _requestContext.NodeService.GetParentFolder(ParentFolder);
        }

        private OrderedList<Node> ChildrenOfParentFolder
        {
            get { return _requestContext.State.GetOrderedChildrenForFolder(ParentFolder, _requestContext.Respondent.Id); }
        }

        private int Count
        {
            get { return ChildrenOfParentFolder.Count; }
        }

        private bool HasPassedBeginning
        {
            get { return _index < 0; }
        }

        private bool HasPassedEnd
        {
            get { return Count <= _index; }
        }

        public int Increment
        {
            get
            {
                if (_requestContext.IsForward) return 1;
                return -1;
            }
        }

        public Folder ParentFolder
        {
            get { return _parentFolder; }
        }

        public Direction Direction
        {
            get { return _requestContext.Direction; }
        }

        public bool DoNotSkipPage { get; set; }
    }
}