using LearningPlatform.Domain.Libraries;
using LearningPlatform.Domain.SurveyDesign;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class LibraryMap
    {
        public LibraryMap()
        {
            BsonClassMap.RegisterClassMap<Library>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
            });
        }
    }
}
