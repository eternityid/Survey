using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class MatrixQuestion : QuestionWithOptions, ITableRenderer
    {
        public MatrixQuestion()
        {
            Commands.Add(new MatrixResponseRowFactoryCommand());
        }

        public override List<int> Mask { get; set; }
        public bool Transposed { get; set; }
        public IList<QuestionWithOptions> Questions { get; set; }

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form); 
            foreach (var question in Questions)
            {
                question.ListItemAlias = ListItemAlias;
                question.Initialize(form);
            }
        }

        public override object Answer
        {
            get
            {
                // No need for implementation
                return null;
            }
            set
            {
                // No need for implementation
            }
        }

        public override void AddAnswer(ResponseRow row)
        {
            // No need for implementation
        }

        public override void RenderGridCell(Table table)
        {
            // No need for implementation
        }

        public override void RenderGrid(Table table)
        {
            table.Transposed = Transposed;
            Row row = table.AddRow();
            row.AddItem(new LabelCell());
            row.AddItem(new LabelCell());
            row.AddItems(Options.Select(option => new LabelCell {Description = option.Text+""}));

            foreach (QuestionWithOptions question in Questions)
            {
                question.RenderGrid(table);
            }
        }

        public override IEnumerable<Question> GetQuestions()
        {
            var questions = new List<Question>();
            questions.AddRange(base.GetQuestions());
            foreach(var q in Questions)
                questions.AddRange(q.GetQuestions());
            return questions;
        }
    }
}