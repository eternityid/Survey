using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition
{
    public class ExportJsonConverter : JsonConverter
    {
        private readonly NodeService _nodeService;

        public ExportJsonConverter(NodeService nodeService)
        {
            _nodeService = nodeService;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var localSerializer = CreateLocalSerializer();
            JObject jObject = JObject.FromObject(value, localSerializer);
            AddPropertiesToOptionsMask(value as OptionsMask, jObject);
            AddPropertiesToSkipCommand(value as SkipCommand, jObject);
            AddPropertiesToExpressionItem(value as ExpressionItem, jObject);
            jObject.WriteTo(writer);
        }

        private void AddPropertiesToOptionsMask(OptionsMask optionsMask, JObject jObject)
        {
            if (optionsMask != null && optionsMask.QuestionId!=null)
            {
                jObject.Add(new JProperty("carryOverFrom",
                    _nodeService.GetQuestionDefinitionById(optionsMask.QuestionId).Alias));
            }
        }

        private void AddPropertiesToSkipCommand(SkipCommand skipCommand, JObject jObject)
        {
            if (skipCommand != null)
            {
                var i = 0;
                foreach (var item in jObject["expression"]["expressionItems"])
                {
                    AddPropertiesToExpressionItem(skipCommand.Expression.ExpressionItems[i++], item as JObject);
                }
                jObject.Add(new JProperty("skipToQuestion", _nodeService.GetQuestionDefinitionById(skipCommand.SkipToQuestionId).Alias));
            }
        }

        private void AddPropertiesToExpressionItem(ExpressionItem expressionItem, JObject jObject)
        {
            if (jObject!=null && expressionItem != null)
            {
                if(expressionItem.QuestionId!=null)
                {
                    jObject.Add(new JProperty("questionAlias",
                    _nodeService.GetQuestionDefinitionById(expressionItem.QuestionId).Alias));
                }
                if (expressionItem.OptionId != null)
                {
                    jObject.Add(new JProperty("optionAlias",
                        _nodeService.GetOption(expressionItem.OptionId).Alias));
                }

            }
        }

        private JsonSerializer CreateLocalSerializer()
        {
            var jsonSerializerSettings = JsonSerializerSettingsFactory.CreateForExport(null);
            jsonSerializerSettings.Converters =
                jsonSerializerSettings.Converters.Where(p => p.GetType() != GetType()).ToList();
            return JsonSerializer.Create(jsonSerializerSettings);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            // No need to implement this method since CanRead is false.
            throw new NotImplementedException();
        }

        public override bool CanRead { get { return false; } }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OptionsMask) == objectType
                || typeof(SkipCommand) == objectType
                || typeof(ExpressionItem) == objectType;

        }
    }
}
