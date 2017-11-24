using System.Collections.Generic;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class OptionListIdAsString : DbMigrationExtended
    {
        public override void Up()
        {
            ConvertIdColumn("dbo.OptionLists", new[]
            {
                new KeyValuePair<string, string>("dbo.Loops", "OptionListId"),
                new KeyValuePair<string, string>("dbo.OptionGroups", "ListId"),
                new KeyValuePair<string, string>("dbo.Options", "ListId"),
                new KeyValuePair<string, string>("dbo.Questions", "OptionListId"),
            });

            AlterColumn("dbo.Options", "ReferenceListId", c => c.String());

            //DropForeignKey("dbo.OptionGroups", "ListId", "dbo.OptionLists");
            //DropForeignKey("dbo.Questions", "OptionListId", "dbo.OptionLists");
            //DropForeignKey("dbo.Options", "ListId", "dbo.OptionLists");
            //DropForeignKey("dbo.Loops", "OptionListId", "dbo.OptionLists");
            //DropIndex("dbo.Loops", new[] { "OptionListId" });
            //DropIndex("dbo.OptionGroups", new[] { "ListId" });
            //DropIndex("dbo.Options", new[] { "ListId" });
            //DropIndex("dbo.Questions", new[] { "OptionListId" });
            //DropPrimaryKey("dbo.OptionLists");
            //AlterColumn("dbo.Loops", "OptionListId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.OptionLists", "Id", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.OptionGroups", "ListId", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Options", "ListId", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Options", "ReferenceListId", c => c.String());
            //AlterColumn("dbo.Questions", "OptionListId", c => c.String(maxLength: 128));
            //AddPrimaryKey("dbo.OptionLists", "Id");
            //CreateIndex("dbo.Loops", "OptionListId");
            //CreateIndex("dbo.OptionGroups", "ListId");
            //CreateIndex("dbo.Options", "ListId");
            //CreateIndex("dbo.Questions", "OptionListId");
            //AddForeignKey("dbo.OptionGroups", "ListId", "dbo.OptionLists", "Id", cascadeDelete: true);
            //AddForeignKey("dbo.Questions", "OptionListId", "dbo.OptionLists", "Id");
            //AddForeignKey("dbo.Options", "ListId", "dbo.OptionLists", "Id", cascadeDelete: true);
            //AddForeignKey("dbo.Loops", "OptionListId", "dbo.OptionLists", "Id");
        }

        public override void Down()
        {
            //DropForeignKey("dbo.Loops", "OptionListId", "dbo.OptionLists");
            //DropForeignKey("dbo.Options", "ListId", "dbo.OptionLists");
            //DropForeignKey("dbo.Questions", "OptionListId", "dbo.OptionLists");
            //DropForeignKey("dbo.OptionGroups", "ListId", "dbo.OptionLists");
            //DropIndex("dbo.Questions", new[] { "OptionListId" });
            //DropIndex("dbo.Options", new[] { "ListId" });
            //DropIndex("dbo.OptionGroups", new[] { "ListId" });
            //DropIndex("dbo.Loops", new[] { "OptionListId" });
            //DropPrimaryKey("dbo.OptionLists");
            //AlterColumn("dbo.Questions", "OptionListId", c => c.Long());
            //AlterColumn("dbo.Options", "ReferenceListId", c => c.Long());
            //AlterColumn("dbo.Options", "ListId", c => c.Long(nullable: false));
            //AlterColumn("dbo.OptionGroups", "ListId", c => c.Long(nullable: false));
            //AlterColumn("dbo.OptionLists", "Id", c => c.Long(nullable: false, identity: true));
            //AlterColumn("dbo.Loops", "OptionListId", c => c.Long());
            //AddPrimaryKey("dbo.OptionLists", "Id");
            //CreateIndex("dbo.Questions", "OptionListId");
            //CreateIndex("dbo.Options", "ListId");
            //CreateIndex("dbo.OptionGroups", "ListId");
            //CreateIndex("dbo.Loops", "OptionListId");
            //AddForeignKey("dbo.Loops", "OptionListId", "dbo.OptionLists", "Id");
            //AddForeignKey("dbo.Options", "ListId", "dbo.OptionLists", "Id", cascadeDelete: true);
            //AddForeignKey("dbo.Questions", "OptionListId", "dbo.OptionLists", "Id");
            //AddForeignKey("dbo.OptionGroups", "ListId", "dbo.OptionLists", "Id", cascadeDelete: true);
        }
    }
}
