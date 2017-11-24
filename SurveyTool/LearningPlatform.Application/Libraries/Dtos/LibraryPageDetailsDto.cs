using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using System;

namespace LearningPlatform.Application.Libraries.Dtos
{
    public class LibraryPageDetailsDto
    {
        public LibraryPageDetailsDto(PageDefinition page)
        {
            Id = page.Id;
            Title = page.Title.GetFirstItemText();
            Description = page.Description.GetFirstItemText();
            LibraryId = page.LibraryId;
        }
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int NumberOfQuestions { get; set; }
        public string LibraryId { get; set; }
    }
}