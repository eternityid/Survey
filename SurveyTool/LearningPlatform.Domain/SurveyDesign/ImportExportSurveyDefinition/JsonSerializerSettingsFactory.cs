using LearningPlatform.Domain.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition
{
    public static class JsonSerializerSettingsFactory
    {
        public static JsonSerializerSettings CreateForImport(string surveyId, DeferredPropertyUpdates deferredPropertyUpdates)
        {
            var contractResolver = new ImportContractResolver(surveyId);
            var converter = new ImportJsonConverter(deferredPropertyUpdates);
            return Create(contractResolver, converter);
        }

        public static JsonSerializerSettings CreateForExport(NodeService nodeService)
        {
            var contractResolver = new ExportContractResolver();
            var converter = new ExportJsonConverter(nodeService);
            return Create(contractResolver, converter);
        }

        internal static JsonSerializerSettings Create()
        {
            return Create(null, null);
        }

        private static JsonSerializerSettings Create(DefaultContractResolver contractResolver, JsonConverter converter)
        {
            var settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.Auto,
                Binder = new TypeNameSerializationBinder(),
                ContractResolver = contractResolver,
                Converters = new List<JsonConverter> { new Newtonsoft.Json.Converters.StringEnumConverter()},
                DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate,
            };
            if(converter!=null) settings.Converters.Add(converter);
            return settings;
        }

    }


}
