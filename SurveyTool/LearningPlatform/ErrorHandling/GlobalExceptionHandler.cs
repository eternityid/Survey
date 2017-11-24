using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.ExceptionHandling;
using LearningPlatform.Domain.Exceptions;

namespace LearningPlatform.ErrorHandling
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        public Task HandleAsync(ExceptionHandlerContext context, CancellationToken cancellationToken)
        {
            Handle(context);
            return Task.FromResult(0);
        }

        private static void Handle(ExceptionHandlerContext context)
        {
            ExceptionContext exceptionContext = context.ExceptionContext;
            if (exceptionContext.CatchBlock == ExceptionCatchBlocks.IExceptionFilter)
            {
                return;
            }

            HttpRequestMessage request = exceptionContext.Request;
            Exception exception = exceptionContext.Exception;
            if (exception is ConcurrencyException)
            {
                context.Result = new ErrorMessageResult(request)
                {
                    StatusCode = HttpStatusCode.PreconditionFailed,
                    Message = exception.Message
                };
                return;
            }

            if (context.Exception is SurveyNotFoundException)
            {
                context.Result = new ErrorMessageResult(request)
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = exception.Message
                };
                return;
            }
            if (context.Exception is EntityNotFoundException)
            {
                context.Result = new ErrorMessageResult(request)
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = exception.Message
                };
                return;
            }
            context.Result = new ErrorMessageResult(request)
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = exception.Message
            };
        }
    }
}