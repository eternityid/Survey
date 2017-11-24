using LearningPlatform.Domain.SurveyExecution.Questions;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class ResponseRowFactory : IResponseRowFactory
    {
        public ICollection<ResponseRow> CreateResponseRows(string surveyId, long respondentId, LoopState loopState, IEnumerable<Question> questions)
        {
            var rows = new List<ResponseRow>();
            foreach (var question in questions)
            {
                if (question is Information) continue;
                var responseRowFactoryCommand = question.Command<ResponseRowFactoryCommand>();
                rows.AddRange(responseRowFactoryCommand.Execute(new ResponseRowFactoryCommand.ExecuteParams(surveyId, respondentId, loopState, question)));
                rows.AddRange(GetRowsForOtherQuestion(surveyId, respondentId, loopState, question as QuestionWithOptions));
            }
            return rows;
        }

        private static IEnumerable<ResponseRow> GetRowsForOtherQuestion(string surveyId, long respondentId, LoopState loopState, QuestionWithOptions question)
        {
            var rows = new List<ResponseRow>();

            if (question == null) return rows;

            foreach (var otherQuestion in question.GetOtherQuestions())
            {
                var responseRowFactoryCommand = otherQuestion.Question.Command<ResponseRowFactoryCommand>();
                IList<ResponseRow> responseRows = responseRowFactoryCommand.Execute(new ResponseRowFactoryCommand.ExecuteParams(surveyId, respondentId, loopState, otherQuestion.Question)).ToList();
                rows.AddRange(responseRows);
                if (!otherQuestion.IsOptionSelected)
                {
                    foreach (var row in responseRows) row.TextAnswer = null;
                }
            }
            return rows;
        }
    }
}