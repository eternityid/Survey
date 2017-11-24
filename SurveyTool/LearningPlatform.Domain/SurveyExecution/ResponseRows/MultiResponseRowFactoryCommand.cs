using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{

    public class MultiResponseRowFactoryCommand : ResponseRowFactoryCommand
    {
        public override IEnumerable<ResponseRow> Execute(ExecuteParams executeParams)
        {
            var multiQuestion = GetTypedQuestion<MultipleSelectionQuestion>(executeParams.Question);

            return multiQuestion.MultipleSelectionAnswer.Items.Select(a => new ResponseRow
            {
                SurveyId = executeParams.SurveyId,
                RespondentId = executeParams.RespondentId,
                QuestionName = multiQuestion.Alias,
                Alias = a.Key,
                IntegerAnswer = a.Value ? 1 : 0,
                AnswerType = AnswerType.Multi,
                LoopState = executeParams.LoopState
            }).ToList();
        }
    }
}