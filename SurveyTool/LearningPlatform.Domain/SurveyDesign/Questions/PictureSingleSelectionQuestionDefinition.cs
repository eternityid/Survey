using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class PictureSingleSelectionQuestionDefinition : SingleSelectionQuestionDefinition, IPictureSelectionQuestionDefinition
    {
        public bool? IsPictureShowLabel { get; set; }
        public bool? IsScalePictureToFitContainer { get; set; }
        public int? MaxPicturesInGrid { get; set; }
        public override string Type => QuestionTypeConstants.PictureSingleSelection;

    }
}