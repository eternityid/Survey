using LearningPlatform.Domain.AccessControl;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Collections.Generic;

namespace LearningPlatform.Application.AccessControl
{
    public class CompanyAppService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IUserRepository _userRepository;

        public CompanyAppService(ICompanyRepository companyRepository,
            IUserRepository userRepository)
        {
            _companyRepository = companyRepository;
            _userRepository = userRepository;
        }

        public List<Company> GetAll()
        {
            return _companyRepository.GetAll();
        }

        public Company GetCompany(string companyId)
        {
            return _companyRepository.GetCompany(companyId);
        }

        public List<User> GetCompanyUsers(string companyId)
        {
            return _userRepository.GetCompanyUsers(companyId);
        }
    }
}
