using System.Collections.Generic;

namespace LearningPlatform.Application.Libraries.Dtos
{
    public class SearchLibraryPageResultDto
    {
        public int TotalPages { get; set; }
        public List<LibraryPageDetailsDto> Pages { get; set; }
    }
}