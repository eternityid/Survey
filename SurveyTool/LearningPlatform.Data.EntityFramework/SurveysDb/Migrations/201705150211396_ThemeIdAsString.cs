using System.Collections.Generic;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ThemeIdAsString : DbMigrationExtended
    {
        public override void Up()
        {
            ConvertIdColumn("dbo.Themes", new[]
            {
                new KeyValuePair<string, string>("dbo.Nodes", "PageThemeOverrideId")
            });

            AlterColumn("dbo.Nodes", "PageThemeId", c => c.String());
            AlterColumn("dbo.Surveys", "ThemeId", c => c.String());

            //DropForeignKey("dbo.Nodes", "PageThemeOverrideId", "dbo.Themes");
            //DropIndex("dbo.Nodes", new[] { "PageThemeOverrideId" });
            //DropPrimaryKey("dbo.Themes");
            //AlterColumn("dbo.Nodes", "PageThemeId", c => c.String());
            //AlterColumn("dbo.Nodes", "PageThemeOverrideId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.Themes", "Id", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Surveys", "ThemeId", c => c.String());
            //AddPrimaryKey("dbo.Themes", "Id");
            //CreateIndex("dbo.Nodes", "PageThemeOverrideId");
            //AddForeignKey("dbo.Nodes", "PageThemeOverrideId", "dbo.Themes", "Id");
        }

        public override void Down()
        {
            //DropForeignKey("dbo.Nodes", "PageThemeOverrideId", "dbo.Themes");
            //DropIndex("dbo.Nodes", new[] { "PageThemeOverrideId" });
            //DropPrimaryKey("dbo.Themes");
            //AlterColumn("dbo.Surveys", "ThemeId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Themes", "Id", c => c.Long(nullable: false, identity: true));
            //AlterColumn("dbo.Nodes", "PageThemeOverrideId", c => c.Long());
            //AlterColumn("dbo.Nodes", "PageThemeId", c => c.Long());
            //AddPrimaryKey("dbo.Themes", "Id");
            //CreateIndex("dbo.Nodes", "PageThemeOverrideId");
            //AddForeignKey("dbo.Nodes", "PageThemeOverrideId", "dbo.Themes", "Id");
        }
    }
}
