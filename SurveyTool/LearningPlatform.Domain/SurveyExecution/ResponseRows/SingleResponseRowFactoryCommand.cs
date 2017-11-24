using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class SingleResponseRowFactoryCommand : ResponseRowFactoryCommand
    {
        public override IEnumerable<ResponseRow> Execute(ExecuteParams executeParams)
        {
            var singleQuestion = GetTypedQuestion<SingleSelectionQuestion>(executeParams.Question);
            return new List<ResponseRow>
            {
                new ResponseRow
                {
                    SurveyId = executeParams.SurveyId,
                    RespondentId = executeParams.RespondentId,
                    QuestionName = singleQuestion.Alias,
                    TextAnswer = singleQuestion.SingleAnswer,
                    AnswerType = AnswerType.Single,
                    LoopState = executeParams.LoopState
                }
            };
        } 
    }
}