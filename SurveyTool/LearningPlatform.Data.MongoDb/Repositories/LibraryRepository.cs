using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Libraries;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class LibraryRepository : RepositoryBase, ILibraryRepository
    {
        public LibraryRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IMongoCollection<Library> LibraryCollection => DbContext.LibraryCollection;

        public Library GetDefaultLibraryByUserId(string userId)
        {
            //TODO need to modify this code logic with multiple libraries per user
            return LibraryCollection.FindSync(p => p.UserId == userId).FirstOrDefault();
        }

        public Library Add(Library library)
        {
            LibraryCollection.InsertOne(library);
            return library;
        }
    }
}
