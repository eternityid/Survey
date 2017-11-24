using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition
{
    public class ExportContractResolver : CamelCasePropertyNamesContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            //TODO: Consider to remove properties with JSON ignore on properties except id/Id.
            JsonProperty property = base.CreateProperty(member, memberSerialization);
            property.ShouldSerialize = instance => (!property.PropertyName.EndsWith("id") || property.PropertyName.Equals("maxPicturesInGrid"))
                                                   && !property.PropertyName.EndsWith("Id")
                                                   && !property.PropertyName.Equals("version")
                                                   && !property.PropertyName.Equals("rowVersion")
                                                   && !property.PropertyName.Equals("operatorString")
                                                   && !property.PropertyName.Equals("logicalOperatorString");
            return property;
        }
    }
}