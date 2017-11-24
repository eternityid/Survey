using LearningPlatform.Domain.SurveyDesign.Validation;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class QuestionValidationMap
    {
        public QuestionValidationMap()
        {
            BsonClassMap.RegisterClassMap<QuestionValidation>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(qv=>qv.Id);
                cm.UnmapProperty(qv => qv.QuestionDefinitionId);
            });

            BsonClassMap.RegisterClassMap<LengthValidation>();
            BsonClassMap.RegisterClassMap<RegularExpressionValidation>();
            BsonClassMap.RegisterClassMap<RequiredValidation>();
            BsonClassMap.RegisterClassMap<SelectionValidation>();
            BsonClassMap.RegisterClassMap<RangeNumberValidation>();
            BsonClassMap.RegisterClassMap<DecimalPlacesNumberValidation>();
            BsonClassMap.RegisterClassMap<WordsAmountValidation>();
        }
    }
}