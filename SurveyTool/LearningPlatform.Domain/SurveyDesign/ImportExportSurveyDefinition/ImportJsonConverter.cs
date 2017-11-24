using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;

namespace LearningPlatform.Domain.SurveyDesign.ImportExportSurveyDefinition
{
    public class ImportJsonConverter : JsonConverter
    {
        private readonly DeferredPropertyUpdates _deferredPropertyUpdates;

        public ImportJsonConverter(DeferredPropertyUpdates deferredPropertyUpdates)
        {
            _deferredPropertyUpdates = deferredPropertyUpdates;
        }

        public DeferredPropertyUpdates DeferredPropertyUpdates => _deferredPropertyUpdates;

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            // No need to implement this method since CanWrite is false.
        }

        private JsonSerializer CreateLocalSerializer()
        {
            var jsonSerializerSettings = JsonSerializerSettingsFactory.Create();
            return JsonSerializer.Create(jsonSerializerSettings);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);
            if (objectType == typeof (OptionsMask))
            {
                return HandleOptionsMask(jObject);
            }
            if (objectType == typeof(SkipCommand))
            {
                return HandleSkipCommand(jObject);
            }
            if (objectType == typeof(ExpressionItem))
            {
                return HandleExpressionItem(jObject);
            }

            throw new InvalidOperationException("Unexpected objectType");
        }

        private OptionsMask HandleOptionsMask(JObject jObject)
        {
            var optionsMask = CreateObject<OptionsMask>(jObject);
            JToken carryOverToken = jObject["carryOverFrom"];
            if (carryOverToken != null)
            {
                DeferredPropertyUpdates.CarryOvers.Add(optionsMask, carryOverToken.ToString());
            }
            return optionsMask;
        }

        private SkipCommand HandleSkipCommand(JObject jObject)
        {
            var skipCommand = CreateObject<SkipCommand>(jObject);

            JToken skipToQuestionToken = jObject["skipToQuestion"];
            if (skipToQuestionToken != null)
            {
                DeferredPropertyUpdates.SkipToQuestions.Add(skipCommand, skipToQuestionToken.ToString());
            }
            skipCommand.Expression.ExpressionItems.Clear();
            foreach (var item in jObject["expression"]["expressionItems"])
            {
                skipCommand.Expression.ExpressionItems.Add(HandleExpressionItem(item as JObject));
            }
            return skipCommand;
        }

        private ExpressionItem HandleExpressionItem(JObject jObject)
        {
            var expressionItem = CreateObject<ExpressionItem>(jObject);
            JToken expressionQuestionAlias = jObject["questionAlias"];
            if (expressionQuestionAlias != null)
            {
                DeferredPropertyUpdates.ExpressionQuestionAlias.Add(expressionItem, expressionQuestionAlias.ToString());
            }

            JToken expressionOptionAlias = jObject["optionAlias"];
            if (expressionOptionAlias != null)
            {
                DeferredPropertyUpdates.ExpressionOptionAlias.Add(expressionItem, expressionOptionAlias.ToString());
            }
            return expressionItem;
        }

        private T CreateObject<T>(JObject jObject)
        {
            var obj = Activator.CreateInstance<T>();
            var localSerializer = CreateLocalSerializer();
            localSerializer.Populate(jObject.CreateReader(), obj);
            return obj;
        }

        public override bool CanWrite { get { return false; } }


        public override bool CanConvert(Type objectType)
        {
            return typeof(OptionsMask) == objectType
                || typeof(SkipCommand) == objectType
                || typeof(ExpressionItem) == objectType;

        }
    }
}
