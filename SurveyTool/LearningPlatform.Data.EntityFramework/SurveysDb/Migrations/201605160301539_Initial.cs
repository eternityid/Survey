using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Nodes",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 256),
                        ParentId = c.Long(),
                        SurveyId = c.Long(nullable: false),
                        Position = c.Int(nullable: false),
                        IsFixedPosition = c.Boolean(nullable: false),
                        NodeType = c.String(maxLength: 30),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                        Seed = c.Int(),
                        OrderType = c.Int(),
                        ScriptCode = c.String(),
                        OptionsMaskQuestionId = c.Long(),
                        OptionsMaskType = c.Int(),
                        OptionsMaskCustomScript = c.String(),
                        OptionsOrderType = c.Int(),
                        ResponseStatus = c.String(maxLength: 30),
                        NavigationButtonSettings = c.Int(),
                        Description = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                        OptionListId = c.Long(),
                        GoToFolderNodeId = c.Long(),
                        ExpressionId = c.Long(),
                        FalseFolderId = c.Long(),
                        TrueFolderId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Nodes", t => t.ParentId)
                .ForeignKey("dbo.OptionLists", t => t.OptionListId)
                .ForeignKey("dbo.Nodes", t => t.GoToFolderNodeId)
                .ForeignKey("dbo.Expressions", t => t.ExpressionId)
                .ForeignKey("dbo.Nodes", t => t.FalseFolderId)
                .ForeignKey("dbo.Nodes", t => t.TrueFolderId)
                .Index(t => t.ParentId)
                .Index(t => t.OptionListId)
                .Index(t => t.GoToFolderNodeId)
                .Index(t => t.ExpressionId)
                .Index(t => t.FalseFolderId)
                .Index(t => t.TrueFolderId);
            
            CreateTable(
                "dbo.OptionLists",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 30),
                        SurveyId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Options",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Alias = c.String(nullable: false, maxLength: 30, unicode: false),
                        IsFixedPosition = c.Boolean(nullable: false),
                        ListId = c.Long(nullable: false),
                        OtherQuestionDefinitionId = c.Long(),
                        ReferenceListId = c.Long(),
                        Position = c.Int(nullable: false),
                        OptionsMaskQuestionId = c.Long(),
                        OptionsMaskType = c.Int(),
                        OptionsMaskCustomScript = c.String(),
                        PictureName = c.String(),
                        TextId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.OtherQuestionDefinitionId)
                .ForeignKey("dbo.LanguageStrings", t => t.TextId)
                .ForeignKey("dbo.OptionLists", t => t.ListId, cascadeDelete: true)
                .Index(t => t.ListId)
                .Index(t => t.OtherQuestionDefinitionId)
                .Index(t => t.TextId);
            
            CreateTable(
                "dbo.Questions",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        PageDefinitionId = c.Long(),
                        Alias = c.String(nullable: false, maxLength: 50),
                        SurveyId = c.Long(nullable: false),
                        Position = c.Int(nullable: false),
                        QuestionMask = c.String(),
                        IsFixedPosition = c.Boolean(nullable: false),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                        RandomDataSelectionProbability = c.Short(),
                        Cols = c.Int(),
                        Rows = c.Int(),
                        OrderType = c.Int(),
                        Seed = c.Int(),
                        DisplayOrientation = c.Int(),
                        OptionsMaskQuestionId = c.Long(),
                        OptionsMaskType = c.Int(),
                        OptionsMaskCustomScript = c.String(),
                        FakeType = c.String(),
                        IsPictureSelection = c.Boolean(),
                        IsPictureShowLabel = c.Boolean(),
                        IsScalePictureToFitContainer = c.Boolean(),
                        MaxPicturesInGrid = c.Int(),
                        Transposed = c.Boolean(),
                        ShapeName = c.String(),
                        RenderOptionByButton = c.Boolean(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                        DecriptionId = c.Long(),
                        QuestionMaskExpressionId = c.Long(),
                        TitleId = c.Long(),
                        OptionListId = c.Long(),
                        ParentQuestionId = c.Long(),
                        SubQuestionDefinitionId = c.Long(),
                        LikertCenterTextId = c.Long(),
                        LikertLeftTextId = c.Long(),
                        LikertRightTextId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.LanguageStrings", t => t.DecriptionId)
                .ForeignKey("dbo.Nodes", t => t.PageDefinitionId)
                .ForeignKey("dbo.Expressions", t => t.QuestionMaskExpressionId)
                .ForeignKey("dbo.LanguageStrings", t => t.TitleId)
                .ForeignKey("dbo.OptionLists", t => t.OptionListId)
                .ForeignKey("dbo.Questions", t => t.ParentQuestionId)
                .ForeignKey("dbo.Questions", t => t.SubQuestionDefinitionId)
                .ForeignKey("dbo.LanguageStrings", t => t.LikertCenterTextId)
                .ForeignKey("dbo.LanguageStrings", t => t.LikertLeftTextId)
                .ForeignKey("dbo.LanguageStrings", t => t.LikertRightTextId)
                .Index(t => t.PageDefinitionId)
                .Index(t => t.DecriptionId)
                .Index(t => t.QuestionMaskExpressionId)
                .Index(t => t.TitleId)
                .Index(t => t.OptionListId)
                .Index(t => t.ParentQuestionId)
                .Index(t => t.SubQuestionDefinitionId)
                .Index(t => t.LikertCenterTextId)
                .Index(t => t.LikertLeftTextId)
                .Index(t => t.LikertRightTextId);
            
            CreateTable(
                "dbo.LanguageStrings",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        SurveyId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.LanguageStringItems",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Language = c.String(),
                        Text = c.String(nullable: false),
                        LanguageStringId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.LanguageStrings", t => t.LanguageStringId, cascadeDelete: true)
                .Index(t => t.LanguageStringId);
            
            CreateTable(
                "dbo.SkipCommands",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        SkipToQuestionId = c.Long(nullable: false),
                        PageDefinitionId = c.Long(nullable: false),
                        SurveyId = c.Long(nullable: false),
                        ExpressionId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Expressions", t => t.ExpressionId)
                .ForeignKey("dbo.Nodes", t => t.PageDefinitionId, cascadeDelete: true)
                .Index(t => t.PageDefinitionId)
                .Index(t => t.ExpressionId);
            
            CreateTable(
                "dbo.Expressions",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        SurveyId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ExpressionItems",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        QuestionId = c.Long(),
                        OptionId = c.Long(),
                        Operator = c.Int(),
                        Value = c.String(),
                        LogicalOperator = c.Int(),
                        Indent = c.Int(nullable: false),
                        Position = c.Int(nullable: false),
                        ExpressionId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Expressions", t => t.ExpressionId, cascadeDelete: true)
                .Index(t => t.ExpressionId);
            
            CreateTable(
                "dbo.QuestionValidators",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        QuestionDefinitionId = c.Long(nullable: false),
                        Min = c.Int(),
                        Max = c.Int(),
                        MatchPattern = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                        ErrorMessage_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.LanguageStrings", t => t.ErrorMessage_Id)
                .ForeignKey("dbo.Questions", t => t.QuestionDefinitionId, cascadeDelete: true)
                .Index(t => t.QuestionDefinitionId)
                .Index(t => t.ErrorMessage_Id);
            
            CreateTable(
                "dbo.Layouts",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 30),
                        Css = c.String(),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Templates",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 30),
                        IsDefault = c.Boolean(nullable: false),
                        LayoutId = c.Long(nullable: false),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Layouts", t => t.LayoutId, cascadeDelete: true)
                .Index(t => t.LayoutId);
            
            CreateTable(
                "dbo.TemplateItems",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        ItemType = c.Int(nullable: false),
                        Html = c.String(),
                        TemplateId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.TemplateId, cascadeDelete: true)
                .Index(t => t.TemplateId);
            
            CreateTable(
                "dbo.ReportElements",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        ReportId = c.Long(nullable: false),
                        ReportPageDefinitionId = c.Long(nullable: false),
                        Position_X = c.Int(nullable: false),
                        Position_Y = c.Int(nullable: false),
                        Position_Z = c.Int(nullable: false),
                        Size_Width = c.Int(nullable: false),
                        Size_Height = c.Int(nullable: false),
                        QuestionAlias = c.String(),
                        DisplaySummaryTabular = c.Boolean(),
                        ChartType = c.Int(),
                        Text = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ReportPages", t => t.ReportPageDefinitionId, cascadeDelete: true)
                .Index(t => t.ReportPageDefinitionId);
            
            CreateTable(
                "dbo.ReportEditedLabels",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        ReportElementHasQuestionId = c.Long(nullable: false),
                        OriginalContent = c.String(),
                        LatestContent = c.String(),
                        Position = c.Int(nullable: false),
                        ReportEditedLabelType = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ReportElements", t => t.ReportElementHasQuestionId, cascadeDelete: true)
                .Index(t => t.ReportElementHasQuestionId);
            
            CreateTable(
                "dbo.Reports",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 255),
                        Created = c.DateTime(),
                        Modified = c.DateTime(),
                        SurveyId = c.Long(nullable: false),
                        UserId = c.String(),
                        Type = c.Short(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ReportPages",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        ReportId = c.Long(nullable: false),
                        Position = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ResourceItems",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Language = c.String(),
                        Text = c.String(nullable: false),
                        ResourceStringId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Resources", t => t.ResourceStringId, cascadeDelete: true)
                .Index(t => t.ResourceStringId);
            
            CreateTable(
                "dbo.Resources",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        SurveyId = c.Long(),
                        Name = c.String(nullable: false, maxLength: 30),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, name: "ix_ResourceString_Name");
            
            CreateTable(
                "dbo.Surveys",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        SurveySettingsId = c.Long(nullable: false),
                        TopFolderId = c.Long(),
                        Name = c.String(),
                        Status = c.Int(nullable: false),
                        Created = c.DateTime(),
                        Modified = c.DateTime(),
                        LastPublished = c.DateTime(),
                        LayoutId = c.Long(nullable: false),
                        UserId = c.String(),
                        ThemeId = c.Long(nullable: false),
                        RowVersion = c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SurveySettings", t => t.SurveySettingsId, cascadeDelete: true)
                .ForeignKey("dbo.Nodes", t => t.TopFolderId)
                .Index(t => t.SurveySettingsId)
                .Index(t => t.TopFolderId);
            
            CreateTable(
                "dbo.SurveySettings",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        EnableBackButton = c.Boolean(nullable: false),
                        ResumeRespondentWhereLeftOff = c.Boolean(nullable: false),
                        InvitationOnlySurvey = c.Boolean(nullable: false),
                        KeyboardSupport = c.Boolean(nullable: false),
                        DefaultLanguage = c.String(),
                        Languages = c.String(),
                        DisplayProgressBar = c.Boolean(nullable: false),
                        ShowRequiredStar = c.Boolean(nullable: false),
                        RowVersion = c.Binary(),
                        NextButtonTextId = c.Long(),
                        PreviousButtonTextId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.LanguageStrings", t => t.NextButtonTextId)
                .ForeignKey("dbo.LanguageStrings", t => t.PreviousButtonTextId)
                .Index(t => t.NextButtonTextId)
                .Index(t => t.PreviousButtonTextId);
            
            CreateTable(
                "dbo.SurveyVersions",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        SurveyId = c.Long(nullable: false),
                        SerializedString = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Themes",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 30),
                        Logo = c.String(),
                        Font = c.String(),
                        BackgroundImage = c.String(),
                        InactiveOpacity = c.Single(nullable: false),
                        BackgroundColor = c.String(),
                        QuestionTitleColor = c.String(),
                        QuestionDescriptionColor = c.String(),
                        QuestionContentColor = c.String(),
                        ButtonColor = c.String(),
                        ErrorColor = c.String(),
                        IsDefault = c.Boolean(nullable: false),
                        Type = c.Int(nullable: false),
                        UserId = c.String(),
                        RowVersion = c.Binary(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Surveys", "TopFolderId", "dbo.Nodes");
            DropForeignKey("dbo.Surveys", "SurveySettingsId", "dbo.SurveySettings");
            DropForeignKey("dbo.SurveySettings", "PreviousButtonTextId", "dbo.LanguageStrings");
            DropForeignKey("dbo.SurveySettings", "NextButtonTextId", "dbo.LanguageStrings");
            DropForeignKey("dbo.ResourceItems", "ResourceStringId", "dbo.Resources");
            DropForeignKey("dbo.ReportElements", "ReportPageDefinitionId", "dbo.ReportPages");
            DropForeignKey("dbo.ReportEditedLabels", "ReportElementHasQuestionId", "dbo.ReportElements");
            DropForeignKey("dbo.Templates", "LayoutId", "dbo.Layouts");
            DropForeignKey("dbo.TemplateItems", "TemplateId", "dbo.Templates");
            DropForeignKey("dbo.Nodes", "TrueFolderId", "dbo.Nodes");
            DropForeignKey("dbo.Nodes", "FalseFolderId", "dbo.Nodes");
            DropForeignKey("dbo.Nodes", "ExpressionId", "dbo.Expressions");
            DropForeignKey("dbo.Nodes", "GoToFolderNodeId", "dbo.Nodes");
            DropForeignKey("dbo.Nodes", "OptionListId", "dbo.OptionLists");
            DropForeignKey("dbo.Options", "ListId", "dbo.OptionLists");
            DropForeignKey("dbo.Options", "TextId", "dbo.LanguageStrings");
            DropForeignKey("dbo.Options", "OtherQuestionDefinitionId", "dbo.Questions");
            DropForeignKey("dbo.Questions", "LikertRightTextId", "dbo.LanguageStrings");
            DropForeignKey("dbo.Questions", "LikertLeftTextId", "dbo.LanguageStrings");
            DropForeignKey("dbo.Questions", "LikertCenterTextId", "dbo.LanguageStrings");
            DropForeignKey("dbo.Questions", "SubQuestionDefinitionId", "dbo.Questions");
            DropForeignKey("dbo.Questions", "ParentQuestionId", "dbo.Questions");
            DropForeignKey("dbo.Questions", "OptionListId", "dbo.OptionLists");
            DropForeignKey("dbo.QuestionValidators", "QuestionDefinitionId", "dbo.Questions");
            DropForeignKey("dbo.QuestionValidators", "ErrorMessage_Id", "dbo.LanguageStrings");
            DropForeignKey("dbo.Questions", "TitleId", "dbo.LanguageStrings");
            DropForeignKey("dbo.Questions", "QuestionMaskExpressionId", "dbo.Expressions");
            DropForeignKey("dbo.SkipCommands", "PageDefinitionId", "dbo.Nodes");
            DropForeignKey("dbo.SkipCommands", "ExpressionId", "dbo.Expressions");
            DropForeignKey("dbo.ExpressionItems", "ExpressionId", "dbo.Expressions");
            DropForeignKey("dbo.Questions", "PageDefinitionId", "dbo.Nodes");
            DropForeignKey("dbo.Questions", "DecriptionId", "dbo.LanguageStrings");
            DropForeignKey("dbo.LanguageStringItems", "LanguageStringId", "dbo.LanguageStrings");
            DropForeignKey("dbo.Nodes", "ParentId", "dbo.Nodes");
            DropIndex("dbo.SurveySettings", new[] { "PreviousButtonTextId" });
            DropIndex("dbo.SurveySettings", new[] { "NextButtonTextId" });
            DropIndex("dbo.Surveys", new[] { "TopFolderId" });
            DropIndex("dbo.Surveys", new[] { "SurveySettingsId" });
            DropIndex("dbo.Resources", "ix_ResourceString_Name");
            DropIndex("dbo.ResourceItems", new[] { "ResourceStringId" });
            DropIndex("dbo.ReportEditedLabels", new[] { "ReportElementHasQuestionId" });
            DropIndex("dbo.ReportElements", new[] { "ReportPageDefinitionId" });
            DropIndex("dbo.TemplateItems", new[] { "TemplateId" });
            DropIndex("dbo.Templates", new[] { "LayoutId" });
            DropIndex("dbo.QuestionValidators", new[] { "ErrorMessage_Id" });
            DropIndex("dbo.QuestionValidators", new[] { "QuestionDefinitionId" });
            DropIndex("dbo.ExpressionItems", new[] { "ExpressionId" });
            DropIndex("dbo.SkipCommands", new[] { "ExpressionId" });
            DropIndex("dbo.SkipCommands", new[] { "PageDefinitionId" });
            DropIndex("dbo.LanguageStringItems", new[] { "LanguageStringId" });
            DropIndex("dbo.Questions", new[] { "LikertRightTextId" });
            DropIndex("dbo.Questions", new[] { "LikertLeftTextId" });
            DropIndex("dbo.Questions", new[] { "LikertCenterTextId" });
            DropIndex("dbo.Questions", new[] { "SubQuestionDefinitionId" });
            DropIndex("dbo.Questions", new[] { "ParentQuestionId" });
            DropIndex("dbo.Questions", new[] { "OptionListId" });
            DropIndex("dbo.Questions", new[] { "TitleId" });
            DropIndex("dbo.Questions", new[] { "QuestionMaskExpressionId" });
            DropIndex("dbo.Questions", new[] { "DecriptionId" });
            DropIndex("dbo.Questions", new[] { "PageDefinitionId" });
            DropIndex("dbo.Options", new[] { "TextId" });
            DropIndex("dbo.Options", new[] { "OtherQuestionDefinitionId" });
            DropIndex("dbo.Options", new[] { "ListId" });
            DropIndex("dbo.Nodes", new[] { "TrueFolderId" });
            DropIndex("dbo.Nodes", new[] { "FalseFolderId" });
            DropIndex("dbo.Nodes", new[] { "ExpressionId" });
            DropIndex("dbo.Nodes", new[] { "GoToFolderNodeId" });
            DropIndex("dbo.Nodes", new[] { "OptionListId" });
            DropIndex("dbo.Nodes", new[] { "ParentId" });
            DropTable("dbo.Themes");
            DropTable("dbo.SurveyVersions");
            DropTable("dbo.SurveySettings");
            DropTable("dbo.Surveys");
            DropTable("dbo.Resources");
            DropTable("dbo.ResourceItems");
            DropTable("dbo.ReportPages");
            DropTable("dbo.Reports");
            DropTable("dbo.ReportEditedLabels");
            DropTable("dbo.ReportElements");
            DropTable("dbo.TemplateItems");
            DropTable("dbo.Templates");
            DropTable("dbo.Layouts");
            DropTable("dbo.QuestionValidators");
            DropTable("dbo.ExpressionItems");
            DropTable("dbo.Expressions");
            DropTable("dbo.SkipCommands");
            DropTable("dbo.LanguageStringItems");
            DropTable("dbo.LanguageStrings");
            DropTable("dbo.Questions");
            DropTable("dbo.Options");
            DropTable("dbo.OptionLists");
            DropTable("dbo.Nodes");
        }
    }
}
