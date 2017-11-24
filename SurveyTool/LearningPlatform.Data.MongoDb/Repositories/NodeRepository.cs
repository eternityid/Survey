using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class NodeRepository : RepositoryBase, INodeRepository
    {

        public NodeRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IQueryable<Node> QueryableNodes => DbContext.NodeCollection.AsQueryable();
        private IMongoCollection<Node> NodeCollection => DbContext.NodeCollection;

        public void Add(Node node)
        {
            if(node.LibraryId != null) throw new InvalidOperationException();
            NodeCollection.InsertOne(node);
        }

        public void AddMany(IList<Node> nodes)
        {
            if (nodes == null || !nodes.Any()) return;
            if(nodes.Any(p=>p.LibraryId != null)) throw new InvalidOperationException();
            NodeCollection.InsertMany(nodes);
        }

        public void Update(Node node)
        {
            if (node.LibraryId != null) throw new InvalidOperationException();
            NodeCollection.ReplaceOne(p => p.Id == node.Id && p.LibraryId == null, node, new UpdateOptions { IsUpsert = true });
        }

        public void Delete(Node node)
        {
            if (node.LibraryId != null) throw new InvalidOperationException();
            NodeCollection.DeleteOne(p => p.Id == node.Id && p.LibraryId == null);
        }

        public void DeleteMany(IList<Node> nodes)
        {
            if(nodes.Any(p=>p.LibraryId != null)) throw new InvalidOperationException();
            var nodeIds = nodes.Select(p => p.Id);
            NodeCollection.DeleteMany(p => nodeIds.Contains(p.Id));
        }

        public Node GetNode(string nodeId)
        {
            return QueryableNodes.FirstOrDefault(p => p.Id == nodeId && p.LibraryId == null);
        }

        public IList<Node> GetNodesBySurveyId(string surveyId)
        {
            return NodeCollection.FindSync(p => p.SurveyId == surveyId && p.LibraryId == null).ToList();
        }

        public IList<Node> GetNodesBySurveyIds(IList<string> surveyIds)
        {
            return NodeCollection.FindSync(p => p.LibraryId == null && surveyIds.Contains(p.SurveyId)).ToList();
        }
    }
}
