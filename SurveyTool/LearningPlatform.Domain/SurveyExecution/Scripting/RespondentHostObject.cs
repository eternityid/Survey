using Autofac;
using LearningPlatform.Domain.SurveyExecution.Request;
using Newtonsoft.Json.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public class RespondentHostObject
    {
        private readonly string _key;
        private readonly IComponentContext _componentContext;

        public RespondentHostObject(string key, IComponentContext componentContext)
        {
            _key = key;
            _componentContext = componentContext;
        }

        private IRequestContext RequestContext
        {
            get { return _componentContext.Resolve<IRequestContext>(); }
        }

        private string GetValueFromKey(string customColumn, string key)
        {
            if (string.IsNullOrEmpty(customColumn)) return string.Empty;

            JObject json = JObject.Parse(customColumn);
            if (json == null) return string.Empty;

            JToken propertyValue;
            if (json.TryGetValue(key, out propertyValue)) {
                return propertyValue.Value<string>();
            }
            return string.Empty;
        }

        public string GetValue()
        {
            return GetValueFromKey(RequestContext.Respondent.CustomColumns, _key);
        }
    }

}