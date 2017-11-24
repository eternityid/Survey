using LearningPlatform.Domain.AccessControl;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class UserMap
    {
        public UserMap()
        {
            BsonClassMap.RegisterClassMap<User>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
            });
        }
    }
}
