using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class DateResponseRowFactoryCommand : ResponseRowFactoryCommand
    {
        public override IEnumerable<ResponseRow> Execute(ExecuteParams executeParams)
        {
            var dateQuestion = GetTypedQuestion<DateQuestion>(executeParams.Question);

            return new List<ResponseRow>
            {
                new ResponseRow
                {
                    SurveyId = executeParams.SurveyId,
                    RespondentId = executeParams.RespondentId,
                    QuestionName = dateQuestion.Alias,
                    DateTimeAnswer = dateQuestion.DateTimeAnswer,
                    AnswerType = AnswerType.Date,
                    LoopState = executeParams.LoopState
                }
            };
        }
    }
}