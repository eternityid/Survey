using LearningPlatform.Domain.AccessControl;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class CompanyRepository : RepositoryBase, ICompanyRepository
    {
        public CompanyRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IMongoCollection<Company> CompanyCollection => DbContext.CompanyCollection;

        public List<Company> GetAll()
        {
            return CompanyCollection.FindSync(Builders<Company>.Filter.Empty).ToList();
        }

        public Company GetCompany(string companyId)
        {
            return CompanyCollection.AsQueryable().FirstOrDefault(p => p.Id == companyId);
        }
    }
}
