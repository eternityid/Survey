using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public abstract class GridQuestion : QuestionWithOptions, ITableRenderer
    {
        protected GridQuestion()
        {
            Commands.Add(new GridResponseRowFactoryCommand());
        }

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form);
            foreach (var question in Questions)
            {
                question.Initialize(form);
            }
        }


        public override object Answer
        {
            get { return null; }
            set { }
        }


        public override List<int> Mask { get; set; }
        public override void AddAnswer(ResponseRow row)
        {
        }


        public IList<Question> Questions { get; set; }

        public bool ShowAsList { get; set; }
        public bool Transposed { get; set; }

        public bool IsInGrid { get; set; }

        public override void RenderGridCell(Table table)
        {
            // No need for implementation
        }

        public override void RenderGrid(Table table)
        {
            if (!IsInGrid) table.Transposed = Transposed;
            if(Questions.Count < 1 ) return;
            var questionWithOptions = Questions[0] as QuestionWithOptions;
            if(questionWithOptions != null && questionWithOptions.Options.Count < 1) return;
            RenderVerticalHeaders(table);
            RenderHorizontalHeaders(table);
            foreach (Question question in Questions)
            {
                question.RenderGridCell(table);
            }
        }

        private void RenderVerticalHeaders(Table table)
        {
            if (!IsInGrid)
            {
                Row headerRow = table.AddRow();
                headerRow.AddItem(new LabelCell());
                foreach (Option option in Options)
                {
                    headerRow.AddItem(new LabelCell {Description = option.Text + "", Id = option.Id});
                }
            }
        }

        private void RenderHorizontalHeaders(Table table)
        {
            if (!(Questions[0] is QuestionWithOptions))
            {
                table.AddRow().AddItem(new LabelCell {Description = ""});
            }
            else
            {
                var questionWithOptions = Questions[0] as QuestionWithOptions;
                IList<Option> options = questionWithOptions.Options;

                Row row = table.AddRow();
                if (IsInGrid)
                {
                    row.AddItem(new LabelCell { Title = Title, Description = Description, Span = options.Count });
                }
                row.AddItem(new LabelCell { Description = options.First().Text + "", Id = options.First().Id});

                foreach (Option option in options.Skip(1))
                {
                    row = table.AddRow();
                    if (IsInGrid)
                    {
                        row.AddItem(null);
                    }
                    row.AddItem(new LabelCell {Description = option.Text + "", Id = option.Id});
                }
            }
        }

        public override IEnumerable<Question> GetQuestions()
        {
            var questions = new List<Question>();
            questions.AddRange(base.GetQuestions());
            foreach (var q in Questions)
                questions.AddRange(q.GetQuestions());
            return questions;
        }

    }
}