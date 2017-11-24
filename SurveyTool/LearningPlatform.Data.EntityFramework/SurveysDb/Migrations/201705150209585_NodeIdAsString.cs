using System.Collections.Generic;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class NodeIdAsString : DbMigrationExtended
    {
        public override void Up()
        {
            ConvertIdColumn("dbo.Nodes", new[]
            {
                new KeyValuePair<string, string>("dbo.Nodes", "ParentId"),
                new KeyValuePair<string, string>("dbo.Nodes", "GoToFolderNodeId"),
                new KeyValuePair<string, string>("dbo.Nodes", "FalseFolderId"),
                new KeyValuePair<string, string>("dbo.Nodes", "TrueFolderId"),
                new KeyValuePair<string, string>("dbo.Questions", "PageDefinitionId"),
                new KeyValuePair<string, string>("dbo.SkipCommands", "PageDefinitionId"),
                new KeyValuePair<string, string>("dbo.Surveys", "TopFolderId"),
            });
            //DropForeignKey("dbo.Nodes", "ParentId", "dbo.Nodes");
            //DropForeignKey("dbo.Questions", "PageDefinitionId", "dbo.Nodes");
            //DropForeignKey("dbo.SkipCommands", "PageDefinitionId", "dbo.Nodes");
            //DropForeignKey("dbo.Nodes", "GoToFolderNodeId", "dbo.Nodes");
            //DropForeignKey("dbo.Nodes", "FalseFolderId", "dbo.Nodes");
            //DropForeignKey("dbo.Nodes", "TrueFolderId", "dbo.Nodes");
            //DropForeignKey("dbo.Surveys", "TopFolderId", "dbo.Nodes");
            //DropIndex("dbo.Nodes", new[] { "ParentId" });
            //DropIndex("dbo.Nodes", new[] { "GoToFolderNodeId" });
            //DropIndex("dbo.Nodes", new[] { "FalseFolderId" });
            //DropIndex("dbo.Nodes", new[] { "TrueFolderId" });
            //DropIndex("dbo.Questions", new[] { "PageDefinitionId" });
            //DropIndex("dbo.SkipCommands", new[] { "PageDefinitionId" });
            //DropIndex("dbo.Surveys", new[] { "TopFolderId" });
            //DropPrimaryKey("dbo.Nodes");
            //AlterColumn("dbo.Nodes", "Id", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Nodes", "ParentId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.Nodes", "GoToFolderNodeId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.Nodes", "FalseFolderId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.Nodes", "TrueFolderId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.Questions", "PageDefinitionId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.SkipCommands", "PageDefinitionId", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Surveys", "TopFolderId", c => c.String(maxLength: 128));
            //AddPrimaryKey("dbo.Nodes", "Id");
            //CreateIndex("dbo.Nodes", "ParentId");
            //CreateIndex("dbo.Nodes", "GoToFolderNodeId");
            //CreateIndex("dbo.Nodes", "FalseFolderId");
            //CreateIndex("dbo.Nodes", "TrueFolderId");
            //CreateIndex("dbo.Questions", "PageDefinitionId");
            //CreateIndex("dbo.SkipCommands", "PageDefinitionId");
            //CreateIndex("dbo.Surveys", "TopFolderId");
            //AddForeignKey("dbo.Nodes", "ParentId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.Questions", "PageDefinitionId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.SkipCommands", "PageDefinitionId", "dbo.Nodes", "Id", cascadeDelete: true);
            //AddForeignKey("dbo.Nodes", "GoToFolderNodeId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.Nodes", "FalseFolderId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.Nodes", "TrueFolderId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.Surveys", "TopFolderId", "dbo.Nodes", "Id");
        }

        public override void Down()
        {
            //DropForeignKey("dbo.Surveys", "TopFolderId", "dbo.Nodes");
            //DropForeignKey("dbo.Nodes", "TrueFolderId", "dbo.Nodes");
            //DropForeignKey("dbo.Nodes", "FalseFolderId", "dbo.Nodes");
            //DropForeignKey("dbo.Nodes", "GoToFolderNodeId", "dbo.Nodes");
            //DropForeignKey("dbo.SkipCommands", "PageDefinitionId", "dbo.Nodes");
            //DropForeignKey("dbo.Questions", "PageDefinitionId", "dbo.Nodes");
            //DropForeignKey("dbo.Nodes", "ParentId", "dbo.Nodes");
            //DropIndex("dbo.Surveys", new[] { "TopFolderId" });
            //DropIndex("dbo.SkipCommands", new[] { "PageDefinitionId" });
            //DropIndex("dbo.Questions", new[] { "PageDefinitionId" });
            //DropIndex("dbo.Nodes", new[] { "TrueFolderId" });
            //DropIndex("dbo.Nodes", new[] { "FalseFolderId" });
            //DropIndex("dbo.Nodes", new[] { "GoToFolderNodeId" });
            //DropIndex("dbo.Nodes", new[] { "ParentId" });
            //DropPrimaryKey("dbo.Nodes");
            //AlterColumn("dbo.Surveys", "TopFolderId", c => c.Long());
            //AlterColumn("dbo.SkipCommands", "PageDefinitionId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Questions", "PageDefinitionId", c => c.Long());
            //AlterColumn("dbo.Nodes", "TrueFolderId", c => c.Long());
            //AlterColumn("dbo.Nodes", "FalseFolderId", c => c.Long());
            //AlterColumn("dbo.Nodes", "GoToFolderNodeId", c => c.Long());
            //AlterColumn("dbo.Nodes", "ParentId", c => c.Long());
            //AlterColumn("dbo.Nodes", "Id", c => c.Long(nullable: false, identity: true));
            //AddPrimaryKey("dbo.Nodes", "Id");
            //CreateIndex("dbo.Surveys", "TopFolderId");
            //CreateIndex("dbo.SkipCommands", "PageDefinitionId");
            //CreateIndex("dbo.Questions", "PageDefinitionId");
            //CreateIndex("dbo.Nodes", "TrueFolderId");
            //CreateIndex("dbo.Nodes", "FalseFolderId");
            //CreateIndex("dbo.Nodes", "GoToFolderNodeId");
            //CreateIndex("dbo.Nodes", "ParentId");
            //AddForeignKey("dbo.Surveys", "TopFolderId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.Nodes", "TrueFolderId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.Nodes", "FalseFolderId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.Nodes", "GoToFolderNodeId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.SkipCommands", "PageDefinitionId", "dbo.Nodes", "Id", cascadeDelete: true);
            //AddForeignKey("dbo.Questions", "PageDefinitionId", "dbo.Nodes", "Id");
            //AddForeignKey("dbo.Nodes", "ParentId", "dbo.Nodes", "Id");
        }
    }
}
