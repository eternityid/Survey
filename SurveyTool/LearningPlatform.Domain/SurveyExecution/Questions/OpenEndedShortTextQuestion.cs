using LearningPlatform.Domain.SurveyExecution.TableLayout;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class OpenEndedShortTextQuestion : OpenEndedTextQuestion
    {
        public override void RenderGridCell(Table table)
        {
            table.Rows[1].AddItem(new OpenEndedTextCell(Alias, OpenAnswer));
        }
    }
}