using LearningPlatform.Domain.SurveyLayout;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class LayoutMap
    {
        public LayoutMap()
        {
            BsonClassMap.RegisterClassMap<Layout>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
            });

            BsonClassMap.RegisterClassMap<Template>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(t => t.Id);
                cm.UnmapProperty(t => t.Items);
                cm.UnmapProperty(t => t.LayoutId);
            });

            BsonClassMap.RegisterClassMap<BodyTemplate>();
            BsonClassMap.RegisterClassMap<PageTemplate>();
            BsonClassMap.RegisterClassMap<PageErrorTemplate>();
            BsonClassMap.RegisterClassMap<PageErrorAreaTemplate>();

            BsonClassMap.RegisterClassMap<QuestionTemplate>();
            BsonClassMap.RegisterClassMap<QuestionErrorTemplate>();
            BsonClassMap.RegisterClassMap<QuestionErrorAreaTemplate>();
            BsonClassMap.RegisterClassMap<SurveyProgressTemplate>();
            BsonClassMap.RegisterClassMap<OtherQuestionTemplate>();

        }
    }
}