namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public interface IPictureSelectionQuestionDefinition
    {
        bool? IsPictureShowLabel { get; set; }
        bool? IsScalePictureToFitContainer { get; set; }
        int? MaxPicturesInGrid { get; set; }
    }
}