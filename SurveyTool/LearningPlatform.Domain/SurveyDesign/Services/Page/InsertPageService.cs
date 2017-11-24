using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class InsertPageService
    {
        private readonly INodeRepository _nodeRepository;
        private readonly ValidatePageService _validatePageService;

        public InsertPageService(INodeRepository nodeRepository,
            ValidatePageService validatePageService)
        {
            _nodeRepository = nodeRepository;
            _validatePageService = validatePageService;
        }

        public void Insert(Folder folder, PageDefinition page, int pageIndex)
        {
            var pageValidationResult = _validatePageService.Validate(page);
            if (!pageValidationResult.Valid)
            {
                throw new InvalidPageExeption(pageValidationResult.Message);
            }
            page.Alias = "Page_" + DateTime.Now.Ticks;

            _nodeRepository.Add(page);

            folder.ChildIds.Insert(pageIndex, page.Id);
            folder.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(folder);

        }
    }
}
