using System.Diagnostics;
using LearningPlatform.Domain.Common;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    public class SurveysContextProvider
    {
        private readonly IRequestObjectProvider<SurveysDb.SurveysContext> _requestSurveyContext;

        public SurveysContextProvider(IRequestObjectProvider<SurveysDb.SurveysContext> requestSurveyContext)
        {
            _requestSurveyContext = requestSurveyContext;
        }


        public SurveysDb.SurveysContext Get()
        {
            var context = _requestSurveyContext.Get();
            if (context == null)
            {
                context = new SurveysDb.SurveysContext();
                context.Configuration.LazyLoadingEnabled = false;
                context.Configuration.ProxyCreationEnabled = false;
                context.Database.Log = Logger;
                _requestSurveyContext.Set(context);
            }
            return context;
        }

        private static void Logger(string obj)
        {
            Debug.WriteLine(obj);
        }
    }
}