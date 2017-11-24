using Autofac;
using LearningPlatform.Data.EntityFramework.Repositories;
using LearningPlatform.Data.EntityFramework.ResponsesDb;
using LearningPlatform.Domain.Helpers;
using System;
using System.Linq;

namespace LearningPlatform.Data.MongoDbMigration.Converters
{
    public class RespondentAndAnswerConverter
    {
        private readonly Containers _containers;

        public RespondentAndAnswerConverter(Containers containers)
        {
            _containers = containers;
        }

        public void Convert()
        {
            var responsesContextProvider = _containers.EntityFrameworkContainer.Resolve<ResponsesContextProvider>();
            var responsesContext = responsesContextProvider.Get(isTesting: false);
            var testResponsesContext = responsesContextProvider.Get(isTesting: true);

            ConvertRespondentsAndAnswers(responsesContext);
            ConvertTestRespondentsAndTestAnswers(testResponsesContext);
        }

        private void ConvertRespondentsAndAnswers(ResponsesContext context)
        {
            var surveyIds = context.Respondents.Select(p => p.SurveyId).Distinct().ToList();
            var pageIds = context.Respondents.Select(p => p.CurrentPageId).Distinct().ToList();

            using (var transaction = context.Database.BeginTransaction())
            {
                Console.WriteLine("Converting Respondent.SurveyId");
                foreach (var surveyId in surveyIds)
                {
                    context.Database.ExecuteSqlCommand($"UPDATE [dbo].[Respondents] SET [SurveyId]='{ObjectIdHelper.GetObjectIdFromLongString(surveyId)}' WHERE [SurveyId]='{surveyId}'");
                }

                Console.WriteLine("Converting Respondent.CurrentPageId");
                foreach (var pageId in pageIds)
                {
                    if (pageId != null)
                    {
                        context.Database.ExecuteSqlCommand($"UPDATE [dbo].[Respondents] SET [CurrentPageId]='{ObjectIdHelper.GetObjectIdFromLongString(pageId)}' WHERE [CurrentPageId]='{pageId}'");
                    }
                }

                Console.WriteLine("Converting Answers.SurveyId");
                foreach (var surveyId in surveyIds)
                {
                    context.Database.ExecuteSqlCommand($"UPDATE [dbo].[Answers] SET [SurveyId]='{ObjectIdHelper.GetObjectIdFromLongString(surveyId)}' WHERE [SurveyId]='{surveyId}'");
                }

                context.SaveChanges();
                transaction.Commit();
            }
        }

        private void ConvertTestRespondentsAndTestAnswers(ResponsesContext context)
        {
            var surveyIds = context.Respondents.Select(p => p.SurveyId).Distinct().ToList();
            var pageIds = context.Respondents.Select(p => p.CurrentPageId).Distinct().ToList();

            using (var transaction = context.Database.BeginTransaction())
            {
                Console.WriteLine("Converting TestRespondent.SurveyId");
                foreach (var surveyId in surveyIds)
                {
                    context.Database.ExecuteSqlCommand($"UPDATE [dbo].[TestRespondents] SET [SurveyId]='{ObjectIdHelper.GetObjectIdFromLongString(surveyId)}' WHERE [SurveyId]='{surveyId}'");
                }

                Console.WriteLine("Converting TestRespondent.CurrentPageId");
                foreach (var pageId in pageIds)
                {
                    if (pageId != null)
                    {
                        context.Database.ExecuteSqlCommand($"UPDATE [dbo].[TestRespondents] SET [CurrentPageId]='{ObjectIdHelper.GetObjectIdFromLongString(pageId)}' WHERE [CurrentPageId]='{pageId}'");
                    }
                }

                Console.WriteLine("Converting TestAnswers.SurveyId");
                foreach (var surveyId in surveyIds)
                {
                    context.Database.ExecuteSqlCommand($"UPDATE [dbo].[TestAnswers] SET [SurveyId]='{ObjectIdHelper.GetObjectIdFromLongString(surveyId)}' WHERE [SurveyId]='{surveyId}'");
                }

                context.SaveChanges();
                transaction.Commit();
            }
        }
    }
}
