namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public abstract class GridQuestionDefinition : QuestionWithOptionsDefinition
    {
        public bool Transposed { get; set; }
        public QuestionDefinition SubQuestionDefinition { get; set; }
    }
}