namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLayouts : DbMigration
    {
        public override void Up()
        {
            Sql(@"
IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[Layouts])
BEGIN
    SET IDENTITY_INSERT [dbo].[Layouts] ON 
    INSERT [dbo].[Layouts] ([Id], [Name], [Css]) VALUES (1, N'Default Layout', N'defaultLayout.css')
    INSERT [dbo].[Layouts] ([Id], [Name], [Css]) VALUES (2, N'Layout With Container', N'layoutWithContainer.css')
    SET IDENTITY_INSERT [dbo].[Layouts] OFF
END
");
        }
        
        public override void Down()
        {
        }
    }
}
