using System.Collections.Generic;

namespace LearningPlatform.Application.Libraries.Dtos
{
    public class SearchLibrarySurveyResultDto
    {
        public int TotalSurveys { get; set; }
        public List<LibrarySurveyDetailsDto> Surveys { get; set; }
    }
}