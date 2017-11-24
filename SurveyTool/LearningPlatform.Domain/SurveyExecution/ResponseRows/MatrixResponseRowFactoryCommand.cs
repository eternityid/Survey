using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class MatrixResponseRowFactoryCommand : ResponseRowFactoryCommand
    {
        public override IEnumerable<ResponseRow> Execute(ExecuteParams executeParams)
        {
            var rows = new List<ResponseRow>();
            var gridQuestion = GetTypedQuestion<MatrixQuestion>(executeParams.Question);

            foreach (var childQuestion in gridQuestion.Questions)
            {
                var saveCommand = childQuestion.Command<ResponseRowFactoryCommand>();
                var childRows = saveCommand.Execute(new ExecuteParams(executeParams.SurveyId, executeParams.RespondentId, executeParams.LoopState, childQuestion));
                rows.AddRange(childRows);
            }
            return rows;
        }
    }
}