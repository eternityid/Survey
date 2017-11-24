namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class MoveQuestionDto
    {
        public string DestinationPageId { get; set; }
        public string DestinationPageEtag { get; set; }
        public int NewQuestionIndex { get; set; }
    }
}
