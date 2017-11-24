using LearningPlatform.Domain.AccessControl;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class CompanyMap
    {
        public CompanyMap()
        {
            BsonClassMap.RegisterClassMap<Company>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
            });
        }
    }
}
