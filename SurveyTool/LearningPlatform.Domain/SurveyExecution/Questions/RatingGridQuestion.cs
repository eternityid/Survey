using LearningPlatform.Domain.SurveyExecution.TableLayout;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class RatingGridQuestion : GridQuestion
    {
        public override void RenderGrid(Table table)
        {
            table.Transposed = true;
            if (!Questions.Any()) return;
            var questionWithOptions = Questions.FirstOrDefault() as QuestionWithOptions;
            if (questionWithOptions != null && !questionWithOptions.Options.Any()) return;

            var defaultHeaderRow = table.AddRow(); // NOTE: keep it for default header
            defaultHeaderRow.AddItem(new LabelCell());
            defaultHeaderRow.AddItem(new LabelCell());
            for (var topicIndex = 0; topicIndex < Options.Count; topicIndex++)
            {
                var currentTopic = Options[topicIndex];
                var subQuestion = Questions[topicIndex] as RatingQuestion;
                Row row = table.AddRow();
                row.AddItem(new LabelCell { Description = currentTopic.Text + "", Id = currentTopic.Id });
                row.AddItem(new RatingCell(subQuestion.Alias, subQuestion.Options.Count, subQuestion.SingleAnswer, subQuestion.ShapeName));
            }
        }
    }
}
