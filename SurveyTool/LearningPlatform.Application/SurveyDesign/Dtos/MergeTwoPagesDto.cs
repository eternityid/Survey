namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class MergeTwoPagesDto
    {
        public string FirstPageEtag { get; set; }
        public string SecondPageId { get; set; }
        public string SecondPageEtag { get; set; }
    }
}
