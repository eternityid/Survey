using LearningPlatform.Domain.SurveyExecution.Questions;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public abstract class ResponseRowFactoryCommand
    {

        public abstract IEnumerable<ResponseRow> Execute(ExecuteParams executeParams);

        protected static T GetTypedQuestion<T>(Question question) where T : class
        {
            if (question == null) throw new ArgumentNullException(nameof(question));
            var typedQuestion = question as T;
            if (typedQuestion == null) throw new ArgumentOutOfRangeException(nameof(question));
            return typedQuestion;
        }

        public class ExecuteParams
        {
            private readonly string _surveyId;
            private readonly long _respondentId;
            private readonly LoopState _loopState;
            private readonly Question _question;

            public ExecuteParams(string surveyId, long respondentId, LoopState loopState, Question question)
            {
                _surveyId = surveyId;
                _respondentId = respondentId;
                _loopState = loopState;
                _question = question;
            }

            public string SurveyId => _surveyId;

            public long RespondentId => _respondentId;

            public LoopState LoopState => _loopState;

            public Question Question => _question;
        }

    }
}