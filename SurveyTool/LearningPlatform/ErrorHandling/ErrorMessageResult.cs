using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace LearningPlatform.ErrorHandling
{
    public class ErrorMessageResult : IHttpActionResult
    {
        private readonly HttpRequestMessage _request;

        public ErrorMessageResult(HttpRequestMessage request)
        {
            _request = request;
        }

        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(new HttpResponseMessage(StatusCode)
            {
                Content = new StringContent(Message),
                RequestMessage = _request
            });
        }
    }
}