using System.Drawing;
using System.Linq;

namespace LearningPlatform.Domain.UtilServices
{
    public static class ColorUtilService
    {
        public static Color ConvertFromRgbString(string rgbValue)
        {
            var rgb = rgbValue.ToLower().Trim().Replace("rgb(", "").Replace(")", "").Split(',');
            var rgbInts = rgb.Select(item => int.Parse(item)).ToArray();
            return Color.FromArgb(rgbInts[0], rgbInts[1], rgbInts[2]);
        }

        public static Color ConvertFromRgbaString(string rgbaValue)
        {
            var rgba = rgbaValue.ToLower().Trim().Replace("rgba(", "").Replace(")", "").Split(',');
            var rgbInts = rgba.Take(rgba.Count() - 1).Select(item => int.Parse(item)).ToArray();
            float alpha = float.Parse(rgba[rgba.Count() - 1]);
            return Color.FromArgb((int) alpha * 255, rgbInts[0], rgbInts[1], rgbInts[2]);
        }
    }
}
