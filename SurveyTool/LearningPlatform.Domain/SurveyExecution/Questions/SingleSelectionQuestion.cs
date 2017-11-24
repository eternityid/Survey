using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class SingleSelectionQuestion : QuestionWithOptions, ISelectableQuestion
    {
        private string _answer;

        public SingleSelectionQuestion()
        {
            Commands.Add(new SingleResponseRowFactoryCommand());
        }

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form);
            Answer = form[Alias];
        }

        public string SingleAnswer
        {
            get { return _answer; }
        }

        public override object Answer
        {
            get { return _answer; }
            set
            {
                var answer = value as string;
                if (answer == null)
                {
                    // value is some kind of collection object (probably from scripting)
                    var multiSelectAnswer = MultipleSelectionAnswer.Create(value).CheckedItems;
                    if (multiSelectAnswer.Count > 1)
                    {
                        // Not allow more than one selection
                        return;
                    }
                    if (multiSelectAnswer.Count == 1)
                    {
                        answer = multiSelectAnswer.First();
                    }
                }
                _answer = answer;
            }
        }

        public override List<int> Mask { get; set; }

        public EvaluationString LikertLeftText { get; set; }
        public EvaluationString LikertCenterText { get; set; }
        public EvaluationString LikertRightText { get; set; }
        public bool RenderOptionByButton { get; set; }

        public override void AddAnswer(ResponseRow row)
        {
            if (row.AnswerType != AnswerType.Single)
            {
                throw new InvalidOperationException("Unexpected answer type on ResponseRow");
            }
            Answer = row.TextAnswer;
        }

        public override void RenderGrid(Table table)
        {
            Row row = table.AddRow();
            row.AddItem(new LabelCell {Description = Description, Title = Title});
            row.AddItem(new LabelCell());
            row.AddItems(
                Options.Select(
                    option => new RadioButton {Id = Alias, Alias = option.Alias, Checked = IsChecked(option), Position = option.Position ?? 0}));
        }

        public bool IsChecked(Option option)
        {
            return option.Alias == SingleAnswer;
        }

        public override void RenderGridCell(Table table)
        {
            int i = table.Rows.Count - Options.Count;
            foreach (Option option in Options)
            {
                table.Rows[i++].AddItem(new RadioButton
                {
                    Id = Alias,
                    Alias = option.Alias,
                    Checked = IsChecked(option),
                    Position = option.Position ?? 0
                });
            }
        }
    }
}