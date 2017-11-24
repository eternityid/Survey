using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    public partial class AddCustomColumnsFieldForRespondent : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Respondents", "CustomColumns", c => c.String());
            AddColumn("dbo.TestRespondents", "CustomColumns", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Respondents", "CustomColumns");
            DropColumn("dbo.TestRespondents", "CustomColumns");
        }
    }
}
