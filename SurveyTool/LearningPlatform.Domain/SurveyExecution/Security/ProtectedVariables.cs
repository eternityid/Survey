using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyExecution.Security
{
    public class ProtectedVariables
    {                
        [JsonProperty("I")]
        public string PageId { get; set; }
        [JsonProperty("T")]
        public long Ticks { get; set; }
        [JsonProperty("RId")]
        public long RespondentId { get; set; }
        [JsonProperty("C")]
        public string Credential { get; set; }
        [JsonProperty("G")]
        public string GotoStack { get; set; }
        [JsonProperty("L")]
        public string LoopStack { get; set; }
        [JsonProperty("S")]
        public string SkipStack { get; set; }
    }
}