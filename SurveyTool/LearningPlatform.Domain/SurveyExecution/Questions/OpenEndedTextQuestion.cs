using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public abstract class OpenEndedTextQuestion : Question
    {
        private string _answer;

        protected OpenEndedTextQuestion()
        {
            Commands.Add(new OpenResponseRowFactoryCommand());
        }

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form);

            Answer = form[Alias];
        }


        public override object Answer
        {
            get { return _answer; }
            set { _answer = value as string; }
        }

        public string OpenAnswer => _answer;

        public override List<int> Mask { get; set; }

        public override void AddAnswer(ResponseRow row)
        {
            if (row.AnswerType != AnswerType.Open)
            {
                throw new InvalidOperationException("Unexpected answer type on ResponseRow");
            }
            Answer = row.TextAnswer;
        }
    }
}