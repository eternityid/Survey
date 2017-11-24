using LearningPlatform.Domain.SurveyThemes;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class ThemeMap
    {
        public ThemeMap()
        {
            BsonClassMap.RegisterClassMap<Theme>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
                cm.UnmapProperty(t => t.IsSystemType);
                cm.UnmapProperty(t => t.IsCustomType);
                cm.UnmapProperty(t => t.IsUserType);
            });
        }
    }
}