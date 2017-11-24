using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class DateQuestion : Question
    {
        private DateTime? _answer;

        public DateQuestion()
        {
            Commands.Add(new DateResponseRowFactoryCommand());
        }

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form);
            string answerValue = form[Alias];
            Answer = string.IsNullOrEmpty(answerValue) ? null : answerValue;
        }

        public override object Answer
        {
            get { return _answer; }
            set { _answer = GetDateTime(value); }
        }

        public DateTime? DateTimeAnswer => _answer;

        public override List<int> Mask { get; set; }
        public override void AddAnswer(ResponseRow row)
        {
            if (row.AnswerType != AnswerType.Date)
            {
                throw new InvalidOperationException("Unexpected answer type on ResponseRow");
            }
            Answer = row.DateTimeAnswer;
        }

        private DateTime? GetDateTime(object value)
        {
            var stringValue = value as string;
            if (stringValue != null)
                return DateTime.Parse(stringValue, CultureInfo.CurrentUICulture);
            var dateTime = value as DateTime?;
            return dateTime;
        }

        public override void RenderGridCell(Table table)
        {
            table.Rows.Last().AddItem(_answer.HasValue ? new DateCell {Date = _answer.Value.ToUniversalTime()} : null);
        }
    }
}