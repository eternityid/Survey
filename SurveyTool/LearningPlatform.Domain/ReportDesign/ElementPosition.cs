﻿
namespace LearningPlatform.Domain.ReportDesign
{
    public class ElementPosition
    {
        public ElementPosition()
        {
        }
        public ElementPosition(int x, int y, int z)
        {
            X = x;
            Y = y;
            Z = z;
        }
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
    }
}
