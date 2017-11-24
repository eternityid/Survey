using System.Data.Entity;
using LearningPlatform.Data.EntityFramework.Mapping.SurveysContext;
using LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Nodes;
using LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Questions;
using LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.QuestionValidators;
using LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Reports;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;
using LearningPlatform.Domain.ReportDesign.ReportElements;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.Validation;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.Domain.SurveyThemes;
using LearningPlatform.Domain.SurveyDesign.Pages;
using System.Data.Entity.Validation;

namespace LearningPlatform.Data.EntityFramework.SurveysDb
{
    public class SurveysContext : DbContext
    {
        static SurveysContext()
        {
            Database.SetInitializer(new SurveysContextInitializer());
        }

        public SurveysContext()
            : base("Name=SurveysContext")
        {
        }

        public DbSet<Condition> Conditions { get; set; }
        public DbSet<Folder> Folder { get; set; }
        public DbSet<Node> Nodes { get; set; }
        public DbSet<PageDefinition> PageDefinitions { get; set; }
        public DbSet<SkipCommand> SkipCommand { get; set; }
        public DbSet<Expression> Expressions { get; set; }
        public DbSet<ExpressionItem> ExpressionItems { get; set; }
        public DbSet<QuestionDefinition> QuestionDefinitions { get; set; }
        public DbSet<QuestionWithOptionsDefinition> QuestionWithOptionsDefinitions { get; set; }
        public DbSet<SingleSelectionQuestionDefinition> SingleSelectionQuestionDefinitions { get; set; }
        public DbSet<LanguageString> LanguageStrings { get; set; }
        public DbSet<GridQuestionDefinition> GridQuestionDefinitions { get; set; }

        public DbSet<QuestionValidation> QuestionValidations { get; set; }
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<SurveySettings> SurveySettings { get; set; }
        public DbSet<OptionList> OptionLists { get; set; }
        public DbSet<Option> Options { get; set; }
        public DbSet<OptionGroup> OptionGroups { get; set; }
        public DbSet<Layout> Layouts { get; set; }
        public DbSet<Template> Templates { get; set; }

        public DbSet<Theme> Themes { get; set; }
        public DbSet<SurveyVersion> SurveyVersions { get; set; }

        public DbSet<ReportDefinition> ReportDefinitions { get; set; }
        public DbSet<ReportPageDefinition> ReportPageDefinitions { get; set; }
        public DbSet<ReportElementDefinition> ReportElementDefinitions { get; set; }
        public DbSet<ReportElementHasQuestion> ReportElementHasQuestions { get; set; }
        public DbSet<ReportChartElement> ReportChartElements { get; set; }
        public DbSet<ReportTableElement> ReportTableElements { get; set; }
        public DbSet<ReportTextElement> ReportTextElements { get; set; }
        public DbSet<ReportEditedLabelDefinition> ReportEditedLabelDefinitions { get; set; }

        public DbSet<ResourceString> ResourceStrings { get; set; }
        public DbSet<ResourceStringItem> ResourceStringItems { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new SurveyMap());
            modelBuilder.Configurations.Add(new SurveySettingsMap());
            modelBuilder.Configurations.Add(new SurveyVersionsMap());

            modelBuilder.Configurations.Add(new NodeMap());
            modelBuilder.Configurations.Add(new LoopDefinitionMap());
            modelBuilder.Configurations.Add(new GoToFolderMap());
            modelBuilder.Configurations.Add(new SkipCommandMap());
            modelBuilder.Configurations.Add(new ScriptMap());
            modelBuilder.Configurations.Add(new FolderMap());
            modelBuilder.Configurations.Add(new PageDefinitionMap());
            modelBuilder.Configurations.Add(new ConditionMap());

            modelBuilder.Configurations.Add(new QuestionDefinitionMap());
            modelBuilder.Configurations.Add(new QuestionDefinitionWithOptionsMap());
            modelBuilder.Configurations.Add(new SingleSelectionQuestionDefinitionMap());
            modelBuilder.Configurations.Add(new MatrixQuestionDefinitionMap());
            modelBuilder.Configurations.Add(new GridQuestionDefinitionMap());

            modelBuilder.Configurations.Add(new PictureSingleSelectionQuestionDefinitionMap());
            modelBuilder.Configurations.Add(new PictureMultipleSelectionQuestionDefinitionMap());


            modelBuilder.Configurations.Add(new OptionMap());

            modelBuilder.Configurations.Add(new OptionListMap());
            modelBuilder.Configurations.Add(new OptionGroupMap());
            modelBuilder.Configurations.Add(new LanguageStringMap());
            modelBuilder.Configurations.Add(new LanguageStringItemMap());

            modelBuilder.Configurations.Add(new QuestionValidationMap());
            modelBuilder.Configurations.Add(new MinMaxValidationMap());
            modelBuilder.Configurations.Add(new RequiredValidationMap());
            modelBuilder.Configurations.Add(new RegularExpressionValidationMap());
            modelBuilder.Configurations.Add(new RangeNumberValidationMap());
            modelBuilder.Configurations.Add(new DecimalPlacesNumberValidationMap());

            modelBuilder.Configurations.Add(new LayoutMap());
            modelBuilder.Configurations.Add(new TemplateMap());
            modelBuilder.Configurations.Add(new ResourceStringMap());
            modelBuilder.Configurations.Add(new ResourceStringItemMap());
            modelBuilder.Configurations.Add(new ExpressionMap());
            modelBuilder.Configurations.Add(new ThemeMap());

            modelBuilder.Configurations.Add(new ReportDefinitionMap());
            modelBuilder.Configurations.Add(new ReportPageDefinitionMap());
            modelBuilder.Configurations.Add(new ReportElementDefinitionMap());
            modelBuilder.Configurations.Add(new ReportElementHasQuestionMap());
            modelBuilder.Configurations.Add(new ReportEditedLabelDefinitionMap());
        }

        public override int SaveChanges()
        {
            try
            {
                var ret = base.SaveChanges();

                return ret;
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    var msg = string.Format("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        msg += "---" + string.Format("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
    }
}
