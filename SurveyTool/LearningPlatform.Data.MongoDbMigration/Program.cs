using Autofac;
using LearningPlatform.Data.MongoDb;
using LearningPlatform.Data.MongoDbMigration.Converters;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using MongoDB.Driver;
using System;
using System.Linq;

namespace LearningPlatform.Data.MongoDbMigration
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine($"========== START: {DateTime.Now} ==========");

            var builder = new ContainerBuilder();
            builder.RegisterModule<ProgramModule>();

            var container = builder.Build();
            var containers = container.Resolve<Containers>();
            var mongDbContext = containers.MongoDbContainer.Resolve<IRequestObjectProvider<MongoDbContext>>().Get();

            mongDbContext.EnsureIndexes();

            ConvertDatabase(container);

            var surveyReaderService = containers.MongoDbContainer.Resolve<ReadSurveyService>();

            var surveyIds = mongDbContext.SurveyCollection.AsQueryable().Select(s => s.Id).ToList();

            foreach (var surveyId in surveyIds)
            {
                var survey = surveyReaderService.GetFullSurvey(surveyId);
            }

            Console.WriteLine($"========== END: {DateTime.Now} ==========");
        }

        private static void ConvertDatabase(IContainer container)
        {
            Console.WriteLine("Converting Survey Versions");
            var surveyVersionConverter = container.Resolve<SurveyVersionConverter>();
            surveyVersionConverter.Convert();

            Console.WriteLine("Converting Reports");
            var reportConverter = container.Resolve<ReportConverter>();
            reportConverter.Convert();

            Console.WriteLine("Converting Respondents, Answers");
            var respondentAndAnswerConverter = container.Resolve<RespondentAndAnswerConverter>();
            respondentAndAnswerConverter.Convert();

            Console.WriteLine("Converting Layouts");
            var layoutConverter = container.Resolve<LayoutConverter>();
            layoutConverter.Convert();

            Console.WriteLine("Converting Themes");
            var themeConverter = container.Resolve<ThemeConverter>();
            themeConverter.Convert();

            Console.WriteLine("Converting Surveys");
            var surveyConverter = container.Resolve<SurveyConverter>();
            surveyConverter.Convert();
        }
    }
}
