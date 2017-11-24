using System.Collections.Generic;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class SurveyListDto
    {
        public IList<SurveyListItemDto> Surveys { get; set; }
        public int TotalSurveys { get; set; }
    }
}