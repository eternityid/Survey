namespace LearningPlatform.Domain.SurveyDesign.Validation
{
    public abstract class MinMaxValidation : QuestionValidation
    {
        public int? Min { get; set; }
        public int? Max { get; set; }

    }
}