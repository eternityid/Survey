using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public interface INodeExecutor
    {
        void Execute(Node node, NodeCursor cursor);
    }
}