using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class NumberResponseRowFactoryCommand : ResponseRowFactoryCommand
    {
        public override IEnumerable<ResponseRow> Execute(ExecuteParams executeParams)
        {
            var numericQuestion = GetTypedQuestion<NumericQuestion>(executeParams.Question);

            return new List<ResponseRow>
            {
                new ResponseRow
                {
                    SurveyId = executeParams.SurveyId,
                    RespondentId = executeParams.RespondentId,
                    QuestionName = numericQuestion.Alias,
                    DoubleAnswer = numericQuestion.NumberAnswer,
                    AnswerType = AnswerType.Number,
                    LoopState = executeParams.LoopState
                }
            };
        }
    }
}