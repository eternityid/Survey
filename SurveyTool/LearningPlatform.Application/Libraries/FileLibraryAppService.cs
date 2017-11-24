using LearningPlatform.Application.Libraries.Dtos;
using LearningPlatform.Domain.Libraries;
using LearningPlatform.Domain.SurveyDesign.Services.Libraries;

namespace LearningPlatform.Application.Libraries
{
    public class FileLibraryAppService
    {
        public const string DefaultDirectory = "unspecified";
        private readonly FileLibraryService _fileLibraryService;
        private readonly ReadLibraryService _readLibraryService;

        public FileLibraryAppService(FileLibraryService fileLibraryService,
            ReadLibraryService readLibraryService)
        {
            _fileLibraryService = fileLibraryService;
            _readLibraryService = readLibraryService;
        }

        public FileLibrary GetUserLibrary(string userId)
        {
            //TODO need to modify this code logic when supporting multiple libraries per user
            var defaultLibary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            var fileLibrary = _fileLibraryService.GetLibrary(defaultLibary.Id);
            fileLibrary.Name = defaultLibary.Name;
            fileLibrary.Type = LibraryType.User;
            fileLibrary.LibraryId = defaultLibary.Id;
            return fileLibrary;
        }

        public FileLibrary GetSystemLibrary()
        {
            const string systemLibraryId = "000000000000000000000001";
            var fileLibrary = _fileLibraryService.GetLibrary(systemLibraryId);
            fileLibrary.Name = "System Library";
            fileLibrary.Type = LibraryType.System;
            fileLibrary.LibraryId = systemLibraryId;
            return fileLibrary;
        }

        public FileLibraryDirectoryTreeDto GetDirectoryTree(string userId)
        {
            var systemLibrary = GetSystemLibrary();
            var userLibrary = GetUserLibrary(userId);
            return new FileLibraryDirectoryTreeDto
            {
                SystemLibrary = systemLibrary,
                UserLibrary = userLibrary
            };
        }

        public FileLibraryBlob UploadBlob(string userId, UploadLibraryBlobDto dto)
        {
            var defaultLibary = _readLibraryService.GetDefaultLibraryByUserId(userId);

            dto.Directory = string.IsNullOrWhiteSpace(dto.Directory)
                ? DefaultDirectory :
                dto.Directory.Trim().ToLower();

            var fileLibraryDirectory = _fileLibraryService.GetDirectory(defaultLibary.Id, dto.Directory);
            if (fileLibraryDirectory == null) _fileLibraryService.CreateDirectory(defaultLibary.Id, dto.Directory);

            var blobName = $"{defaultLibary.Id}/{dto.Directory}/{dto.FileName}";
            var fileLibraryBlob = _fileLibraryService.UploadBlob(dto.Stream, dto.FileContentType, blobName, dto.Description);
            fileLibraryBlob.Directory = dto.Directory;
            fileLibraryBlob.Library = defaultLibary.Id;
            return fileLibraryBlob;
        }

        public FileLibraryDirectory GetDirectory(string userId, string directoryName)
        {
            var defaultLibary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            directoryName = directoryName.ToLower().Trim();
            return _fileLibraryService.GetDirectory(defaultLibary.Id, directoryName);
        }

        public FileLibraryDirectory CreateDirectory(string userId, string directoryName)
        {
            var defaultLibary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            directoryName = directoryName.ToLower().Trim();
            return _fileLibraryService.CreateDirectory(defaultLibary.Id, directoryName);
        }

        public FileLibraryBlob GetBlob(string userId, string directoryName, string shortBlobName)
        {
            var defaultLibary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            directoryName = directoryName.ToLower().Trim();
            return _fileLibraryService.GetBlob(defaultLibary.Id, directoryName, shortBlobName);
        }

        public FileLibraryBlob GetBlob(string userId, string blobName)
        {
            var defaultLibary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            var fileLibraryBlob = _fileLibraryService.GetBlob(blobName);
            if (fileLibraryBlob == null ||
                fileLibraryBlob.Library != defaultLibary.Id)
            {
                return null;
            }
            return fileLibraryBlob;
        }

        public void DeleteBlob(FileLibraryBlob fileLibraryBlob)
        {
            _fileLibraryService.DeleteBlob(fileLibraryBlob);
        }

        public FileLibraryBlob UpdateBlob(FileLibraryBlob fileLibraryBlob, string directoryName, string blobDescription)
        {
            directoryName = directoryName.ToLower().Trim();
            if (fileLibraryBlob.Directory != directoryName)
            {
                var fileLibraryDirectory = _fileLibraryService.GetDirectory(fileLibraryBlob.Library, directoryName);
                if (fileLibraryDirectory == null) _fileLibraryService.CreateDirectory(fileLibraryBlob.Library, directoryName);
            }
            return _fileLibraryService.UpdateBlob(fileLibraryBlob, directoryName, blobDescription);
        }
    }
}
