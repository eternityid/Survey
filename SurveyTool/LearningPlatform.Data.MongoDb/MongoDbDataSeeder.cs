using Autofac;
using LearningPlatform.Data.MongoDb.DemoData;
using LearningPlatform.Domain.AccessControl;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.DefaultData.Layouts;
using LearningPlatform.Domain.DefaultData.Templates;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyThemes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using LearningPlatform.Domain.Libraries;

namespace LearningPlatform.Data.MongoDb
{
    public sealed class MongoDbDataSeeder : IDataSeeder
    {
        public void Seed(IContainer container)
        {
            var mongoDbContext = GetMongoDbContext(container);
            mongoDbContext.EnsureIndexes();

            SeedSystemLayouts(mongoDbContext.LayoutCollection);
            SeedSystemThemes(mongoDbContext.ThemeCollection);
            SeedSurveys(container, mongoDbContext.SurveyCollection);
            SeedCompanies(mongoDbContext.CompanyCollection);
            SeedLibraries(mongoDbContext.LibraryCollection);
        }

        private MongoDbContext GetMongoDbContext(IContainer container)
        {
            var mongoDbContextProvider = container.Resolve<IRequestObjectProvider<MongoDbContext>>();
            var mongoDbContext = mongoDbContextProvider.Get();
            if (mongoDbContext == null)
            {
                mongoDbContext = new MongoDbContext();
                mongoDbContextProvider.Set(mongoDbContext);
            }
            return mongoDbContext;
        }

        private void SeedSystemLayouts(IMongoCollection<Layout> layoutCollection)
        {
            if (layoutCollection.Count(Builders<Layout>.Filter.Empty) != 0) return;

            var defaultLayout = DefaultLayoutDefinitionFactory.Create("000000000000000000000001",
             "Default Layout", "defaultLayout.css", TemplatesForDefaultLayout.GetTemplateData());
            var layoutWithContainer =
                DefaultLayoutDefinitionFactory.Create("000000000000000000000002",
                    "Layout With Container", "layoutWithContainer.css",
                    TemplatesForLayoutWithContainer.GetTemplateData());
            layoutCollection.InsertMany(new List<Layout>
            {
                defaultLayout,
                layoutWithContainer
            });
        }

        private void SeedSystemThemes(IMongoCollection<Theme> themeCollection)
        {
            if (themeCollection.Count(Builders<Theme>.Filter.Empty) != 0) return;

            #region System Themes
            var greenTheme = new Theme
            {
                Id = "000000000000000000000001",
                Name = "Green",
                Logo = "logo.png",
                Font = "Arial",
                BackgroundImage = "background.jpg",
                InactiveOpacity = (float?)0.4,
                BackgroundColor = "#65b8bb",
                QuestionTitleColor = "#ffffff",
                QuestionDescriptionColor = "#085f64",
                QuestionContentColor = "#ffffff",
                PrimaryButtonBackgroundColor = "#085f64",
                ErrorColor = "#f73838",
                IsDefault = true,
                Type = ThemeType.System,
                PrimaryButtonColor = "#ffffff",
                DefaultButtonBackgroundColor = "#ffffff",
                DefaultButtonColor = "#000000",
                ErrorBackgroundColor = "#7cc2c5",
                InputFieldBackgroundColor = "transparent",
                IsRepeatBackground = true,
                InputFieldColor = "#ffffff",
                PageContainerBackgroundColor = "#ffffff",
                PageContainerBackgroundOpacity = (float?)0.25
            };
            var redTheme = new Theme
            {
                Id = "000000000000000000000002",
                Name = "Red",
                Logo = "logo.png",
                Font = "Georgia",
                BackgroundImage = "background.jpg",
                InactiveOpacity = (float?)0.4,
                BackgroundColor = "#d58080",
                QuestionTitleColor = "#ffffff",
                QuestionDescriptionColor = "#a93030",
                QuestionContentColor = "#ffffff",
                PrimaryButtonBackgroundColor = "#f1982f",
                ErrorColor = "#f3e47d",
                IsDefault = false,
                Type = ThemeType.System,
                PrimaryButtonColor = "#ffffff",
                DefaultButtonBackgroundColor = "#ffffff",
                DefaultButtonColor = "#000000",
                ErrorBackgroundColor = "#7cc2c5",
                InputFieldBackgroundColor = "transparent",
                IsRepeatBackground = true,
                InputFieldColor = "#ffffff",
                PageContainerBackgroundColor = "#ffffff",
                PageContainerBackgroundOpacity = (float?)0.25
            };
            var blueTheme = new Theme
            {
                Id = "000000000000000000000003",
                Name = "Blue",
                Logo = "logo.png",
                Font = "Helvetica Neue",
                BackgroundImage = "background.jpg",
                InactiveOpacity = (float?)0.5,
                BackgroundColor = "#80b6df",
                QuestionTitleColor = "#ffffff",
                QuestionDescriptionColor = "#a93030",
                QuestionContentColor = "#ffffff",
                PrimaryButtonBackgroundColor = "#f1982f",
                ErrorColor = "#f3e47d",
                IsDefault = false,
                Type = ThemeType.System,
                PrimaryButtonColor = "#ffffff",
                DefaultButtonBackgroundColor = "#ffffff",
                DefaultButtonColor = "#000000",
                ErrorBackgroundColor = "#7cc2c5",
                InputFieldBackgroundColor = "transparent",
                IsRepeatBackground = true,
                InputFieldColor = "#ffffff",
                PageContainerBackgroundColor = "#ffffff",
                PageContainerBackgroundOpacity = (float?)0.25
            };
            var whiteTheme = new Theme
            {
                Id = "000000000000000000000004",
                Name = "White",
                Logo = "logo.png",
                Font = "Tahoma",
                BackgroundImage = "background.jpg",
                InactiveOpacity = (float?)0.5,
                BackgroundColor = "#ffffff",
                QuestionTitleColor = "#71a5cc",
                QuestionDescriptionColor = "#c5c5c5",
                QuestionContentColor = "#333333",
                PrimaryButtonBackgroundColor = "#71a5cc",
                ErrorColor = "#ff9642",
                IsDefault = false,
                Type = ThemeType.System,
                PrimaryButtonColor = "#000000",
                DefaultButtonBackgroundColor = "#ffffff",
                DefaultButtonColor = "#000000",
                ErrorBackgroundColor = "#777777",
                InputFieldBackgroundColor = "transparent",
                IsRepeatBackground = true,
                InputFieldColor = "#333333",
                PageContainerBackgroundColor = "#ffffff",
                PageContainerBackgroundOpacity = 1
            };
            var blackTheme = new Theme
            {
                Id = "000000000000000000000005",
                Name = "Black",
                Logo = "logo.png",
                Font = "TimesNewRoman",
                BackgroundImage = "background.jpg",
                InactiveOpacity = (float?)0.3,
                BackgroundColor = "#252525",
                QuestionTitleColor = "#ff6c6c",
                QuestionDescriptionColor = "#7e7e7e",
                QuestionContentColor = "#ffffff",
                PrimaryButtonBackgroundColor = "#ff6c6c",
                ErrorColor = "#f73838",
                IsDefault = false,
                Type = ThemeType.System,
                PrimaryButtonColor = "#000000",
                DefaultButtonBackgroundColor = "#ffffff",
                DefaultButtonColor = "#000000",
                ErrorBackgroundColor = "#454545",
                InputFieldBackgroundColor = "transparent",
                IsRepeatBackground = true,
                InputFieldColor = "#ffffff",
                PageContainerBackgroundColor = "#484848",
                PageContainerBackgroundOpacity = (float?)0.8
            };
            #endregion
            themeCollection.InsertMany(new List<Theme>
            {
                greenTheme,
                redTheme,
                blueTheme,
                whiteTheme,
                blackTheme
            });
        }

        private void SeedSurveys(IComponentContext componentContext, IMongoCollection<Survey> surveyCollection)
        {
            if (surveyCollection.Count(Builders<Survey>.Filter.Empty) != 0) return;

            componentContext.Resolve<SimpleSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<ComplexSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<LoopSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<CarryOverOptionsSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<QuestionExpressionMaskDemo>().InsertData();
            componentContext.Resolve<UiTestKeyboardSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<SkipSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<ConditionSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<NestedLoopSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<E2ESurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<AlphabeticalOptionOrderingSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<RegexValidationSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<OptionGroupSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<TextListSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<CustomNavigationTextSurveyDefinitionDemo>().InsertData();
            componentContext.Resolve<LanguageSelectionSurveyDefinitionDemo>().InsertData();
        }

        private void SeedCompanies(IMongoCollection<Company> companyCollection)
        {
            if (companyCollection.Count(Builders<Company>.Filter.Empty) != 0) return;

            var companies = new List<Company>
            {
                new Company { Id = "000000000000000000000001", Name = "Orient Software Development Corp", RegisteredDateTime = DateTime.Now},
                new Company { Id = "000000000000000000000002", Name = "Automobiles Ettore Bugatti", RegisteredDateTime = DateTime.Now},
                new Company { Id = "000000000000000000000003", Name = "Volkswagen Group", RegisteredDateTime = DateTime.Now},
                new Company { Id = "000000000000000000000004", Name = "Tesla", RegisteredDateTime = DateTime.Now}
            };
            companyCollection.InsertMany(companies);
        }

        private void SeedLibraries(IMongoCollection<Library> libraryCollection)
        {
            if (libraryCollection.Count(Builders<Library>.Filter.Where(p => p.Type == LibraryType.System)) > 0) return;

            libraryCollection.InsertOne(new Library
            {
                Id = "000000000000000000000001",
                Type = LibraryType.System,
                UserId = null,
                CreatedDate = DateTime.Now
            });
        }
    }
}
