namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class PictureMultipleSelectionQuestion : MultipleSelectionQuestion, IPictureSelectionQuestion
    {
        public bool IsPictureShowLabel { get; set; }
        public bool IsScalePictureToFitContainer { get; set; }
        public int MaxPicturesInGrid { get; set; }
        public string PictureFolderId { get; set; }
    }
}