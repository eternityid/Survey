namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ExternalId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Respondents", "ExternalId", c => c.String(maxLength: 64, unicode: false));
            CreateIndex("dbo.Respondents", "ExternalId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Respondents", new[] { "ExternalId" });
            DropColumn("dbo.Respondents", "ExternalId");
        }
    }
}
