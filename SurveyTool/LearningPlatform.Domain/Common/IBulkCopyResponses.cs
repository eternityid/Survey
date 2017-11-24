using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Common
{
    public interface IBulkCopyResponses
    {
        void AddBulkResponses(IList<Respondent> respondents, IList<ResponseRow> responseRows, string surveyId, bool isTesting);
    }
}