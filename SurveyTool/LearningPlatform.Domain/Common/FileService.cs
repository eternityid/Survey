using System;
using System.IO;

namespace LearningPlatform.Domain.Common
{
    public class FileService
    {
        private static readonly string folderPathInvalidMessage = "Folder path is invalid.";

        public static string SaveImage(string filePathInTempFolder, string fullOutputPath)
        {
            try
            {
                return MoveFile(filePathInTempFolder, fullOutputPath);
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public static string TruncateUploadFileName(string fileName)
        {
            const int MaxLength = 50;
            if (fileName == null || fileName.Length <= MaxLength) return fileName;
            var fileExtension = Path.GetExtension(fileName);
            return fileName.Substring(0, MaxLength - fileExtension.Length) + fileExtension;
        }

        public static string DeleteFile(string fileFullPath)
        {
            try
            {
                if (File.Exists(fileFullPath))
                    File.Delete(fileFullPath);
            }
            catch (IOException ex)
            {
                return ex.Message;
            }
            return "";
        }

        public static void RenameFile(string oldFilePath, string newFilePath)
        {
            if (File.Exists(newFilePath))
            {
                File.Delete(newFilePath);
            }
            File.Move(oldFilePath, newFilePath);
        }

        public static string CopyFile(string sourceFilePath, string destinationFilePath)
        {
            try
            {
                var destinationFolder = Path.GetDirectoryName(destinationFilePath);
                if (destinationFolder == null) return folderPathInvalidMessage;
                if (!Directory.Exists(destinationFolder))
                {
                    Directory.CreateDirectory(destinationFolder);
                }
                File.Copy(sourceFilePath, destinationFilePath, true);
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public static string MoveFile(string sourceFilePath, string destinationFilePath)
        {
            try
            {
                var destinationFolder = Path.GetDirectoryName(destinationFilePath);
                if (destinationFolder == null) return folderPathInvalidMessage;
                if (!Directory.Exists(destinationFolder))
                {
                    Directory.CreateDirectory(destinationFolder);
                }
                File.Move(sourceFilePath, destinationFilePath);
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

    }
}
