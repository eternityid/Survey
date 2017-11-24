using LearningPlatform.Domain.SurveyExecution.TableLayout;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class ScaleGridQuestion : GridQuestion
    {
        public override void RenderGrid(Table table)
        {
            if (!Questions.Any()) return;
            var firstSubQuestion = Questions.FirstOrDefault() as QuestionWithOptions;
            if (firstSubQuestion == null || !firstSubQuestion.Options.Any()) return;

            if (firstSubQuestion.IsRenderOptionByButton)
            {
                RenderOptionAsButton(table);
            }
            else
            {
                base.RenderGrid(table);
            }
        }

        private void RenderOptionAsButton(Table table)
        {
            table.Transposed = true;
            var defaultHeaderRow = table.AddRow();
            defaultHeaderRow.AddItem(new LabelCell());
            defaultHeaderRow.AddItem(new LabelCell());
            for (var topicIndex = 0; topicIndex < Options.Count; topicIndex++)
            {
                var currentTopic = Options[topicIndex];
                var subQuestion = Questions[topicIndex] as ScaleQuestion;
                Row row = table.AddRow();
                row.AddItem(new LabelCell { Description = currentTopic.Text + "", Id = currentTopic.Id });
                row.AddItem(new ListButtonCell(subQuestion));
            }
        }
    }
}
