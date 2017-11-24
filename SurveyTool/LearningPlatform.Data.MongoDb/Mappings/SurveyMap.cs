using LearningPlatform.Domain.SurveyDesign;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class SurveyMap
    {
        public SurveyMap()
        {
            BsonClassMap.RegisterClassMap<Survey>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
                cm.UnmapProperty(s => s.TopFolder);
                cm.UnmapProperty(s => s.SurveySettingsId);
                cm.UnmapProperty(s => s.SharedOptionLists);
            });

            BsonClassMap.RegisterClassMap<SurveySettings>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(s=>s.Id);
                cm.UnmapProperty(s=>s.LanguagesString);
            });

            BsonClassMap.RegisterClassMap<SurveyAccessRights>(cm =>
            {
                cm.AutoMap();
            });
        }

    }
}
