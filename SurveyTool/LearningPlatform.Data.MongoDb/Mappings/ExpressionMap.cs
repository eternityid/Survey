using LearningPlatform.Domain.SurveyDesign.Expressions;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    public class ExpressionMap
    {
        public ExpressionMap()
        {
            BsonClassMap.RegisterClassMap<Expression>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(l => l.Id);
                cm.UnmapProperty(l => l.SurveyId);
            });

            BsonClassMap.RegisterClassMap<ExpressionItem>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(l => l.Id);
                cm.UnmapProperty(l => l.ExpressionId);
                //cm.UnmapProperty(l => l.Position);    //TODO: consider remove this property
            });

        }
    }
}
