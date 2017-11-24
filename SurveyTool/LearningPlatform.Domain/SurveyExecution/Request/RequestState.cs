using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.Domain.SurveyExecution.Request
{
    public class RequestState
    {
        private readonly Dictionary<Folder, OrderedList<Node>> _orderedChildren;

        public RequestState()
        {
            _orderedChildren = new Dictionary<Folder, OrderedList<Node>>();

            Questions = new Dictionary<string, Question>();
            QuestionAliasesToClean = new List<string>();
            LoopState = new LoopState();
            GotoStack = new GoToFolderStack();
            SkipStack = new SkipStack();
        }

        public Dictionary<string, Question> Questions { get; private set; }
        public GoToFolderStack GotoStack { get; set; }
        public SkipStack SkipStack { get; set; }

        public LoopState LoopState { get; set; }
        public string RedirectUrl { get; set; }
        public string PageId { get; set; }
        public List<string> QuestionAliasesToClean { get; private set; }

        public OrderedList<Node> GetOrderedChildrenForFolder(Folder folderNode, long respondentId)
        {
            OrderedList<Node> result;
            if (_orderedChildren.TryGetValue(folderNode, out result))
            {
                return result;
            }

            var seed = (int) (respondentId + folderNode.Seed);
            result = new OrderedList<Node>(folderNode.OrderType,
                folderNode.ChildNodes.OrderBy(p => p.Position).ToList(), seed);
            _orderedChildren[folderNode] = result;
            return result;
        }
    }
}