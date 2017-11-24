namespace LearningPlatform.Domain.SurveyDesign.Surveys
{
    public class SurveySearchFilter
    {
        public string SearchString { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedDateTo { get; set; }
        public string CreatedDateOperator { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedDateTo { get; set; }
        public string ModifiedDateOperator { get; set; }
        public SurveyStatusFilter Status { get; set; }
        public bool ShowDeletedSurveys { get; set; }
        public int Start { get; set; }
        public int Limit { get; set; }
        public string UserId { get; set; }
    }
}