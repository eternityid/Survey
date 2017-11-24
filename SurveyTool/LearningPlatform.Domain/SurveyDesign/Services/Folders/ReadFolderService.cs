using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Domain.SurveyDesign.Services.Folders
{
    public class ReadFolderService
    {
        private readonly INodeRepository _nodeRepository;

        public ReadFolderService(INodeRepository nodeRepository)
        {
            _nodeRepository = nodeRepository;
        }

        public Domain.SurveyDesign.Folder GetShallowFolderById(string folderId)
        {
            var node = _nodeRepository.GetNode(folderId);
            return node as Domain.SurveyDesign.Folder;
        }
    }
}
