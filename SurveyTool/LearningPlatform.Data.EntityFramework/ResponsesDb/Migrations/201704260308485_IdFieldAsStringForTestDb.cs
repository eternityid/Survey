namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class IdFieldAsStringForTestDb : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.TestAnswers", "SurveyId", c => c.String());
            AlterColumn("dbo.TestRespondents", "SurveyId", c => c.String());
            AlterColumn("dbo.TestRespondents", "CurrentPageId", c => c.String());
        }

        public override void Down()
        {
            AlterColumn("dbo.TestRespondents", "CurrentPageId", c => c.Long());
            AlterColumn("dbo.TestRespondents", "SurveyId", c => c.Long(nullable: false));
            AlterColumn("dbo.TestAnswers", "SurveyId", c => c.Long(nullable: false));
        }
    }
}
