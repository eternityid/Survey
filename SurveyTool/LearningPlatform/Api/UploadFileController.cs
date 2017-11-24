using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Services.Libraries;
using LearningPlatform.Domain.UtilServices;
using Swashbuckle.Swagger.Annotations;
using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LearningPlatform.Api
{
    [Authorize]
    [RoutePrefix("api/upload/file")]
    public class UploadFileController : BaseApiController
    {
        private readonly ReadLibraryService _readLibraryService;
        private readonly IUploadFileService _uploadFileService;

        public UploadFileController(ReadLibraryService readLibraryService, IUploadFileService uploadFileService)
        {
            _readLibraryService = readLibraryService;
            _uploadFileService = uploadFileService;
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(UploadFileResultDto))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public HttpResponseMessage Upload()
        {
            var httpRequest = HttpContext.Current.Request;
            var file = httpRequest.Files["file"];
            if (file == null) return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid file");

            string fileNameAfterUpload;
            var isUploadOnAzure = Convert.ToBoolean(HttpContext.Current.Request.Headers["isUploadOnAzure"]);
            if (isUploadOnAzure)
            {
                var fileSizeValidation = AzureStorageService.ValidateFileSize(file.ContentLength);
                if (!fileSizeValidation.Valid) return Request.CreateResponse(HttpStatusCode.BadRequest, fileSizeValidation.Message);

                var fileMimeTypeValidation = AzureStorageService.ValidateFileMimeType(file.ContentType);
                if (!fileMimeTypeValidation.Valid) return Request.CreateResponse(HttpStatusCode.BadRequest, fileMimeTypeValidation.Message);

                var libraryId = _readLibraryService.GetDefaultLibraryByUserId(CurrentUserId).Id;
                var folderName = "Uncategorised";
                fileNameAfterUpload = AzureStorageService.ParseFilePath(libraryId, folderName, file.FileName);
                AzureStorageService.UploadBlockBlob(file.InputStream, file.ContentType, fileNameAfterUpload);
            }
            else {
                fileNameAfterUpload = $"{Guid.NewGuid():N}_{FileService.TruncateUploadFileName(file.FileName)}";
                _uploadFileService.StoreFileToSystem(file, fileNameAfterUpload);
            }

            return Request.CreateResponse(HttpStatusCode.Created, new UploadFileResultDto
            {
                OriginalFileName = file.FileName,
                FileName = fileNameAfterUpload
            });
        }
    }
}