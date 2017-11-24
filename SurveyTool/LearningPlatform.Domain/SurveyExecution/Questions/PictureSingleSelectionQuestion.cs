using LearningPlatform.Domain.SurveyExecution.Options;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class PictureSingleSelectionQuestion : SingleSelectionQuestion, IPictureSelectionQuestion
    {
        public bool IsPictureShowLabel { get; set; }
        public bool IsScalePictureToFitContainer { get; set; }
        public int MaxPicturesInGrid { get; set; }
        public string PictureFolderId { get; set; }
    }
}