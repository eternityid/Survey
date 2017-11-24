using System.Diagnostics;
using LearningPlatform.Data.EntityFramework.ResponsesDb;
using LearningPlatform.Domain.Common;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    public class ResponsesContextProvider
    {
        private readonly IRequestObjectProvider<ResponsesContext> _requestResponseContext;
        private readonly IRequestObjectProvider<TestResponsesContext> _testRequestResponseContext;

        public ResponsesContextProvider(IRequestObjectProvider<ResponsesContext> requestResponseContext, IRequestObjectProvider<TestResponsesContext> testRequestResponseContext)
        {
            _requestResponseContext = requestResponseContext;
            _testRequestResponseContext = testRequestResponseContext;
        }


        public ResponsesContext Get(bool isTesting)
        {
            ResponsesContext context = isTesting ? _testRequestResponseContext.Get() : _requestResponseContext.Get();
            if (context == null)
            {
                context = isTesting? new TestResponsesContext() : new ResponsesContext();
                context.Configuration.LazyLoadingEnabled = false;
                context.Configuration.ProxyCreationEnabled = false;
                context.Database.Log = Logger;
                if (isTesting)
                {
                    _testRequestResponseContext.Set((TestResponsesContext) context);
                }
                else
                {
                    _requestResponseContext.Set(context);
                }
            }
            return context;
        }

        private static void Logger(string obj)
        {
            Debug.WriteLine(obj);
        }
    }
}