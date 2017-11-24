using System.Web;

namespace LearningPlatform.Domain.SurveyDesign
{
    public interface IUploadFileService
    {
        string GetImageFileContent(string pathFileName);
        string GetUploadFolderPath();
        string GetRootFolderPath();
        void StoreFileToSystem(HttpPostedFile uploadedFile, string fileName);
    }
}
