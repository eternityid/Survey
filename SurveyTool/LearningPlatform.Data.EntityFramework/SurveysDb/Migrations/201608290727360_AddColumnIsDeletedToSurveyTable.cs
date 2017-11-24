using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class AddColumnIsDeletedToSurveyTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Surveys", "IsDeleted", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Surveys", "IsDeleted");
        }
    }
}
