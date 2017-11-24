namespace LearningPlatform.Data.EntityFramework.ResponsesDb
{
    public class TestResponsesContext : ResponsesContext
    {
        public TestResponsesContext()
            : base("Name=TestResponsesContext")
        {
            IsTesting = true;
        }
    }
}