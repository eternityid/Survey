using LearningPlatform.Domain.AccessControl;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface ICompanyRepository
    {
        List<Company> GetAll();
        Company GetCompany(string companyId);
    }
}
