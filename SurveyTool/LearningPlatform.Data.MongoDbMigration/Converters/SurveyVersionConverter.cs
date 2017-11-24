using Autofac;
using LearningPlatform.Data.EntityFramework.Repositories;
using LearningPlatform.Domain.Helpers;
using System.Linq;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class SurveyVersionConverter
    {
        private readonly Containers _containers;

        public SurveyVersionConverter(Containers containers)
        {
            _containers = containers;
        }

        public void Convert()
        {
            var surveysContext = _containers.EntityFrameworkContainer.Resolve<SurveysContextProvider>().Get();

            var surveyIds = surveysContext.SurveyVersions.Select(p => p.SurveyId).Distinct().ToList();

            using (var transaction = surveysContext.Database.BeginTransaction())
            {
                foreach (var surveyId in surveyIds)
                {
                    surveysContext.Database.ExecuteSqlCommand($"UPDATE [dbo].[SurveyVersions] SET [SurveyId]='{ObjectIdHelper.GetObjectIdFromLongString(surveyId)}' WHERE [SurveyId]='{surveyId}'");
                }

                surveysContext.SaveChanges();
                transaction.Commit();
            }
        }
    }
}
