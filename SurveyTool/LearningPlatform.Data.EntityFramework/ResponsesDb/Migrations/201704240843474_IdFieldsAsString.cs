namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IdFieldsAsString : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Respondents", "SurveyId", c => c.String());
            AlterColumn("dbo.Respondents", "CurrentPageId", c => c.String());
            AlterColumn("dbo.Answers", "SurveyId", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Answers", "SurveyId", c => c.Long(nullable: false));
            AlterColumn("dbo.Respondents", "CurrentPageId", c => c.Long());
            AlterColumn("dbo.Respondents", "SurveyId", c => c.Long(nullable: false));
        }
    }
}
