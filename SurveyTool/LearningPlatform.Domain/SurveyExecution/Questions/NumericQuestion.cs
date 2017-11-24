using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class NumericQuestion : Question
    {
        private double? _answer;

        public NumericQuestion()
        {
            Commands.Add(new NumberResponseRowFactoryCommand());
        }

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form);

            string value = form[Alias];
            Answer = string.IsNullOrEmpty(value) ? null : value;
        }


        public override object Answer
        {
            get { return _answer; }
            set { _answer = GetDouble(value); }
        }

        public double? NumberAnswer { get { return _answer; } }

        public override List<int> Mask { get; set; }
        public override void AddAnswer(ResponseRow row)
        {
            if (row.AnswerType != AnswerType.Number)
            {
                throw new InvalidOperationException("Unexpected answer type on ResponseRow");
            }
            Answer = row.DoubleAnswer;
        }

        private double? GetDouble(object value)
        {
            if (value == null)
                return null;
            return Convert.ToDouble(value);
        }

        public override void RenderGridCell(Table table)
        {
            table.Rows.Last().AddItem(_answer.HasValue ? new NumberCell {Value = _answer.Value} : null);
        }

        public double? Step { get; set; }
    }
}