namespace LearningPlatform.Domain.ReportDesign
{
   public class ElementSize
   {
       public ElementSize()
       {
       }

        public ElementSize(int width, int height)
        {
            Width = width;
            Height = height;
        }

        public int Width { get; set; }
        public int Height { get; set; }
   }
}
