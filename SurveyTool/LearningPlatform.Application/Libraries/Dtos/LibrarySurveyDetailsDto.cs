using LearningPlatform.Domain.SurveyDesign;
using System;

namespace LearningPlatform.Application.Libraries.Dtos
{
    public class LibrarySurveyDetailsDto
    {
        public LibrarySurveyDetailsDto(Survey survey)
        {
            Id = survey.Id;
            Title = survey.SurveySettings.SurveyTitle;
            CreatedDateTime = survey.Created;
            LastModifiedDateTime = survey.Modified;
            LibraryId = survey.LibraryId;
        }
        public string Id { get; set; }
        public string Title { get; set; }
        public int NumberOfPages { get; set; }
        public int NumberOfQuestions { get; set; }
        public DateTime? CreatedDateTime { get; set; }
        public DateTime? LastModifiedDateTime { get; set; }
        public string LibraryId { get; set; }
    }
}