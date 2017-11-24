using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class LanguageStringMap
    {
        public LanguageStringMap()
        {
            BsonClassMap.RegisterClassMap<LanguageString>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(l=>l.Id);
                cm.UnmapProperty(l => l.SurveyId);
            });

            BsonClassMap.RegisterClassMap<LanguageStringItem>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(l => l.Id);
                cm.UnmapProperty(l => l.LanguageStringId);
            });
        }
    }
    }
