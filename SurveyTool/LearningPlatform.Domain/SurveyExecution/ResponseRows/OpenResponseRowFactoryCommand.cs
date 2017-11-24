using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class OpenResponseRowFactoryCommand : ResponseRowFactoryCommand
    {
        public override IEnumerable<ResponseRow> Execute(ExecuteParams executeParams)
        {
            var openQuestion = GetTypedQuestion<OpenEndedTextQuestion>(executeParams.Question);

            return new List<ResponseRow>
            {
                new ResponseRow
                {
                    SurveyId = executeParams.SurveyId,
                    RespondentId = executeParams.RespondentId,
                    QuestionName = openQuestion.Alias,
                    TextAnswer = openQuestion.OpenAnswer,
                    AnswerType = AnswerType.Open,
                    LoopState = executeParams.LoopState
                }
            };
        }
    }
}