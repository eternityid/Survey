namespace LearningPlatform.Application.SurveyExecution.Models
{
    public class DeviceDetectionModel
    {
        public bool IsMobile { get; set; }
        public int ScreenPixelsHeight { get; set; }
        public int ScreenPixelsWidth { get; set; }
        public string TouchEvents { get; set; }
        public string UserAgent { get; set; }
    }
}
