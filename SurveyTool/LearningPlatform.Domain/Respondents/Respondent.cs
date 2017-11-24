using LearningPlatform.Domain.Common;
using System;

namespace LearningPlatform.Domain.Respondents
{
    public class Respondent
    {
        public Respondent()
        {
            ResponseStatusCode = Respondents.ResponseStatus.NotTaken;
        }

        public long Id { get; set; }

        public string ExternalId { get; set; }

        public string Language { get; set; }
        public string Credential { get; set; }
        public string SurveyId { get; set; }
        public string CurrentPageId { get; set; }
        public string CurrentLoopState { get; set; }
        public string CurrentGotoStack { get; set; }
        public string CurrentSkipStack { get; set; }
        public string EmailAddress { get; set; }
        public int NumberSent { get; set; }
        public DateTime? LastTimeSent { get; set; }
        public DateTime? Started { get; set; }
        public DateTime? LastModified { get; set; }
        public DateTime? Completed { get; set; }
        public string ResponseStatus { get; set; }

        public bool IsMobile { get; set; }
        public int ScreenPixelsHeight { get; set; }
        public int ScreenPixelsWidth { get; set; }
        public string TouchEvents { get; set; }
        public string UserAgent { get; set; }
        public string CustomColumns { get; set; }
        public ResponseStatus ResponseStatusCode
        {
            get
            {
                ResponseStatus responseStatus;
                if (Enum.TryParse(ResponseStatus, true, out responseStatus))
                {
                    return responseStatus;
                }
                return Respondents.ResponseStatus.Custom;
            }
            set { ResponseStatus = value.ToString(); }
        }

        public string LastTimeSentString
        {
            get
            {
                return LastTimeSent.HasValue ? ((DateTime)LastTimeSent).ToString(SurveyConstants.RESPONDENT_LAST_DATE_FORMAT) : SurveyConstants.NA;
            }
        }
        public string CompletedDateString
        {
            get
            {
                return Completed.HasValue ? Convert.ToDateTime(Completed).ToString(SurveyConstants.SURVEY_REPORT_DATE_FORMAT) : SurveyConstants.NA;
            }
        }
    }
}
