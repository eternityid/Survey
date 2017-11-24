using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using LearningPlatform.Application.ReportDesign.Models;
using LearningPlatform.Domain.ReportDesign;

namespace LearningPlatform.Api.Reports
{
    //TODO: Move code to app service
    [Authorize]
    [RoutePrefix("api/reports")]
    public class ReportListController : BaseApiController
    {
        private readonly IReportDefinitionRepository _reportDefinitionRepository;

        public ReportListController(IReportDefinitionRepository reportDefinitionRepository)
        {
            _reportDefinitionRepository = reportDefinitionRepository;
        }

        [Route("")]
        [HttpPost]
        public HttpResponseMessage Search([FromBody] ReportSearchViewModel searchModel)
        {
            var searchResults = _reportDefinitionRepository.Search(searchModel.ReportName, CurrentUserId, ReportType.User, searchModel.Start, searchModel.Limit);
            var totalReportsFound = _reportDefinitionRepository.Count(searchModel.ReportName, CurrentUserId, ReportType.User);

            var result = new ReportSearchResultViewModel
            {
                Reports = PopulateReportsResult(searchResults),
                TotalReportsFound = totalReportsFound
            };
            return Request.CreateResponse(result);
        }


        private List<ReportViewModel> PopulateReportsResult(List<ReportDefinition> reportDefinitions)
        {
            var reports = reportDefinitions.Select(report => new ReportViewModel
            {
                Id = report.Id,
                Name = report.Name,
                    SurveyId = report.SurveyId,
                CreatedDate = report.CreatedDate,
                ModifiedDate = report.ModifiedDate
            }).ToList();

            return reports;
        }
    }
}