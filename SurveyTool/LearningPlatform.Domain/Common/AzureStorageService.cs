using LearningPlatform.Domain.SurveyDesign;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace LearningPlatform.Domain.Common
{
    public static class AzureStorageService
    {
        public const string ReservedFileName = "$$$.$$$";
        public const string BlobDescriptionKey = "Description";
        public const char BlobNameSeperatorCharacter = '/';
        public const int NumberOfBlobNameParts = 3;
        public const int LibraryNamePositionInBlobName = 0;
        public const int DirectoryNamePositionInBlobName = 1;
        public const int FileNamePositionInBlobName = 1;
        private static readonly int FileSizeLimitation = Convert.ToInt32(ConfigurationManager.AppSettings["LimitFileSize"]);
        private static readonly string[] AllowedMimeTypes =
        {
            "image/gif",
            "image/png",
            "image/jpeg",
            "image/bmp"
        };

        public static CloudBlockBlob GetBlockBlob(string blobName)
        {
            var blobContainer = AzureStorageBlobContainerFactory.BlobContainer();
            return blobContainer.GetBlockBlobReference(blobName);
        }

        public static CloudBlockBlob UploadBlockBlob(string localFilePath, string blobName, string blobDescription = null)
        {
            var fileInfo = new FileInfo(localFilePath);
            if (!fileInfo.Exists) throw new Exception($"File {localFilePath} is not existed.");
            var fileMimeType = MimeMapping.GetMimeMapping(fileInfo.FullName);

            var blockBlob = GetBlockBlob(blobName);
            blockBlob.Properties.ContentType = fileMimeType;
            blockBlob.UploadFromStream(fileInfo.OpenRead());
            UpdateBlockBlobDescription(blockBlob, blobDescription);
            return blockBlob;
        }

        public static CloudBlockBlob UploadBlockBlob(Stream stream, string streamContentType, string blobName, string blobDescription = null)
        {
            var blockBlob = GetBlockBlob(blobName);
            blockBlob.Properties.ContentType = streamContentType;
            blockBlob.UploadFromStream(stream);
            UpdateBlockBlobDescription(blockBlob, blobDescription);
            return blockBlob;
        }

        public static CloudBlockBlob CopyBlockBlob(CloudBlockBlob sourceBlockBlob, string newBlobName)
        {
            var newBlockBlob = GetBlockBlob(newBlobName);
            newBlockBlob.Properties.ContentType = sourceBlockBlob.Properties.ContentType;
            newBlockBlob.StartCopy(sourceBlockBlob);
            return newBlockBlob;
        }

        public static void UpdateBlockBlobDescription(CloudBlockBlob blockBlob, string blobDescription)
        {
            if (!string.IsNullOrWhiteSpace(blobDescription))
            {
                var blobDescriptionBytes = Encoding.UTF8.GetBytes(blobDescription.Trim());
                blockBlob.Metadata.Add(BlobDescriptionKey, Convert.ToBase64String(blobDescriptionBytes));
            }
            else
            {
                blockBlob.Metadata.Remove(BlobDescriptionKey);
            }
            blockBlob.SetMetadata();
        }

        public static string ParseFilePath(string libraryId, string folderName, string fileName)
        {
            var uniqueFileName = $"{Guid.NewGuid():N}_{FileService.TruncateUploadFileName(fileName)}";
            var formatedName = $"{libraryId}/{folderName}/{uniqueFileName}";
            return formatedName;
        }

        public static CloudBlobDirectory GetCloudBlobDirectory(string directoryRelativeAddress)
        {
            var blobContainer = AzureStorageBlobContainerFactory.BlobContainer();
            return blobContainer.GetDirectoryReference(directoryRelativeAddress);
        }

        public static ValidationResult ValidateFileName(string fileName)
        {
            try
            {
                NameValidator.ValidateFileName(fileName);
                return new ValidationResult { Valid = true };
            }
            catch
            {
                return new ValidationResult { Valid = false, Message = "Invalid file name" };
            }
        }

        public static ValidationResult ValidateDirectoryName(string directoryName)
        {
            try
            {
                NameValidator.ValidateDirectoryName(directoryName);
                return new ValidationResult { Valid = true };
            }
            catch
            {
                return new ValidationResult { Valid = false, Message = "Invalid directory name" };
            }
        }

        public static ValidationResult ValidateFileMimeType(string fileMimeType)
        {
            return !AllowedMimeTypes.Contains(fileMimeType)
                ? new ValidationResult { Valid = false, Message = $"Unsupport {fileMimeType} mime type." }
                : new ValidationResult { Valid = true };
        }

        public static ValidationResult ValidateFileSize(long fileSize)
        {
            return fileSize > FileSizeLimitation
                ? new ValidationResult { Valid = false, Message = $"Invalid file size. The maximum file size is {FileSizeLimitation} bytes." }
                : new ValidationResult { Valid = true };
        }

        public static string GetImageMimeType(Stream stream)
        {
            if (stream == null) return null;
            try
            {
                var image = Image.FromStream(stream);
                stream.Position = 0;
                foreach (var imageDecoder in ImageCodecInfo.GetImageDecoders())
                {
                    if (image.RawFormat.Guid == imageDecoder.FormatID) return imageDecoder.MimeType;
                }
            }
            catch
            {
                return null;
            }
            return null;
        }

        public static string ExtractBlobDescription(CloudBlockBlob blockBlob)
        {
            string blobDescription;
            blockBlob.Metadata.TryGetValue(BlobDescriptionKey, out blobDescription);

            if (string.IsNullOrWhiteSpace(blobDescription)) return null;

            try
            {
                var blobDescriptionBytes = Convert.FromBase64String(blobDescription);
                return Encoding.UTF8.GetString(blobDescriptionBytes);
            }

            catch
            {
                return blobDescription;
            }
        }
    }
}
