namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSurveySettingOneQuestionOnScreen : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SurveySettings", "DisplayOneQuestionOnScreen", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SurveySettings", "DisplayOneQuestionOnScreen");
        }
    }
}
