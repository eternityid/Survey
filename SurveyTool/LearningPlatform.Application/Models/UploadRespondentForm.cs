namespace LearningPlatform.Application.Models
{
    public class UploadRespondentForm
    {
        public UploadRespondentForm(string fileName)
        {
            this.FileName = fileName;
        }
        public string FileName { get; set; }
    }
}