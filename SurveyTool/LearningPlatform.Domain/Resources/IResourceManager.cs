using LearningPlatform.Domain.SurveyExecution;

namespace LearningPlatform.Domain.Resources
{
    public interface IResourceManager
    {
        string GetString(string name, params object[] args);
        EvaluationString GetEvalutationString(string name);
    }
}