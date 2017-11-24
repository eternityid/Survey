using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public interface IResponseRowFactory
    {
        ICollection<ResponseRow> CreateResponseRows(string surveyId, long respondentId, LoopState loopState, IEnumerable<Question> questions);
    }
}