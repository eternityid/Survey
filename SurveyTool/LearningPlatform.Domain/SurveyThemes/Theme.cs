using LearningPlatform.Domain.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LearningPlatform.Domain.SurveyThemes
{
    public class Theme: IVersionable
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public string Logo { get; set; }
        public string Font { get; set; }
        public string BackgroundImage { get; set; }
        [BsonRepresentation(BsonType.Double, AllowTruncation = true)]
        public float? InactiveOpacity { get; set; }

        public string BackgroundColor { get; set; }
        public string QuestionTitleColor { get; set; }
        public string QuestionDescriptionColor { get; set; }
        public string QuestionContentColor { get; set; }
        public string PrimaryButtonBackgroundColor { get; set; }
        public string PrimaryButtonColor { get; set; }
        public string DefaultButtonBackgroundColor { get; set; }
        public string DefaultButtonColor { get; set; }
        public string ErrorBackgroundColor { get; set; }
        public string ErrorColor { get; set; }
        public string InputFieldBackgroundColor { get; set; }
        public string InputFieldColor { get; set; }
        public bool? IsRepeatBackground { get; set; }
        public string BackgroundStyle { get; set; }
        public string BackgroundStyleName
        {
            get
            {
                if (string.IsNullOrEmpty(BackgroundStyle))
                {
                    return !IsRepeatBackground.HasValue || IsRepeatBackground.Value ? "repeat" : "cover";
                }
                else
                {
                    return BackgroundStyle;
                }
            }
        }
        public string PageContainerBackgroundColor { get; set; }
        [BsonRepresentation(BsonType.Double, AllowTruncation = true)]
        public float? PageContainerBackgroundOpacity { get; set; }

        public bool IsDefault { get; set; }

        public bool? IsPageOverride { get; set; } //TODO remove it, move to embeded theme

        public ThemeType Type { get; set; }
        public string UserId { get; set; }

        public byte[] RowVersion { get; set; }

        public bool IsSystemType => ThemeType.System == Type;

        public bool IsCustomType => ThemeType.Custom == Type;

        public bool IsUserType => ThemeType.User == Type;
    }
}
