using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class PictureMultipleSelectionQuestionDefinition : MultipleSelectionQuestionDefinition
    {
        public bool? IsPictureShowLabel { get; set; }
        public bool? IsScalePictureToFitContainer { get; set; }
        public int? MaxPicturesInGrid { get; set; }
        public override string Type => QuestionTypeConstants.PictureMultipleSelection;
    }
}