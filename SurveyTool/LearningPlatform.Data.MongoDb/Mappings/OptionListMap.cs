using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class OptionListMap
    {
        public OptionListMap()
        {
            BsonClassMap.RegisterClassMap<OptionList>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
            });

            BsonClassMap.RegisterClassMap<Option>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(o => o.OtherQuestionDefinitionId);
                cm.UnmapProperty(o => o.Position);
                cm.UnmapProperty(o => o.ListId); //TODO: Consider to remove ListId when migrated to MongoDb
            });

        }
    }
}