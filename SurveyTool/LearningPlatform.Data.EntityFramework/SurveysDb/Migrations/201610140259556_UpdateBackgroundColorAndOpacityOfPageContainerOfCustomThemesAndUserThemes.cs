namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateBackgroundColorAndOpacityOfPageContainerOfCustomThemesAndUserThemes : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Themes] SET
                [PageContainerBackgroundColor]='#ffffff' WHERE [Type]> 0 AND [PageContainerBackgroundColor] is null");

            Sql(@"UPDATE [dbo].[Themes] SET
                [PageContainerBackgroundOpacity]=0.25 WHERE [Type]> 0 AND [PageContainerBackgroundOpacity]=0");
        }
        
        public override void Down()
        {
        }
    }
}
