using System.Collections.Generic;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{

    public partial class OptionIdAndOptionGroupIdAsString : DbMigrationExtended
    {
        public override void Up()
        {

            ConvertIdColumn("dbo.OptionGroups", new KeyValuePair<string, string>[0]);
            ConvertIdColumn("dbo.Options", new KeyValuePair<string, string>[0]);
            AlterColumn("dbo.ExpressionItems", "OptionId", c => c.String());

            //DropPrimaryKey("dbo.OptionGroups");
            //DropPrimaryKey("dbo.Options");
            //AlterColumn("dbo.OptionGroups", "Id", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Options", "Id", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.ExpressionItems", "OptionId", c => c.String());
            //AddPrimaryKey("dbo.OptionGroups", "Id");
            //AddPrimaryKey("dbo.Options", "Id");
        }

        public override void Down()
        {
            //DropPrimaryKey("dbo.Options");
            //DropPrimaryKey("dbo.OptionGroups");
            //AlterColumn("dbo.ExpressionItems", "OptionId", c => c.Long());
            //AlterColumn("dbo.Options", "Id", c => c.Long(nullable: false, identity: true));
            //AlterColumn("dbo.OptionGroups", "Id", c => c.Long(nullable: false, identity: true));
            //AddPrimaryKey("dbo.Options", "Id");
            //AddPrimaryKey("dbo.OptionGroups", "Id");
        }
    }
}
