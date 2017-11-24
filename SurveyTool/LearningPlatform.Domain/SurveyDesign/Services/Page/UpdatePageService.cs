using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class UpdatePageService
    {
        private readonly INodeRepository _nodeRepository;
        private readonly ValidatePageService _validatePageService;

        public UpdatePageService(INodeRepository nodeRepository,
            ValidatePageService validatePageService)
        {
            _nodeRepository = nodeRepository;
            _validatePageService = validatePageService;
        }

        public void Update(PageDefinition page)
        {
            var pageValidationResult = _validatePageService.Validate(page);
            if (!pageValidationResult.Valid)
            {
                throw new InvalidPageExeption(pageValidationResult.Message);
            }

            page.QuestionIds = page.QuestionDefinitions.Select(p => p.Id).ToList();
            page.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(page);
        }
    }
}
