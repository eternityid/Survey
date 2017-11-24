using LearningPlatform.Domain.AccessControl;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class UserRepository : RepositoryBase, IUserRepository
    {
        public UserRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IMongoCollection<User> UserCollection => DbContext.UserCollection;

        public User GetUserByExternalId(string externalId)
        {
            return UserCollection.AsQueryable().FirstOrDefault(p => p.ExternalId == externalId);
        }

        public List<User> GetAll()
        {
            return UserCollection.FindSync(Builders<User>.Filter.Empty).ToList();
        }

        public List<User> GetCompanyUsers(string companyId, string emailFilter = null)
        {
            return string.IsNullOrWhiteSpace(emailFilter) ?
                UserCollection.FindSync(p => p.CompanyId == companyId).ToList() :
                UserCollection.FindSync(p => p.CompanyId == companyId && p.Email.Contains(emailFilter)).ToList();
        }

        public List<User> GetUsers(IList<string> userIds)
        {
            return UserCollection.FindSync(p => userIds.Contains(p.ExternalId)).ToList();
        }

        public void Add(User user)
        {
            UserCollection.InsertOne(user);
        }

        public void Update(User user)
        {
            UserCollection.ReplaceOne(p => p.Id == user.Id, user, new UpdateOptions { IsUpsert = true });
        }
    }
}