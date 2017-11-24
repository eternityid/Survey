using System;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.Practices.Unity;


namespace LearningPlatform.Domain.SurveyDesign
{
    public class CustomScriptValidator
    {
        private readonly IRequestObjectProvider<IRequestContext> _requestObjectProvider;

        public CustomScriptValidator(IRequestObjectProvider<IRequestContext> requestObjectProvider)
        {
            _requestObjectProvider = requestObjectProvider;
        }

        public string EvaluateCode<T>(string scriptCode)
        {
            _requestObjectProvider.Set(new RequestContext{Survey = new Survey{Id=1}});
            var scriptExecutor = NoOperationScriptingContainerInstance.Resolve<IScriptExecutor>();
            try
            {
                scriptExecutor.EvaluateCode<T>(scriptCode);
            }
            catch (Exception e)
            {

                return e.Message;
            }
            return null;
        }

        private static IUnityContainer NoOperationScriptingContainerInstance
        {
            get { return Unity.NoOperationScriptingContainerInstance; }
        }
    }
}