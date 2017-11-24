using LearningPlatform.Domain.AccessControl;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface IUserRepository
    {
        User GetUserByExternalId(string externalId);
        List<User> GetAll();
        List<User> GetCompanyUsers(string companyId, string emailFilter = null);
        List<User> GetUsers(IList<string> userIds);
        void Add(User user);
        void Update(User user);
    }
}