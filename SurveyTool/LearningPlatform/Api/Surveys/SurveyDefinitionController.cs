using LearningPlatform.Application.AccessControl;
using LearningPlatform.Application.Libraries;
using LearningPlatform.Application.Models;
using LearningPlatform.Application.SurveyDesign;
using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.Constants;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using LearningPlatform.Domain.SurveyThemes;
using Swashbuckle.Swagger.Annotations;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace LearningPlatform.Api.Surveys
{
    //Suggestion:

    // GET  api/surveys/{surveyId} => return the whole survey
    // ---------Etag will only detect changes to survey and not to it's children (even if they are returned).
    // PUT  api/surveys/{surveyId} => will not update children. Etag will be useful for concurrency control.
    // GET  api/surveys/{surveyId}/info => return published, modified date++. This should be used to poll if the survey has changed.
    // GET  api/surveys/{surveyId}/settings => return the settings
    // POST api/surveys/{surveyId}/export => return the whole survey in export format
    // GET  api/surveys/import => return the whole survey in export format
    // GET  api/surveys/{surveyId}/pages/{pageId} => return the page with children
    // ---------Etag will only detect changes to the page and not to it's questions.
    // PUT  api/surveys/{surveyId}/pages/{pageId} => if we have a concurrency problem here, then fetch the page again (with children)
    // GET  api/surveys/{surveyId}/questions/{questionId} => return the question with the options
    // ---------Etag will only detect changes to the question and not to the option list.
    // PUT  api/surveys/{surveyId}/questions/{questionId}  => if we have a concurrency problem here, then fetch the question with the options.


    //GET  api/surveys/{surveyId} => return survey without children
    //GET  api/surveys/{surveyId}/surveysettings
    //GET  api/surveys/{surveyId}/surveyinfo => etag for any changes to the survey
    //GET  api/surveys/{surveyId}?includechildren=true => return the whole survey. This is not consistent with the rest...
    //GET  api/surveys/{surveyId}/pages/{pageId} => only page and not questions.
    //GET  api/surveys/{surveyId}/pages/{pageId}/questions
    //GET  api/surveys/{surveyId}/questions/{questionId} => only question and not optionlist
    //GET  api/surveys/{surveyId}/questions/{questionId}/optionList
    //GET  api/surveys/{surveyId}/optionlists/{optionListId}

    // Add a question to a page:
    // PATCH api/surveys/{surveyId}/pages/{pageId}
    /*
    {
      "op": "add",
      "path": "/questionIds/3",
      "value": "{objectId"}"
    }
    */
    // PUT  api/surveys/{surveyId}/pages/{pageId}/questions/{objectId}

    [Authorize]
    [RoutePrefix("api/surveys")]
    public class SurveyDefinitionController : BaseApiController
    {
        private readonly SurveyDefinitionAppService _surveyDefinitionAppService;
        private readonly UploadThemeService _uploadThemeService;
        private readonly ImportExportSurveyAppService _importExportSurveyService;
        private readonly LibrarySurveyAppService _librarySurveyAppService;
        private readonly UserAppService _userAppService;
        private readonly IThemeRepository _themeRepository;

        public SurveyDefinitionController(SurveyDefinitionAppService surveyDefinitionAppService,
            UploadThemeService uploadThemeService,
            ImportExportSurveyAppService importExportSurveyService,
            LibrarySurveyAppService librarySurveyAppService,
            UserAppService userAppService,
            IThemeRepository themeRepository)
        {
            _surveyDefinitionAppService = surveyDefinitionAppService;
            _uploadThemeService = uploadThemeService;
            _importExportSurveyService = importExportSurveyService;
            _librarySurveyAppService = librarySurveyAppService;
            _userAppService = userAppService;
            _themeRepository = themeRepository;
        }

        [Route("")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<SurveyListItemDto>))]
        public List<SurveyListItemDto> GetSurveyList()
        {
            return _surveyDefinitionAppService.GetSurveyListItems(CurrentUserId);
        }

        [Route("")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(SurveyInfoVersionModel))]
        public IHttpActionResult Post([FromBody] InsertSurveyDto dto)
        {
            var survey = _surveyDefinitionAppService.CreateSurvey(dto.SurveyName, CurrentUserId);
            return Ok(new SurveyInfoVersionModel
            {
                RowVersion = survey.SurveySettings.RowVersion,
                SurveyId = survey.Id
            });
        }

        [Route("search")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SurveyListDto))]
        public SurveyListDto Search([FromBody]SurveySearchFilter surveySearchModel)
        {
            surveySearchModel.UserId = CurrentUserId;
            return _surveyDefinitionAppService.Search(surveySearchModel);
        }

        [Route("duplicate")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(SurveyListItemDto))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage DuplicateSurvey([FromBody]DuplicateSurveyDto dto)
        {
            Survey shallowSurvey;
            if (dto.LibraryId == null)
            {
                shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(dto.SourceSurveyId);
                var message = ValidateCrudSurvey(shallowSurvey, dto.SourceSurveyId, SurveyPermission.Read);
                if (message != null) return message;
            }
            else
            {
                shallowSurvey = _librarySurveyAppService.GetShallowSurvey(dto.LibraryId, dto.SourceSurveyId);
                if (shallowSurvey == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Survey {dto.SourceSurveyId} not found");
                }
            }

            var newSurveyListItemDto = _surveyDefinitionAppService.DuplicateSurvey(shallowSurvey, CurrentUserId, dto.NewSurveyTitle);
            return Request.CreateResponse(HttpStatusCode.Created, newSurveyListItemDto);
        }

        private HttpResponseMessage ValidateCrudSurvey(Survey shallowSurvey, string surveyId,
            SurveyPermission permission)
        {
            if (shallowSurvey == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Survey {surveyId} not found");
            }
            if (permission == SurveyPermission.Read && !shallowSurvey.IsUserHaveReadPermission(CurrentUserId) ||
                permission == SurveyPermission.Write && !shallowSurvey.IsUserHaveWritePermission(CurrentUserId) ||
                permission == SurveyPermission.Full && !shallowSurvey.IsUserHaveFullPermission(CurrentUserId))
            {
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, string.Empty);
            }
            return null;
        }

        [Route("{surveyId}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(Survey))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Get(string surveyId)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Read);
            if (message != null) return message;

            if (shallowSurvey.Version != null && CompareWithIfNoneMatch(shallowSurvey.Version))
            {
                return CreateEmptyResponseWithCaching(shallowSurvey.Version);
            }
            var survey = _surveyDefinitionAppService.GetFullSurvey(shallowSurvey);
            return CreateOkResponseWithCaching(survey, survey.Version);
        }

        [Route("{surveyId}/settings")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SurveySettings))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage UpdateSurveySettings(string surveyId, [FromBody] SurveySettings settings)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Write);
            if (message != null) return message;

            if (shallowSurvey.SurveySettings.Version != null && !CompareWithIfMatch(shallowSurvey.SurveySettings.Version))
            {
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed);
            }
            var surveySettings = _surveyDefinitionAppService.UpdateSurveySettings(shallowSurvey, settings);
            return CreateOkResponseWithEtag(surveySettings, surveySettings.Version);
        }

        [Route("{surveyId}/brief")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(Survey))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetSurveyBrief(string surveyId)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Read);
            if (message != null) return message;

            return Request.CreateResponse(HttpStatusCode.OK, shallowSurvey);
        }

        [Route("{surveyId}/latest-published-version")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetSurveyLatestPublishedVersion(string surveyId)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Read);
            if (message != null) return message;

            return Request.CreateResponse(HttpStatusCode.OK, new {
                SurveyVersion = _surveyDefinitionAppService.GetSurveyLatestPublishedVersion(surveyId) });
        }

        //TODO: Consider to use PATCH
        [Route("{surveyId}/status")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage UpdateSurveyStatus(string surveyId, [FromBody] SurveyStatusModel surveyStatusModel)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Full);
            if (message != null) return message;

            _surveyDefinitionAppService.UpdateSurveyStatus(shallowSurvey, surveyStatusModel.Status);
            return CreateOkResponseWithEtag(shallowSurvey, shallowSurvey.Version);
        }

        //TODO: Consider to use PATCH
        [Route("{surveyId}/delete")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SurveyInfoVersionModel))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Delete(string surveyId)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Full);
            if (message != null) return message;

            _surveyDefinitionAppService.DeleteSurvey(shallowSurvey);
            return Request.CreateResponse(HttpStatusCode.OK, new SurveyInfoVersionModel
            {
                RowVersion = shallowSurvey.SurveySettings.RowVersion,
                SurveyId = surveyId
            });
        }

        //TODO: Consider to use PATCH
        [Route("{surveyId}/restore")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SurveyInfoVersionModel))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Restore(string surveyId)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Full);
            if (message != null) return message;

            _surveyDefinitionAppService.RestoreSurvey(shallowSurvey);
            return Request.CreateResponse(new SurveyInfoVersionModel
            {
                RowVersion = shallowSurvey.SurveySettings.RowVersion,
                SurveyId = surveyId
            });
        }

        //TODO: Consider to use PATCH
        [Route("{surveyId}/publish")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SurveyInfoVersionModel))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Publish(string surveyId)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Full);
            if (message != null) return message;

            if (shallowSurvey.IsSurveyClosed)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Survey {surveyId} is closed");
            }

            _surveyDefinitionAppService.Publish(shallowSurvey);
            return Request.CreateResponse(HttpStatusCode.OK, new SurveyInfoVersionModel
            {
                RowVersion = shallowSurvey.SurveySettings.RowVersion,
                SurveyId = shallowSurvey.Id
            });
        }

        // Need to understand why this is on surveydefinitioncontroller
        [Route("{surveyId}/file")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(string))]
        public IHttpActionResult GetFile(long themeId, string fileName)
        {
            fileName = _uploadThemeService.GetUploadFolderPath() + themeId + fileName;
            var fileData = _uploadThemeService.GetImageFileContent(fileName);

            return Ok(fileData);
        }

        [Route("{surveyId}/export")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(StringContent))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage Export(string surveyId)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Write);
            if (message != null) return message;

            var surveyDefinitionAsString = _surveyDefinitionAppService.Export(shallowSurvey);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(surveyDefinitionAsString)
            };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            return result;
        }

        [Route("import")]
        [HttpPost]
        [SwaggerResponse(HttpStatusCode.Created, null, typeof(SurveyInfoVersionModel))]
        public HttpResponseMessage Import()
        {
            var filename = HttpContext.Current.Request.Form.Get("surveyDefinitionFileName");
            var surveyName = HttpContext.Current.Request.Form.Get("surveyName");

            var uploadedFilePath = HttpContext.Current.Server.MapPath(UploadFileConstants.FolderTemp + "/" + filename);

            var survey = _importExportSurveyService.ImportFromFile(uploadedFilePath, surveyName, CurrentUserId);

            return Request.CreateResponse(HttpStatusCode.OK, new SurveyInfoVersionModel
            {
                RowVersion = survey.SurveySettings.RowVersion,
                SurveyId = survey.Id
            });
        }

        [Route("{surveyId}/themes")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(List<Theme>))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        public HttpResponseMessage GetSurveyThemes(string surveyId)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Read);
            if (message != null) return message;

            var themes = shallowSurvey.CustomThemeId != null ?
                _themeRepository.GetAvailableThemesForSurvey(CurrentUserId, shallowSurvey.ThemeId, shallowSurvey.CustomThemeId) :
                _themeRepository.GetAvailableThemesForSurvey(CurrentUserId, shallowSurvey.ThemeId);
            return Request.CreateResponse(HttpStatusCode.OK, themes);
        }

        [Route("{surveyId}/access-rights")]
        [HttpPut]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.Forbidden)]
        [SwaggerResponse(HttpStatusCode.OK, null, typeof(SurveyAccessRights))]
        public HttpResponseMessage UpdateSurveyAccessRights(string surveyId, [FromBody] SurveyAccessRights accessRights)
        {
            var shallowSurvey = _surveyDefinitionAppService.GetShallowSurvey(surveyId);
            var message = ValidateCrudSurvey(shallowSurvey, surveyId, SurveyPermission.Full);
            if (message != null) return message;

            var currentUser = _userAppService.GetUserByExternalId(CurrentUserId);
            if (currentUser?.CompanyId == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid company");
            }

            var companyUsers = _userAppService.GetCompanyUsers(currentUser.CompanyId);
            var validationResult = _surveyDefinitionAppService.ValidateAccessRights(accessRights, companyUsers);
            if (!validationResult.Valid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, validationResult.Message);
            }

            _surveyDefinitionAppService.UpdateAccessRights(shallowSurvey, accessRights, currentUser, companyUsers);
            return Request.CreateResponse(HttpStatusCode.OK, shallowSurvey.AccessRights);
        }
    }
}