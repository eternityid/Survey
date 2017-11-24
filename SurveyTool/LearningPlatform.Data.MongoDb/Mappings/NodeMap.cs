using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using MongoDB.Bson.Serialization;

namespace LearningPlatform.Data.MongoDb.Mappings
{
    internal class NodeMap
    {
        public NodeMap()
        {
            BsonClassMap.RegisterClassMap<Node>(cm =>
            {
                cm.AutoMap();
                cm.MapStringIdProperty();
                cm.UnmapProperty(s => s.ChildNodes);
                cm.UnmapProperty(s => s.Parent);
                cm.UnmapProperty(s => s.ParentId);
                cm.UnmapProperty(s => s.Position);
            });
            BsonClassMap.RegisterClassMap<Folder>();
            BsonClassMap.RegisterClassMap<Condition>();
            BsonClassMap.RegisterClassMap<GoToFolder>();
            BsonClassMap.RegisterClassMap<Script>();
            BsonClassMap.RegisterClassMap<PageDefinition>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(p => p.QuestionDefinitions);
            });

            BsonClassMap.RegisterClassMap<SkipCommand>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(l => l.Id);
                //cm.UnmapProperty(l => l.PageDefinitionId); //Should not include, but client code requires it.
                cm.UnmapProperty(l => l.SurveyId);
            });


            BsonClassMap.RegisterClassMap<LoopDefinition>(cm =>
            {
                cm.AutoMap();
                cm.UnmapProperty(l => l.Id);
                cm.UnmapProperty(l=> l.OptionList);
            });



        }
    }
}