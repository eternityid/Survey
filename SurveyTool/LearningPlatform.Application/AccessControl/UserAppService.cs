using LearningPlatform.Domain.AccessControl;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Collections.Generic;

namespace LearningPlatform.Application.AccessControl
{
    public class UserAppService
    {
        private readonly IUserRepository _userRepository;

        public UserAppService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public List<User> GetAll()
        {
            return _userRepository.GetAll();
        }

        public User GetUserByExternalId(string userId)
        {
            return _userRepository.GetUserByExternalId(userId);
        }

        public List<User> GetCompanyUsers(string companyId)
        {
            return _userRepository.GetCompanyUsers(companyId);
        }

        public void InsertUser(User user)
        {
            _userRepository.Add(user);
        }

        public void UpdateUser(User user)
        {
            _userRepository.Update(user);
        }
    }
}
