namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SurveySettingForSso : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SurveySettings", "SingleSignOnSurvey", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SurveySettings", "SingleSignOnSurvey");
        }
    }
}
