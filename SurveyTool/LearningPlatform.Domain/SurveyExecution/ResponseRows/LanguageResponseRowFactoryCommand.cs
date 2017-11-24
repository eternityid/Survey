using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class LanguageResponseRowFactoryCommand : ResponseRowFactoryCommand
    {
        public override IEnumerable<ResponseRow> Execute(ExecuteParams executeParams)
        {
            var languageQuestion = GetTypedQuestion<LanguageSelectionQuestion>(executeParams.Question);
            return new List<ResponseRow>
            {
                new ResponseRow
                {
                    SurveyId = executeParams.SurveyId,
                    RespondentId = executeParams.RespondentId,
                    QuestionName = languageQuestion.Alias,
                    TextAnswer = languageQuestion.SingleAnswer,
                    AnswerType = AnswerType.Single,
                    LoopState = executeParams.LoopState
                }
            };
        }
    }
}