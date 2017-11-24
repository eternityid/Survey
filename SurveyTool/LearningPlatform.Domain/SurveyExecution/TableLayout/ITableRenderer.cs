namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public interface ITableRenderer
    {
        void RenderGrid(Table table);
        bool Transposed { get; }
    }
}