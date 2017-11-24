using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class Survey : IVersionable
    {
        public string Id { get; set; }

        public Folder TopFolder { get; set; }

        public SurveySettings SurveySettings { get; set; }
        public long SurveySettingsId { get; set; }

        public string TopFolderId { get; set; }

        public string Name { get; set; }

        public SurveyStatus Status { get; set; }

        [JsonIgnore]
        public bool IsSurveyClosed => Status == SurveyStatus.Closed || Status == SurveyStatus.TemprorarilyClosed;

        [JsonIgnore]
        public bool HasChangedAfterPublishing
        {
            get
            {
                var isChangedAfterPublished = false;
                if (Modified != null && LastPublished != null)
                {
                    var modifiedTicks = Convert.ToDateTime(Modified).Ticks;
                    var lastPublishedTicks = Convert.ToDateTime(LastPublished).Ticks;
                    isChangedAfterPublished = lastPublishedTicks > 0 && modifiedTicks > lastPublishedTicks;
                }
                return isChangedAfterPublished;
            }
        }

        public DateTime? Created { get; set; }

        public DateTime? Modified { get; set; }
        //TODO: Should be client side concern
        public string CreatedDate => Created.HasValue ?
            Convert.ToDateTime(Created).ToString(SurveyConstants.SURVEY_CREATED_DATE_FORMAT) :
            SurveyConstants.NA;

        //TODO: Should be client side concern
        public string ModifiedDate => Modified.HasValue ?
            Convert.ToDateTime(Modified).ToString(SurveyConstants.SURVEY_CREATED_DATE_FORMAT) :
            SurveyConstants.NA;

        public DateTime? LastPublished { get; set; }
        public string LastPublishedDate => LastPublished.HasValue ?
            Convert.ToDateTime(LastPublished).ToString(SurveyConstants.SURVEY_CREATED_DATE_FORMAT) :
            SurveyConstants.NA;

        public string LayoutId { get; set; }

        public List<OptionList> SharedOptionLists { get; set; }

        [JsonIgnore]
        public List<string> SharedOptionListIds { get; set; }

        public string UserId { get; set; }
        public string LibraryId { get; set; }
        public string ThemeId { get; set; }
        public string CustomThemeId { get; set; }
        public string CustomColumns { get; set; }
        public byte[] RowVersion { get; set; }
        public bool IsDeleted { get; set; }
        public SurveyAccessRights AccessRights { get; set; }
        public string Version { get; set; }

        public bool IsUserHaveReadPermission(string userId)
        {
            if (UserId == userId) return true;

            if (AccessRights != null) return AccessRights.Full.Contains(userId) || AccessRights.Write.Contains(userId);

            return false;
        }

        public bool IsUserHaveWritePermission(string userId)
        {
            if (UserId == userId) return true;

            if (AccessRights != null) return AccessRights.Full.Contains(userId) || AccessRights.Write.Contains(userId);

            return false;
        }

        public bool IsUserHaveFullPermission(string userId)
        {
            if (UserId == userId) return true;

            if (AccessRights != null) return AccessRights.Full.Contains(userId);

            return false;
        }
    }
}