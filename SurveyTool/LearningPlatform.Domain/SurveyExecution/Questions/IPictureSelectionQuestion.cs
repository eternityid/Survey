using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Options;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public interface IPictureSelectionQuestion : IOptions
    {
        bool IsPictureShowLabel { get; set; }
        bool IsScalePictureToFitContainer { get; set; }
        int MaxPicturesInGrid { get; set; }
        string PictureFolderId { get; set; }
        string Alias { get; set; }
        bool IsChecked(Option option);
    }
}