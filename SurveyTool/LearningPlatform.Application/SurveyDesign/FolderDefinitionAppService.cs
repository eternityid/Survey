using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Application.SurveyDesign
{
    public class FolderDefinitionAppService
    {
        private readonly INodeRepository _nodeRepository;

        public FolderDefinitionAppService(INodeRepository nodeRepository)
        {
            _nodeRepository = nodeRepository;
        }

        public Folder GetShallowFolder(string folderId)
        {
            var node = _nodeRepository.GetNode(folderId);
            return  node as Folder;
        }
    }
}
