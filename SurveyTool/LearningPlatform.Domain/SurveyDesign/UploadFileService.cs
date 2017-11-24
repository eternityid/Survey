using LearningPlatform.Domain.Constants;
using System;
using System.IO;
using System.Web;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class UploadFileService: IUploadFileService
    {
        private static readonly string TempFolderPath = HttpContext.Current.Server.MapPath(UploadFileConstants.FolderTemp);

        public string GetImageFileContent(string pathFileName)
        {
            string fileData;
            if (!File.Exists(pathFileName)) return "";

            using (var fs = new FileStream(pathFileName, FileMode.Open))
            using (var br = new BinaryReader(fs))
            {
                byte[] bin = br.ReadBytes(Convert.ToInt32(fs.Length));
                fileData = UploadFileConstants.FormatImageFile + Convert.ToBase64String(bin);
            }
            return fileData;
        }

        public string GetUploadFolderPath()
        {
            string uploadFolderPath = GetRootFolderPath() + "\\" + UploadFileConstants.UploadFolder.Replace("/", "\\");
            return uploadFolderPath;
        }

        public string GetRootFolderPath()
        {
            string rootPath = Path.GetDirectoryName(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase));
            return rootPath?.Replace("file:\\", "");
        }

        public void StoreFileToSystem(HttpPostedFile uploadedFile, string fileName)
        {
            var uploadFolderTemp = HttpContext.Current.Server.MapPath(UploadFileConstants.FolderTemp);
            if (!Directory.Exists(uploadFolderTemp)) Directory.CreateDirectory(uploadFolderTemp);

            uploadedFile.SaveAs($"{uploadFolderTemp}/{fileName}");
        }
    }
}
