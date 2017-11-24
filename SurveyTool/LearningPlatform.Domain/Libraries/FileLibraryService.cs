using LearningPlatform.Domain.Common;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace LearningPlatform.Domain.Libraries
{
    public class FileLibraryService
    {
        public FileLibrary GetLibrary(string libraryName)
        {
            var blobDirectory = AzureStorageService.GetCloudBlobDirectory(libraryName);

            var fileLibrary = new FileLibrary
            {
                Uri = blobDirectory.Uri.AbsoluteUri,
                Prefix = blobDirectory.Prefix
            };

            var childBlobDirectories = blobDirectory
                .ListBlobs(false, BlobListingDetails.Metadata)
                .OfType<CloudBlobDirectory>()
                .OrderBy(p => p.Prefix);
            fileLibrary.Directories = childBlobDirectories
                .Select(p => BuildDirectory(fileLibrary, p))
                .ToList();

            return fileLibrary;
        }

        public FileLibraryDirectory GetDirectory(string libraryName, string directoryName)
        {
            var blobDirectory = AzureStorageService.GetCloudBlobDirectory(libraryName);
            var childBlobDirectory = blobDirectory.GetDirectoryReference(directoryName);

            var childDirectoryBlockBlobs = childBlobDirectory
                    .ListBlobs(false, BlobListingDetails.Metadata)
                    .OfType<CloudBlockBlob>()
                    .OrderByDescending(p => p.Properties.LastModified)
                    .ToList();
            if (!childDirectoryBlockBlobs.Any()) return null;

            var fileLibraryDirectory = new FileLibraryDirectory
            {
                Name = directoryName,
                Library = libraryName,
                Uri = childBlobDirectory.Uri.AbsoluteUri
            };
            fileLibraryDirectory.Blobs = childDirectoryBlockBlobs
                .Select(BuildBlob)
                .ToList();
            fileLibraryDirectory.Blobs.RemoveAll(p => p.Name.EndsWith(AzureStorageService.ReservedFileName));
            return fileLibraryDirectory;
        }

        public FileLibraryDirectory CreateDirectory(string libraryName, string directoryName)
        {
            var blobDirectory = AzureStorageService.GetCloudBlobDirectory(libraryName);
            var childBlobDirectory = blobDirectory.GetDirectoryReference(directoryName);

            var placeholderBlockBlob = childBlobDirectory.GetBlockBlobReference(AzureStorageService.ReservedFileName);
            placeholderBlockBlob.UploadText(string.Empty);

            return new FileLibraryDirectory
            {
                Name = directoryName,
                Library = libraryName,
                Prefix = childBlobDirectory.Prefix,
                Uri = childBlobDirectory.Uri.AbsoluteUri,
                Blobs = new List<FileLibraryBlob>()
            };
        }

        public FileLibraryBlob UploadBlob(Stream fileStream, string fileContentType, string blobName, string blobDescription)
        {
            var cloudBlockBlob = AzureStorageService.UploadBlockBlob(fileStream, fileContentType, blobName, blobDescription);
            cloudBlockBlob.FetchAttributes();
            return BuildBlob(cloudBlockBlob);
        }

        public FileLibraryBlob GetBlob(string libraryName, string directoryName, string shortBlobName)
        {
            var blockBlobName = $"{libraryName}/{directoryName}/{shortBlobName}";
            var blockBlob = AzureStorageService.GetBlockBlob(blockBlobName);

            if (!blockBlob.Exists()) return null;
            var fileLibraryBlob = BuildBlob(blockBlob);
            fileLibraryBlob.Directory = directoryName;
            fileLibraryBlob.Library = libraryName;
            return fileLibraryBlob;
        }

        public FileLibraryBlob GetBlob(string blobName)
        {
            var blockBlob = AzureStorageService.GetBlockBlob(blobName);
            if (!blockBlob.Exists()) return null;
            blockBlob.FetchAttributes();
            return BuildBlob(blockBlob);
        }

        public void DeleteBlob(FileLibraryBlob fileLibraryBlob)
        {
            var blockBlob = AzureStorageService.GetBlockBlob(fileLibraryBlob.Name);
            blockBlob.DeleteIfExists();
        }

        public FileLibraryBlob UpdateBlob(FileLibraryBlob fileLibraryBlob, string directoryName, string blobDescription)
        {
            var blockBlob = AzureStorageService.GetBlockBlob(fileLibraryBlob.Name);

            if (fileLibraryBlob.Directory == directoryName)
            {
                AzureStorageService.UpdateBlockBlobDescription(blockBlob, blobDescription);
                fileLibraryBlob.Description = blobDescription;
                return fileLibraryBlob;
            }

            var newBlockBlobName = $"{fileLibraryBlob.Library}/{directoryName}/{fileLibraryBlob.FileName}";
            var newBlockBlob = AzureStorageService.CopyBlockBlob(blockBlob, newBlockBlobName);
            AzureStorageService.UpdateBlockBlobDescription(newBlockBlob, blobDescription);
            blockBlob.Delete();

            var newFileLibraryBlob = BuildBlob(newBlockBlob);
            newFileLibraryBlob.Size = fileLibraryBlob.Size;
            newFileLibraryBlob.Library = fileLibraryBlob.Library;
            newFileLibraryBlob.Directory = directoryName;
            return newFileLibraryBlob;
        }

        private FileLibraryDirectory BuildDirectory(FileLibrary fileLibrary, CloudBlobDirectory cloudBlockDirectory)
        {
            var fileLibraryDirectory = new FileLibraryDirectory
            {
                Library = fileLibrary.Name,
                Uri = cloudBlockDirectory.Uri.AbsoluteUri,
                Blobs = new List<FileLibraryBlob>(),
                Prefix = cloudBlockDirectory.Prefix
            };
            fileLibraryDirectory.Name = new Regex($@"^{fileLibrary.Prefix}(.+)/$")
                .Match(cloudBlockDirectory.Prefix)
                .Groups[1].Value;

            var cloudBlockBlobs = cloudBlockDirectory
                .ListBlobs(false, BlobListingDetails.Metadata)
                .OfType<CloudBlockBlob>()
                .OrderByDescending(p => p.Properties.LastModified);
            fileLibraryDirectory.Blobs = cloudBlockBlobs
                .Select(BuildBlob)
                .ToList();
            fileLibraryDirectory.Blobs.RemoveAll(p => p.Name.EndsWith(AzureStorageService.ReservedFileName));

            return fileLibraryDirectory;
        }

        private FileLibraryBlob BuildBlob(CloudBlockBlob blockBlob)
        {
            var fileLibraryBlob = new FileLibraryBlob
            {
                Name = blockBlob.Name,
                ContentType = blockBlob.Properties.ContentType,
                Etag = blockBlob.Properties.ETag,
                LastModified = blockBlob.Properties.LastModified,
                Size = blockBlob.Properties.Length,
                Uri = blockBlob.Uri.AbsoluteUri,
                Description = AzureStorageService.ExtractBlobDescription(blockBlob)
            };
            fileLibraryBlob.FileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileLibraryBlob.Name);
            fileLibraryBlob.FileName = Path.GetFileName(fileLibraryBlob.Name);
            fileLibraryBlob.FileExtension = Path.GetExtension(fileLibraryBlob.Name);

            var blobNameParts = fileLibraryBlob.Name.Split(AzureStorageService.BlobNameSeperatorCharacter);
            if (blobNameParts.Length == AzureStorageService.NumberOfBlobNameParts)
            {
                fileLibraryBlob.Library = blobNameParts[AzureStorageService.LibraryNamePositionInBlobName];
                fileLibraryBlob.Directory = blobNameParts[AzureStorageService.DirectoryNamePositionInBlobName];
            }

            return fileLibraryBlob;
        }
    }
}

