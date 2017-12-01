namespace Analyze.Service.Common
{
	public class JsonErrorResponse
	{
		public JsonErrorResponse()
		{
			
		}
		public JsonErrorResponse(string errorMessage)
		{
			Messages = new[] {errorMessage};
		}
		public string[] Messages { get; set; }
		public object DeveloperMessage { get; set; }
	}
}
