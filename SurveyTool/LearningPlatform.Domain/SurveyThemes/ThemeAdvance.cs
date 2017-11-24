using LearningPlatform.Domain.UtilServices;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Text.RegularExpressions;
using System.Windows.Forms;
namespace LearningPlatform.Domain.SurveyThemes
{
    public class ThemeAdvance
    {
        private readonly Theme _theme;
        private readonly Theme _overrideTheme;
        private readonly string _baseUrl;
        private readonly List<string> _temporaryPictures;

        private const float DefaultLightenValue = 0.3f;
        private const float DefaultDarkenValue = 0.3f;
        private const float MaxBrightness = 0.8f;
        private const float MinBrightness = 0.2f;

        private const string ThemeImagesPath = "Content/Themes/";
        private const string TemporaryThemeImagesPath = "Content/UploadFiles/Temp/";

        private string DomainStorageFile = ConfigurationManager.AppSettings["DomainStorageFile"].ToString();
        private string ContainerAzureStorage = ConfigurationManager.AppSettings["ContainerAzureStorage"].ToString();


        public ThemeAdvance(Theme theme,
            Theme overrideTheme,
            string baseUrl,
            List<string> temporaryPictures = null)
        {
            _theme = theme;
            _baseUrl = baseUrl;
            _temporaryPictures = temporaryPictures;
            _overrideTheme = overrideTheme;
        }

        public string BackgroundImageUrl
        {
            get
            {
                var themeId = _theme.Id;
                if (_overrideTheme?.BackgroundImage != null) themeId = _overrideTheme.Id;

                return _theme.BackgroundImage.Contains("\\") || _theme.BackgroundImage.Contains("/") ?
                    DomainStorageFile + ContainerAzureStorage + "/" + _theme.BackgroundImage :
                    $"{_baseUrl}{ThemeImagesPath}{themeId}/{_theme.BackgroundImage}";
            }
        }

        public bool HasLogo => !string.IsNullOrEmpty(_theme.Logo);

        public string LogoSizeStyle
        {
            get
            {
                if (!HasLogo || _theme.Logo.IndexOf("?") <= 0) return "";
                var tempLogo = Regex.Replace(_theme.Logo, @"\s+", "");
                var parameters = tempLogo.Substring(_theme.Logo.IndexOf("?") + 1).ToLower().Split('&');
                var styleRules = "";
                foreach (var param in parameters)
                {
                    styleRules += BuildCssProperty(param, "width");
                    styleRules += BuildCssProperty(param, "height");
                }

                return styleRules;
            }
        }

        private string BuildCssProperty(string param, string propertyName)
        {
            if (param.StartsWith(propertyName + "="))
            {
                var parts = param.Split('=');
                if (parts.Length == 2)
                {
                    if (parts[1].EndsWith("px"))
                    {
                        return propertyName + ":" + parts[1] + ";";
                    }
                }
            }
            return "";
        }

        public bool HasBackgroundImage => !string.IsNullOrEmpty(_theme.BackgroundImage);

        public bool HasBackgroundColor => !string.IsNullOrEmpty(_theme.BackgroundColor);

        public string LogoUrl
        {
            get
            {
                var themeId = _theme.Id;
                if (_overrideTheme?.Logo != null) themeId = _overrideTheme.Id;

                return _theme.Logo.Contains("\\") || _theme.Logo.Contains("/") ?
                    DomainStorageFile + ContainerAzureStorage + "/" + _theme.Logo :
                    $"{_baseUrl}{ThemeImagesPath}{themeId}/{_theme.Logo}";
            }
        }

        public string LightenBackgroundColor => Lighten(_theme.BackgroundColor);

        public string DarkenBackgroundColor => Darken(_theme.BackgroundColor);

        public string ErrorBackgroundColor => _theme.ErrorBackgroundColor;

        public string HoverPrimaryButtonColor => Lighten(_theme.PrimaryButtonBackgroundColor);

        public string HoverDefaultButtonColor => Lighten(_theme.DefaultButtonBackgroundColor);

        public string RenderAsButtonBackgroundColor => Lighten(_theme.BackgroundColor, 0.15f);

        public string SelectOptionBackgroundColor => _theme.InputFieldBackgroundColor == null || _theme.InputFieldBackgroundColor.ToLower().Equals("transparent") ?
            _theme.BackgroundColor :
            _theme.InputFieldBackgroundColor;

        public string Lighten(string colorCode)
        {
            return Lighten(colorCode, DefaultLightenValue);
        }

        public string Lighten(string colorCode, float lighten)
        {
            var lowerColorCode = colorCode.ToLower().Trim();
            if (lowerColorCode == "inherit" || lowerColorCode == "transparent") return colorCode;

            Color color = GetColor(lowerColorCode);
            Color computeColor = color.GetBrightness() > MaxBrightness ? ControlPaint.Dark(color, lighten) : ControlPaint.Light(color, lighten);
            return ColorTranslator.ToHtml(computeColor);
        }

        private Color GetColor(string lowerCssColor)
        {
            if (lowerCssColor.StartsWith("rgb("))
            {
                return ColorUtilService.ConvertFromRgbString(lowerCssColor);
            }
            if (lowerCssColor.StartsWith("rgba("))
            {
                return ColorUtilService.ConvertFromRgbaString(lowerCssColor);
            }
            return ColorTranslator.FromHtml(lowerCssColor);
        }

        public string Darken(string colorCode)
        {
            return Darken(colorCode, DefaultDarkenValue);
        }

        public string Darken(string colorCode, float darken)
        {
            var lowerColorCode = colorCode.ToLower().Trim();
            if (lowerColorCode == "inherit" || lowerColorCode == "transparent") return colorCode;

            Color color = GetColor(lowerColorCode);
            Color computeColor = color.GetBrightness() < MinBrightness ? ControlPaint.Light(color, darken) : ControlPaint.Dark(color, darken);
            return ColorTranslator.ToHtml(computeColor);
        }
    }
}
