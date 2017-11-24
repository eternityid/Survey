namespace LearningPlatform.Result
{
    //TODO: Review this class and its methods.
    public class HttpDataResult
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public long Identifier { get; set; }

        public static HttpDataResult Update()
        {
            return new HttpDataResult { Status = true };
        }

        public static HttpDataResult Create()
        {
            return new HttpDataResult {Status = true};
        }

        public static HttpDataResult Create(long identifier)
        {
            var result = Create();
            result.Identifier = identifier;
            return result;
        }

        public static HttpDataResult Delete()
        {
            return new HttpDataResult {Status = true};
        }
    }
}