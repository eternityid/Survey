using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition
{
    public class ImportContractResolver : DefaultContractResolver
    {
        private readonly string _surveyId;

        public ImportContractResolver(string surveyId)
        {
            _surveyId = surveyId;
        }

        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            JsonProperty property = base.CreateProperty(member, memberSerialization);
            if (property.PropertyName == "SurveyId")
            {
                property.DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate;
                property.DefaultValue = _surveyId;
            }

            return property;
        }
    }
}