namespace LearningPlatform.Application.Libraries.Dtos
{
    public class SearchLibraryPageDto
    {
        public string Query { get; set; }
        public int Limit { get; set; }
        public int Offset { get; set; }
    }
}
