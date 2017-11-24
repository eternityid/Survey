﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    public static class BsonClassMapExtensions
    {
        public static void MapStringIdProperty(this BsonClassMap map)
        {
            map.MapIdProperty("Id")
                .SetIgnoreIfDefault(true)
                .SetIdGenerator(StringObjectIdGenerator.Instance)
                .SetSerializer(new StringSerializer(BsonType.ObjectId));
        }
    }
}
