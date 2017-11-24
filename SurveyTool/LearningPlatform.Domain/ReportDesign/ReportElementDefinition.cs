namespace LearningPlatform.Domain.ReportDesign
{
    public abstract class ReportElementDefinition
    {
        public long Id { get; set; }

        public long ReportId { get; set; }

        public long ReportPageDefinitionId { get; set; }

        public ElementPosition Position { get; set; }

        public ElementSize Size { get; set; }
    }
}
