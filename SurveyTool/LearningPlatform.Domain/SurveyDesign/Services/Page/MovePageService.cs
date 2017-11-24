using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class MovePageService
    {
        private readonly INodeRepository _nodeRepository;
        public MovePageService(INodeRepository nodeRepository)
        {
            _nodeRepository = nodeRepository;
        }

        public void UpdatePosition(Folder folder, string pageId, int newPageIndex)
        {
            folder.ChildIds.Remove(pageId);
            folder.ChildIds.Insert(newPageIndex, pageId);
            folder.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(folder);
        }
    }
}
