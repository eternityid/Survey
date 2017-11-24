using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using Newtonsoft.Json;
using System.ComponentModel;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class SurveySettings
    {
        public long Id { get; set; }
        public string SurveyTitle { get; set; }
        public bool EnableBackButton { get; set; }
        public bool ResumeRespondentWhereLeftOff { get; set; }
        public bool InvitationOnlySurvey { get; set; }
        public bool SingleSignOnSurvey { get; set; }

        public LanguageString NextButtonText { get; set; }
        public LanguageString PreviousButtonText { get; set; }
        public LanguageString FinishButtonText { get; set; }
        public bool KeyboardSupport { get; set; }
        public string[] Languages { get; set; }
        public string DefaultLanguage { get; set; }

        [EditorBrowsable(EditorBrowsableState.Never)]
        [JsonIgnore]
        public string LanguagesString
        {
            get { return Languages == null ? null : string.Join(",", Languages); }
            set { Languages = value?.Split(',') ?? new string[0]; }
        }
        public bool DisplayProgressBar { get; set; }
        public bool DisplayRequiredStar { get; set; }
        public bool DisplayOneQuestionOnScreen { get; set; }
        public bool DisplayPageTitleAndDescription { get; set; }
        public byte[] RowVersion { get; set; }

        public string Version { get; set; }
    }
}