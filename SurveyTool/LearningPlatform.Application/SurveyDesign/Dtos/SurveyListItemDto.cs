using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using System;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class SurveyListItemDto
    {
        public SurveyListItemDto(Survey survey)
        {
            Id = survey.Id;
            UserId = survey.UserId;
            LibraryId = survey.LibraryId;
            Title = survey.SurveySettings.SurveyTitle;
            Status = survey.Status;
            CreatedDate = survey.Created;
            ModifiedDate = survey.Modified;
            LastPublishedDate = survey.LastPublished;
            IsDeleted = survey.IsDeleted;
            AccessRights = survey.AccessRights;
        }

        public string Id { get; set; }
        public string UserId { get; set; }
        public string UserFullName { get; set; }
        public string LibraryId { get; set; }
        public string Title { get; set; }
        public SurveyStatus Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? LastPublishedDate { get; set; }
        public bool IsDeleted { get; set; }
        public SurveyAccessRights AccessRights { get; set; }
    }
}
