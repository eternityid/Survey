using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyExecution;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests
{
    public class EvaluationStringFactory
    {
        public static EvaluationString Create(string str, AutoMock autoMock)
        {
            var evaluationString = autoMock.Create<EvaluationString>();
            evaluationString.Value = str;
            return evaluationString;
        }
    }
}