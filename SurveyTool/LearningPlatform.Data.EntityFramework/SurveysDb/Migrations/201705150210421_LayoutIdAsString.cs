using System.Collections.Generic;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class LayoutIdAsString : DbMigrationExtended
    {
        public override void Up()
        {
            ConvertIdColumn("dbo.Layouts", new[]
                {
                    new KeyValuePair<string, string>("dbo.Templates", "LayoutId")
                });

            AlterColumn("dbo.Nodes", "PageLayoutId", c => c.String());
            AlterColumn("dbo.Surveys", "LayoutId", c => c.String());

            //DropForeignKey("dbo.Templates", "LayoutId", "dbo.Layouts");
            //DropIndex("dbo.Templates", new[] { "LayoutId" });
            //DropPrimaryKey("dbo.Layouts");
            //AlterColumn("dbo.Nodes", "PageLayoutId", c => c.String());
            //AlterColumn("dbo.Layouts", "Id", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Templates", "LayoutId", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Surveys", "LayoutId", c => c.String());
            //AddPrimaryKey("dbo.Layouts", "Id");
            //CreateIndex("dbo.Templates", "LayoutId");
            //AddForeignKey("dbo.Templates", "LayoutId", "dbo.Layouts", "Id", cascadeDelete: true);
        }

        public override void Down()
        {
            //DropForeignKey("dbo.Templates", "LayoutId", "dbo.Layouts");
            //DropIndex("dbo.Templates", new[] { "LayoutId" });
            //DropPrimaryKey("dbo.Layouts");
            //AlterColumn("dbo.Surveys", "LayoutId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Templates", "LayoutId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Layouts", "Id", c => c.Long(nullable: false, identity: true));
            //AlterColumn("dbo.Nodes", "PageLayoutId", c => c.Long());
            //AddPrimaryKey("dbo.Layouts", "Id");
            //CreateIndex("dbo.Templates", "LayoutId");
            //AddForeignKey("dbo.Templates", "LayoutId", "dbo.Layouts", "Id", cascadeDelete: true);
        }
    }
}
