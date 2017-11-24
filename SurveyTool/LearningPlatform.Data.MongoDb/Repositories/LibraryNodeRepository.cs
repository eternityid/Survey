using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class LibraryNodeRepository : RepositoryBase, ILibraryNodeRepository
    {

        public LibraryNodeRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IQueryable<Node> QueryableNodes => DbContext.NodeCollection.AsQueryable();
        private IMongoCollection<Node> NodeCollection => DbContext.NodeCollection;

        public void Add(Node node)
        {
            if (node.LibraryId == null) throw new InvalidOperationException();

            NodeCollection.InsertOne(node);
        }

        public void Update(Node node)
        {
            if (node.LibraryId == null) throw new InvalidOperationException();

            NodeCollection.ReplaceOne(p => p.Id == node.Id && p.LibraryId == node.LibraryId,
                node, new UpdateOptions { IsUpsert = true });
        }

        public void Delete(Node node)
        {
            if (node.LibraryId == null) throw new InvalidOperationException();

            NodeCollection.DeleteOne(p => p.Id == node.Id && p.LibraryId == node.LibraryId);
        }

        public PageDefinition GetPage(string libraryId, string nodeId)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));

            return QueryableNodes.OfType<PageDefinition>().FirstOrDefault(p => p.Id == nodeId && p.LibraryId == libraryId);
        }

        public IList<PageDefinition> GetPagesByLibraryId(string libraryId, IList<string> nodeIds)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));
            return QueryableNodes
                .OfType<PageDefinition>()
                .Where(p => p.LibraryId == libraryId && nodeIds.Contains(p.Id))
                .OrderByDescending(p => p.Id)
                .ToList();
        }

        public IList<PageDefinition> GetPagesByLibraryId(string libraryId)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));
            return QueryableNodes
                .OfType<PageDefinition>()
                .Where(p => p.LibraryId == libraryId)
                .OrderByDescending(p => p.Id)
                .ToList();
        }

        public int CountPagesByLibraryId(string libraryId, string term)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));

            if (string.IsNullOrWhiteSpace(term))
                return QueryableNodes
                    .OfType<PageDefinition>()
                    .Count(p => p.LibraryId == libraryId);

            term = term.Trim().ToLower();
            return QueryableNodes
                .OfType<PageDefinition>()
                .Count(
                    p =>
                        p.LibraryId == libraryId &&
                        (p.Title.Items.Any(x => x.Text.ToLower().Contains(term)) ||
                         p.Description.Items.Any(x => x.Text.ToLower().Contains(term))));
        }

        public IList<PageDefinition> SearchPagesByLibraryId(string libraryId, string term, int limit, int offset)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));

            if (string.IsNullOrWhiteSpace(term))
                return QueryableNodes
                    .OfType<PageDefinition>()
                    .Where(p => p.LibraryId == libraryId)
                    .OrderByDescending(p => p.Id)
                    .ToList();

            term = term.Trim().ToLower();
            return QueryableNodes
                .OfType<PageDefinition>()
                .Where(
                    p =>
                        p.LibraryId == libraryId &&
                        (p.Title.Items.Any(x => x.Text.ToLower().Contains(term)) ||
                         p.Description.Items.Any(x => x.Text.ToLower().Contains(term))))
                .OrderByDescending(p => p.Id)
                .ToList();
        }
    }
}