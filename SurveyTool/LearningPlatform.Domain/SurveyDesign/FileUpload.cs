
namespace LearningPlatform.Domain.SurveyDesign
{
    public class FileUpload
    {
        public string Name { get; set; }
        public string Content { get; set; }
        public string Status { get; set; }
        public FileUpload OrginalFile { get; set; }
        public string UploadedFileName { get; set; }
    }
}
