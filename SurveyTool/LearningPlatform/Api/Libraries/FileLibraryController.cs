using LearningPlatform.Application.Libraries;
using LearningPlatform.Application.Libraries.Dtos;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Libraries;
using MimeTypes;
using Swashbuckle.Swagger.Annotations;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LearningPlatform.Api.Libraries
{
    [Authorize]
    [RoutePrefix("api/library")]
    public class FileLibraryController : BaseApiController
    {
        private readonly FileLibraryAppService _fileLibraryAppService;

        public FileLibraryController(FileLibraryAppService fileLibraryAppService)
        {
            _fileLibraryAppService = fileLibraryAppService;
        }

        [Route("directory-tree")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(FileLibraryDirectoryTreeDto))]
        public HttpResponseMessage GetDirectoryTree()
        {
            var directoryTree = _fileLibraryAppService.GetDirectoryTree(CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.OK, directoryTree);
        }

        [Route("directory-tree/user")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(FileLibrary))]
        public HttpResponseMessage GetUserLibrary()
        {
            var userFileLibrary = _fileLibraryAppService.GetUserLibrary(CurrentUserId);
            return Request.CreateResponse(HttpStatusCode.OK, userFileLibrary);
        }

        [Route("directories")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(FileLibraryDirectory))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public HttpResponseMessage AddDirectory([FromBody]AddLibraryDirectoryDto dto)
        {
            var directoryNameValidation = AzureStorageService.ValidateDirectoryName(dto.Name);
            if (!directoryNameValidation.Valid) return Request.CreateErrorResponse(HttpStatusCode.BadRequest, directoryNameValidation.Message);

            var directory = _fileLibraryAppService.GetDirectory(CurrentUserId, dto.Name);
            if (directory != null) return Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Directory {dto.Name} is already existed.");

            var newDirectory = _fileLibraryAppService.CreateDirectory(CurrentUserId, dto.Name);
            return Request.CreateResponse(HttpStatusCode.Created, newDirectory);
        }

        [Route("blobs")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(FileLibraryBlob))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public HttpResponseMessage UploadBlob()
        {
            var httpRequest = HttpContext.Current.Request;

            var isUsingUri = httpRequest.QueryString.AllKeys.Contains("fromUri");
            var blobDescription = httpRequest.Form["description"];
            var blobDirectory = httpRequest.Form["directory"];
            var fileNameWithoutExtension = httpRequest.Form["fileNameWithoutExtension"];

            if (string.IsNullOrWhiteSpace(fileNameWithoutExtension)) return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid file name");
            if (!string.IsNullOrWhiteSpace(blobDirectory))
            {
                var directoryNameValidation = AzureStorageService.ValidateDirectoryName(blobDirectory);
                if (!directoryNameValidation.Valid) return Request.CreateErrorResponse(HttpStatusCode.BadRequest, directoryNameValidation.Message);
            }

            if (isUsingUri)
            {
                var sourceUriString = httpRequest.Form["sourceUri"];
                return UploadBlobViaFileUri(sourceUriString, fileNameWithoutExtension, blobDirectory, blobDescription);
            }

            var uploadedFile = httpRequest.Files["file"];
            return UploadBlobViaFile(uploadedFile, fileNameWithoutExtension, blobDirectory, blobDescription);
        }

        private HttpResponseMessage UploadBlobViaFile(HttpPostedFile uploadedFile, string fileNameWithoutExtension, string blobDirectory, string blobDescription)
        {
            if (uploadedFile == null) return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid file");

            var fileName = $"{fileNameWithoutExtension.Trim()}{Path.GetExtension(uploadedFile.FileName)}";
            var fileNameValidation = AzureStorageService.ValidateFileName(fileName);
            if (!fileNameValidation.Valid) return Request.CreateResponse(HttpStatusCode.BadRequest, fileNameValidation.Message);

            var fileSizeValidation = AzureStorageService.ValidateFileSize(uploadedFile.ContentLength);
            if (!fileSizeValidation.Valid) return Request.CreateResponse(HttpStatusCode.BadRequest, fileSizeValidation.Message);

            var fileMimeTypeValidation = AzureStorageService.ValidateFileMimeType(uploadedFile.ContentType);
            if (!fileMimeTypeValidation.Valid) return Request.CreateResponse(HttpStatusCode.BadRequest, fileMimeTypeValidation.Message);

            var fileLibraryBlob = _fileLibraryAppService.UploadBlob(CurrentUserId, new UploadLibraryBlobDto
            {
                Stream = uploadedFile.InputStream,
                FileName = fileName,
                FileContentType = uploadedFile.ContentType,
                Description = blobDescription,
                Directory = blobDirectory
            });
            return Request.CreateResponse(HttpStatusCode.Created, fileLibraryBlob);
        }

        private HttpResponseMessage UploadBlobViaFileUri(string sourceUriString, string fileNameWithoutExtension, string blobDirectory, string blobDescription)
        {
            Uri sourceUri;
            if (!Uri.TryCreate(sourceUriString, UriKind.Absolute, out sourceUri))
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid source uri");

            Stream sourceFileStream;
            try
            {
                var webRequest = WebRequest.Create(sourceUriString);
                var webResponse = webRequest.GetResponse();
                sourceFileStream = webResponse.GetResponseStream();
            }
            catch (Exception exception)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, exception.Message);
            }
            if (sourceFileStream == null) return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid source uri");
            var copyOfFileStream = new MemoryStream();
            sourceFileStream.CopyTo(copyOfFileStream);

            var fileSizeValidation = AzureStorageService.ValidateFileSize(copyOfFileStream.Length);
            if (!fileSizeValidation.Valid) return Request.CreateResponse(HttpStatusCode.BadRequest, fileSizeValidation.Message);

            var imageMimeType = AzureStorageService.GetImageMimeType(copyOfFileStream);
            var fileMimeTypeValidation = AzureStorageService.ValidateFileMimeType(imageMimeType);
            if (!fileMimeTypeValidation.Valid) return Request.CreateResponse(HttpStatusCode.BadRequest, fileMimeTypeValidation.Message);

            var fileExtension = MimeTypeMap.GetExtension(imageMimeType);
            var fileName = $"{fileNameWithoutExtension.Trim()}{fileExtension}";
            var fileNameValidation = AzureStorageService.ValidateFileName(fileName);
            if (!fileNameValidation.Valid) return Request.CreateResponse(HttpStatusCode.BadRequest, fileNameValidation.Message);

            var fileLibraryBlob = _fileLibraryAppService.UploadBlob(CurrentUserId, new UploadLibraryBlobDto
            {
                Stream = copyOfFileStream,
                FileName = fileName,
                FileContentType = imageMimeType,
                Description = blobDescription,
                Directory = blobDirectory
            });
            return Request.CreateResponse(HttpStatusCode.Created, fileLibraryBlob);
        }

        [Route("blobs/update-single-blob")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(FileLibraryBlob))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage UpdateBlob([FromBody] UpdateLibraryBlobDto dto)
        {
            var fileLibraryBlob = _fileLibraryAppService.GetBlob(CurrentUserId, dto.BlobName);
            if (fileLibraryBlob == null) return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Blob is not found");

            var directoryNameValidation = AzureStorageService.ValidateDirectoryName(dto.BlobDirectory);
            if (!directoryNameValidation.Valid) return Request.CreateErrorResponse(HttpStatusCode.BadRequest, directoryNameValidation.Message);

            var updatedFileLibraryBlob = _fileLibraryAppService.UpdateBlob(fileLibraryBlob, dto.BlobDirectory, dto.BlobDescription);
            return Request.CreateResponse(HttpStatusCode.OK, updatedFileLibraryBlob);
        }

        [Route("blobs/delete-single-blob")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage DeleteBlob([FromBody] DeleteLibraryBlobDto dto)
        {
            var fileLibraryBlob = _fileLibraryAppService.GetBlob(CurrentUserId, dto.BlobName);
            if (fileLibraryBlob == null) return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Blob is not found");

            _fileLibraryAppService.DeleteBlob(fileLibraryBlob);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
