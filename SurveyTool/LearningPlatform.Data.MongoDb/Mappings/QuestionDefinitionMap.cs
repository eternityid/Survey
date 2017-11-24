using LearningPlatform.Domain.SurveyDesign.Questions;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class QuestionDefinitionMap
    {
        public QuestionDefinitionMap()
        {
            BsonClassMap.RegisterClassMap<QuestionDefinition>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
                cm.UnmapProperty(q => q.PageDefinition);
                cm.UnmapProperty(q => q.PageDefinitionId);
                cm.UnmapProperty(q => q.Position);
                cm.UnmapProperty(q => q.Type);

            });

            BsonClassMap.RegisterClassMap<QuestionWithOptionsDefinition>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(q => q.ParentQuestion);
                cm.UnmapProperty(q => q.OptionList);
            });

            BsonClassMap.RegisterClassMap<DateQuestionDefinition>();
            BsonClassMap.RegisterClassMap<InformationDefinition>();
            BsonClassMap.RegisterClassMap<LanguageSelectionQuestionDefinition>();
            BsonClassMap.RegisterClassMap<ScaleGridQuestionDefinition>();
            BsonClassMap.RegisterClassMap<ScaleQuestionDefinition>();
            BsonClassMap.RegisterClassMap<LongTextListQuestionDefinition>();
            BsonClassMap.RegisterClassMap<MatrixQuestionDefinition>();
            BsonClassMap.RegisterClassMap<MultipleSelectionGridQuestionDefinition>();
            BsonClassMap.RegisterClassMap<MultipleSelectionQuestionDefinition>();
            BsonClassMap.RegisterClassMap<NetPromoterScoreQuestionDefinition>();
            BsonClassMap.RegisterClassMap<NumericQuestionDefinition>();
            BsonClassMap.RegisterClassMap<OpenEndedTextQuestionDefinition>();
            BsonClassMap.RegisterClassMap<OpenEndedLongTextQuestionDefinition>();
            BsonClassMap.RegisterClassMap<OpenEndedShortTextQuestionDefinition>();
            BsonClassMap.RegisterClassMap<PictureMultipleSelectionQuestionDefinition>();
            BsonClassMap.RegisterClassMap<PictureSingleSelectionQuestionDefinition>();
            BsonClassMap.RegisterClassMap<RatingGridQuestionDefinition>();
            BsonClassMap.RegisterClassMap<RatingQuestionDefinition>();
            BsonClassMap.RegisterClassMap<ShortTextListQuestionDefinition>();
            BsonClassMap.RegisterClassMap<SingleSelectionGridQuestionDefinition>();
            BsonClassMap.RegisterClassMap<SingleSelectionQuestionDefinition>();


        }
    }
}