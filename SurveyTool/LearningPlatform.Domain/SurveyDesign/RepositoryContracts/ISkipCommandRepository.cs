using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using System.Collections.Generic;
namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface ISkipCommandRepository
    {
        void Delete(long id);
        void Delete(IEnumerable<SkipCommand> skips);
        void DeleteBySkipToQuestion(string questionId);
        SkipCommand Add(SkipCommand skipCommand);
        SkipCommand Update(SkipCommand skipCommand);
        SkipCommand GetById(long id);
        SkipCommand GetByExpression(long expressionId);
        IEnumerable<SkipCommand> GetBySurveyId(string surveyId);
        IEnumerable<SkipCommand> GetByExpressionIds(IEnumerable<long> expressionIds);
    }
}
