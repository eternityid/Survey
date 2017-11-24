using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.SurveyThemes;
using System;
using System.IO;

namespace LearningPlatform.Domain.SurveyDesign
{
    public class UploadThemeService: UploadFileService
    {
        public string CopyImagesBetweenThemes(Theme sourceTheme, Theme destinationTheme, string libraryId)
        {
            //Azure picture: do nothing
            //Hard disk picture:
            //- Upload file to Azure
            //- Update logo/background fields

            //TODO temporary fix
            if (sourceTheme == null || destinationTheme == null) return "";
            //The right way to fix: do not call me when working with questions and skip commands

            string sourceFilePath;
            string destinationFilePath;
            var folderName = "";
            var message = "";

            var sourceFolderPath = GetUploadThemeFolderPath() + sourceTheme.Id;

            if (sourceTheme.Logo != "" &&
                !sourceTheme.Logo.Contains("\\") &&
                !sourceTheme.Logo.Contains("/") &&
                sourceTheme.Logo == destinationTheme.Logo)
            {
                sourceFilePath = sourceFolderPath + "\\" + sourceTheme.Logo;
                folderName = "Logos";
                destinationFilePath = AzureStorageService.ParseFilePath(libraryId, folderName, sourceTheme.Logo);
                AzureStorageService.UploadBlockBlob(sourceFilePath, destinationFilePath);
                destinationTheme.Logo = destinationFilePath;
            }

            if (sourceTheme.BackgroundImage != "" &&
                !sourceTheme.BackgroundImage.Contains("\\") &&
                !sourceTheme.BackgroundImage.Contains("/") &&
                sourceTheme.BackgroundImage == destinationTheme.BackgroundImage)
            {
                sourceFilePath = sourceFolderPath + "\\" + sourceTheme.BackgroundImage;
                folderName = "Backgrounds";
                destinationFilePath = AzureStorageService.ParseFilePath(libraryId, folderName, sourceTheme.BackgroundImage);
                AzureStorageService.UploadBlockBlob(sourceFilePath, destinationFilePath);
                destinationTheme.BackgroundImage = destinationFilePath;
            }
            return message;
        }

        public string DeleteThemeFolder(string themeId)
        {
            var themeFolderPath = GetThemeFolderPath(themeId);
            try
            {
                Array.ForEach(Directory.GetFiles(themeFolderPath), File.Delete);
                Directory.Delete(themeFolderPath);
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private string GetUploadThemeFolderPath()
        {
            return GetUploadFolderPath() + UploadFileConstants.UploadThemeFolder.Replace("/", "\\");
        }

        private string GetThemeFolderPath(string themeId)
        {
            return GetUploadThemeFolderPath() + themeId;
        }
    }
}
