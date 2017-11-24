using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public interface INodeServiceCache
    {
        INodeService Get(Survey survey);
    }
}