namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LoopDefinitionNoLongerANode : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Nodes", new[] { "OptionListId" });
            CreateTable(
                "dbo.Loops",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Seed = c.Int(nullable: false),
                        OptionsMaskQuestionId = c.Long(),
                        OptionsMaskType = c.Int(),
                        OptionsMaskCustomScript = c.String(),
                        OrderType = c.Int(nullable: false),
                        OptionsOrderType = c.Int(nullable: false),
                        OptionListId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.OptionListId);
            
            AddColumn("dbo.Nodes", "LoopId", c => c.Long());
            CreateIndex("dbo.Nodes", "LoopId");
            AddForeignKey("dbo.Nodes", "LoopId", "dbo.Loops", "Id");

            Sql(@"
DECLARE @tempNodes TABLE (
	[Id] [bigint] NOT NULL,
	[Seed] [int] NOT NULL,
	[OptionsMaskQuestionId] [bigint] NULL,
	[OptionsMaskType] [int] NULL,
	[OptionsMaskCustomScript] [nvarchar](max) NULL,
	[OrderType] [int] NOT NULL,
	[OptionsOrderType] [int] NOT NULL,
	[OptionListId] [bigint] NULL);

DECLARE @idsTable TABLE (
	[NodeId] [bigint] NOT NULL,
	[LoopId] [bigint] NOT NULL);

INSERT INTO @tempNodes
select Id, Seed, OptionsMaskQuestionId, OptionsMaskType, OptionsMaskCustomScript, OrderType, OptionsOrderType, OptionListId 
from [Nodes] where [Discriminator]='LoopDefinition';


MERGE INTO [Loops]
USING @tempNodes AS node
ON 1 = 0
WHEN NOT MATCHED THEN
  INSERT(Seed, OptionsMaskQuestionId, OptionsMaskType, OptionsMaskCustomScript, OrderType, OptionsOrderType, OptionListId) Values(node.Seed, node.OptionsMaskQuestionId, node.OptionsMaskType, node.OptionsMaskCustomScript, node.OrderType, node.OptionsOrderType, node.OptionListId)
Output node.Id as NodeId, inserted.Id as LoopId INTO @IdsTable;

UPDATE nodes
  SET nodes.LoopId = ids.LoopId, nodes.Discriminator='Folder'
  FROM Nodes AS nodes
  INNER JOIN @idsTable AS ids
  ON nodes.Id = ids.NodeId
  WHERE nodes.Discriminator = 'LoopDefinition';
");

            DropColumn("dbo.Nodes", "OptionsMaskQuestionId");
            DropColumn("dbo.Nodes", "OptionsMaskType");
            DropColumn("dbo.Nodes", "OptionsMaskCustomScript");
            DropColumn("dbo.Nodes", "OptionsOrderType");
            DropForeignKey("dbo.Nodes", "OptionListId", "dbo.OptionLists");
            DropColumn("dbo.Nodes", "OptionListId");
        }

        public override void Down()
        {
            AddColumn("dbo.Nodes", "OptionListId", c => c.Long());
            AddForeignKey("dbo.Nodes", "OptionListId", "dbo.OptionLists", "Id");
            AddColumn("dbo.Nodes", "OptionsOrderType", c => c.Int());
            AddColumn("dbo.Nodes", "OptionsMaskCustomScript", c => c.String());
            AddColumn("dbo.Nodes", "OptionsMaskType", c => c.Int());
            AddColumn("dbo.Nodes", "OptionsMaskQuestionId", c => c.Long());

            Sql(@"
UPDATE Nodes SET nodes.Discriminator='LoopDefinition', nodes.Seed = loops.Seed, nodes.OptionsMaskQuestionId = loops.OptionsMaskQuestionId, nodes.OptionsMaskType = loops.OptionsMaskType, nodes.OptionsMaskCustomScript = loops.OptionsMaskCustomScript, nodes.OrderType = loops.OrderType, nodes.OptionsOrderType = loops.OptionsOrderType, nodes.OptionListId = loops.OptionListId
	FROM Nodes AS nodes 
	INNER JOIN Loops AS loops
	ON Nodes.LoopId = loops.Id
");

            DropForeignKey("dbo.Nodes", "LoopId", "dbo.Loops");
            DropIndex("dbo.Loops", new[] { "OptionListId" });
            DropIndex("dbo.Nodes", new[] { "LoopId" });
            DropColumn("dbo.Nodes", "LoopId");
            DropTable("dbo.Loops");
            CreateIndex("dbo.Nodes", "OptionListId");
        }
    }
}
