using System.Net;
using Analyze.Domain.Exceptions;
using Analyze.Service.ActionResults;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Analyze.Service.Common;

namespace Analyze.Service.Filters
{
	public class HttpGlobalExceptionFilter : IExceptionFilter
	{
		private readonly IHostingEnvironment _env;
		private readonly ILogger<HttpGlobalExceptionFilter> _logger;

		public HttpGlobalExceptionFilter(IHostingEnvironment env, ILogger<HttpGlobalExceptionFilter> logger)
		{
			_env = env;
			_logger = logger;
		}

		public void OnException(ExceptionContext context)
		{
			_logger.LogError(new EventId(context.Exception.HResult),
				context.Exception,
				context.Exception.Message);

			if (context.Exception.GetType() == typeof(AnalyzeDomainException))
			{
				var json = new JsonErrorResponse(context.Exception.Message);

				// Result asigned to a result object but in destiny the response is empty. This is a known bug of .net core 1.1
				//It will be fixed in .net core 1.1.2. See https://github.com/aspnet/Mvc/issues/5594 for more information
				context.Result = new BadRequestObjectResult(json);
				context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
			}
			else
			{
				var json = new JsonErrorResponse("An error occur.Try it again.");

				if (_env.IsDevelopment()) json.DeveloperMessage = context.Exception;

				// Result asigned to a result object but in destiny the response is empty. This is a known bug of .net core 1.1
				// It will be fixed in .net core 1.1.2. See https://github.com/aspnet/Mvc/issues/5594 for more information
				context.Result = new InternalServerErrorObjectResult(json);
				context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
			}
			context.ExceptionHandled = true;
		}
	}
}
