using System;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class ResponseRow : ICloneable
    {
        public long Id { get; set; }
        public string SurveyId { get; set; }
        public long RespondentId { get; set; }
        public string Alias { get; set; }
        public string QuestionName { get; set; }
        public AnswerType AnswerType { get; set; }

        public int? IntegerAnswer { get; set; }
        public string TextAnswer { get; set; }
        public DateTime? DateTimeAnswer { get; set; }
        public double? DoubleAnswer { get; set; }
        public LoopState LoopState { get; set; }
        
        public object Clone()
        {
            var newRow = (ResponseRow)MemberwiseClone();
            newRow.LoopState = (LoopState)LoopState.Clone();
            return newRow;
        }
    }
}