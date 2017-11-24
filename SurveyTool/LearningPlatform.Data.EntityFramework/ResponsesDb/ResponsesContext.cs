using LearningPlatform.Data.EntityFramework.Mapping.ResponsesContext;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using System.Data.Entity;

namespace LearningPlatform.Data.EntityFramework.ResponsesDb
{
    public class ResponsesContext : DbContext
    {
        protected bool IsTesting = false;
        static ResponsesContext()
        {
            Database.SetInitializer(new ResponsesContextInitializer());
        }

        public ResponsesContext()
            : this("Name=ResponsesContext")
        {
        }

        protected ResponsesContext(string name)
            : base(name)
        {
        }


        public DbSet<ResponseRow> ResponseRows { get; set; }
        public DbSet<Respondent> Respondents { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ResponseRowMap(IsTesting));
            modelBuilder.Configurations.Add(new RespondentMap(IsTesting));
        }
   }
}
