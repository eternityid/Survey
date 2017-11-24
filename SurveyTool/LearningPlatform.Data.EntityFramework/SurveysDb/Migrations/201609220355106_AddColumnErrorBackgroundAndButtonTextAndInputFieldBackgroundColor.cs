using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class AddColumnErrorBackgroundAndButtonTextAndInputFieldBackgroundColor : DbMigration
    {
        public override void Up()
        {
            RenameColumn("dbo.Themes", "ButtonColor", "PrimaryButtonBackgroundColor");
            AddColumn("dbo.Themes", "PrimaryButtonColor", c => c.String());
            AddColumn("dbo.Themes", "DefaultButtonBackgroundColor", c => c.String());
            AddColumn("dbo.Themes", "DefaultButtonColor", c => c.String());
            AddColumn("dbo.Themes", "ErrorBackgroundColor", c => c.String());
            AddColumn("dbo.Themes", "InputFieldBackgroundColor", c => c.String());
            AddColumn("dbo.Themes", "IsFixBackground", c => c.Boolean(nullable: false));
        }

        public override void Down()
        {
            DropColumn("dbo.Themes", "IsFixBackground");
            DropColumn("dbo.Themes", "InputFieldBackgroundColor");
            DropColumn("dbo.Themes", "ErrorBackgroundColor");
            DropColumn("dbo.Themes", "DefaultButtonColor");
            DropColumn("dbo.Themes", "DefaultButtonBackgroundColor");
            DropColumn("dbo.Themes", "PrimaryButtonColor");
            RenameColumn("dbo.Themes", "PrimaryButtonBackgroundColor", "ButtonColor");
        }
    }
}
