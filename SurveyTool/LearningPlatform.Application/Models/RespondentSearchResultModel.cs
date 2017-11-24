using System.Collections.Generic;
using LearningPlatform.Domain.Respondents;

namespace LearningPlatform.Application.Models
{
    public class RespondentSearchResultModel
    {
        public List<Respondent> Respondents { get; set; }
        public int TotalRespondentsFound { get; set; }
    }
}