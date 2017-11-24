using Autofac;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;

namespace LearningPlatform.Domain.Common
{
    public class AutofacContractResolver : CamelCasePropertyNamesContractResolver
    {
        private readonly IComponentContext _componentContext;

        public AutofacContractResolver(IComponentContext componentContext)
        {
            _componentContext = componentContext;
        }

        protected override JsonObjectContract CreateObjectContract(Type objectType)
        {
            JsonObjectContract contract = base.CreateObjectContract(objectType);
            contract.DefaultCreator = () => _componentContext.Resolve(objectType);
            return contract;
        }
    }
    public static class JsonSerializerSettingsFactory
    {
        public static JsonSerializerSettings Create(IComponentContext componentContext)
        {
            var settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.Objects,
                Binder = new TypeNameSerializationBinder(),
                ContractResolver = new AutofacContractResolver(componentContext)
            };
            return settings;
        }
    }
}