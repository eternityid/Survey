using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class MultipleSelectionQuestion : QuestionWithOptions, ISelectableQuestion
    {
        private MultipleSelectionAnswer _multipleSelectionAnswer;

        public MultipleSelectionQuestion()
        {
            _multipleSelectionAnswer = new MultipleSelectionAnswer();
            Commands.Add(new MultiResponseRowFactoryCommand());
        }

        public const string CheckTrueValue = "true,false"; //"true,false" because of MVC hidden field

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form);

            IEnumerable<string> formItemKeys = form.AllKeys.Where(key => key.StartsWith(Alias + "_"));

            foreach (string key in formItemKeys)
            {
                string answerCode = key.Substring(Alias.Length + 1);
                bool isChecked = ContainsKey(form, key);
                MultipleSelectionAnswer.AddAnswer(answerCode, isChecked);
            }

        }

        private static bool ContainsKey(NameValueCollection form, string key)
        {
            var value = form[key];
            if (value == null) return false;
            return value.Equals(CheckTrueValue, StringComparison.InvariantCultureIgnoreCase);
        }

        public MultipleSelectionAnswer MultipleSelectionAnswer => _multipleSelectionAnswer;

        public override object Answer
        {
            get { return _multipleSelectionAnswer.Items; }
            set { _multipleSelectionAnswer = MultipleSelectionAnswer.Create(value); }
        }

        public override void AddAnswer(ResponseRow row)
        {
            MultipleSelectionAnswer.AddAnswer(row);
        }

        public bool IsChecked(Option option)
        {
            return MultipleSelectionAnswer.IsChecked(option);
        }

        public override List<int> Mask { get; set; }

        public override void RenderGrid(Table table)
        {
            Row row = table.AddRow();
            row.AddItem(new LabelCell {Description = Description, Title = Title});
            row.AddItem(new LabelCell());
            row.AddItems(
                Options.Select(
                    option =>
                        new CheckBox
                        {
                            Id = GetFieldName(option),
                            Alias = option.Alias,
                            Checked = IsChecked(option),
                            Position = option.Position ?? 0
                        }));
        }

        public string GetFieldName(Option option)
        {
            return $"{Alias}_{option.Alias}";
        }

        public override void RenderGridCell(Table table)
        {
            int i = table.Rows.Count - Options.Count;
            foreach (Option option in Options)
            {
                table.Rows[i++].AddItem(new CheckBox
                {
                    Id = GetFieldName(option),
                    Alias = option.Alias,
                    Checked = IsChecked(option),
                    Position = option.Position ?? 0
                });
            }
        }
    }
}