using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class RenameIsFixBackgroundColumnToIsRepeatBackgroundAndAddInputFieldColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Themes", "InputFieldColor", c => c.String());
            RenameColumn("dbo.Themes", "IsFixBackground", "IsRepeatBackground");
        }

        public override void Down()
        {
            RenameColumn("dbo.Themes", "IsRepeatBackground", "IsFixBackground");
            DropColumn("dbo.Themes", "InputFieldColor");
        }
    }
}
