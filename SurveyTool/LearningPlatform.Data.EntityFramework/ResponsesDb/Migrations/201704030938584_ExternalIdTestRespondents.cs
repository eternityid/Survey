namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ExternalIdTestRespondents : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TestRespondents", "ExternalId", c => c.String(maxLength: 64, unicode: false));
            CreateIndex("dbo.TestRespondents", "ExternalId");
        }

        public override void Down()
        {
            DropIndex("dbo.TestRespondents", new[] { "ExternalId" });
            DropColumn("dbo.TestRespondents", "ExternalId");
        }

    }
}
