using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class LanguageSelectionQuestion : QuestionWithOptions, ISelectableQuestion
    {
        public LanguageSelectionQuestion()
        {
            Commands.Add(new LanguageResponseRowFactoryCommand());
        }

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form);
            Answer = form[Alias];
        }

        private string _answer;

        public bool DisplayFlags { get; set; }

        public override object Answer
        {
            get { return _answer; }
            set { _answer = value as string; }
        }

        public override List<int> Mask { get; set; }
        public string SingleAnswer
        {
            get { return _answer; }
        }

        public override void AddAnswer(ResponseRow row)
        {
            if (row.AnswerType != AnswerType.Single)
            {
                throw new InvalidOperationException("Unexpected answer type on ResponseRow");
            }
            Answer = row.TextAnswer;
        }

        public override void RenderGridCell(Table table)
        {
        }
        public override void RenderGrid(Table table)
        {
        }

        public bool IsChecked(Option option)
        {
            return option.Alias == Answer as string;

        }
    }
}