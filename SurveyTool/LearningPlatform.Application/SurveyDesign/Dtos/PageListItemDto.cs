using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class PageListItemDto
    {
        public PageListItemDto()
        {

        }

        public PageListItemDto(PageDefinition page)
        {
            Id = page.Id;
            LibraryId = page.LibraryId;
            Alias = page.Alias;
            Title = page.Title.GetFirstItemText();
            Description = page.Description.GetFirstItemText();
            TotalQuestions = page.QuestionIds.Count;
        }
        public string Id { get; set; }
        public string LibraryId { get; set; }
        public string Alias { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int TotalQuestions { get; set; }
    }
}
