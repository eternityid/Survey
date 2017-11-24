using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;

namespace LearningPlatform.Domain.Common
{
    public class TypeNameSerializationBinder : SerializationBinder
    {

        private readonly Dictionary<string, Type> _types = new Dictionary<string, Type>();
        private Dictionary<Type, string> _names = new Dictionary<Type, string>();

        private readonly string _namespaceName;
        private readonly string[] _excludedNamespaces = { "LearningPlatform.Domain.SurveyExecution" };

        public TypeNameSerializationBinder()
        {
            var assembly = Assembly.GetAssembly(GetType());
            _namespaceName = assembly.GetName().Name;

            foreach (var type in assembly.GetTypes().Where(t => t.IsPublic && !t.IsInterface & !t.IsAbstract))
            {
                bool excluded = _types.ContainsKey(type.Name) || _excludedNamespaces.Any(excludedNamespace => type.Namespace != null && type.Namespace.StartsWith(excludedNamespace));
                if (!excluded)
                {
                    _types[type.Name] = type;
                    _names[type] = type.Name;
                }
            }
        }

        public override void BindToName(Type serializedType, out string assemblyName, out string typeName)
        {
            string name;

            if (_names.TryGetValue(serializedType, out name))
            {
			    assemblyName = null;
                typeName = name;
            }
            else
            {
                assemblyName = serializedType.Assembly.FullName;
                typeName = serializedType.FullName;
            }
        }

        public override Type BindToType(string assemblyName, string typeName)
        {
            Type result;
            if (_types.TryGetValue(typeName, out result))
                return result;

            return Type.GetType($"{typeName}, {assemblyName}");
        }
    }
}