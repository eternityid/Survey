using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace LearningPlatform.Domain.SurveyDesign.Questions.Services
{
    public class PictureQuestionService
    {
        public string GetQuestionPictureFolder(string surveyId, string questionId)
        {
            return HttpContext.Current.Server.MapPath("~/Content/Surveys/" + surveyId + "/" + questionId);
        }

        private string GetPictureFolderTemp()
        {
            return HttpContext.Current.Server.MapPath("~/Content/UploadFiles/Temp");
        }

        public void SavePictureOptions(QuestionDefinition question, IList<FileUpload> pictureOptions)
        {
            //TODO remove me
            if (!IsPictureSelection(question)) return;
            if (pictureOptions == null || !pictureOptions.Any()) return;

            var questionPictureFolder = GetQuestionPictureFolder(question.SurveyId, question.Id);

            if (!Directory.Exists(questionPictureFolder)) Directory.CreateDirectory(questionPictureFolder);
            foreach (var pictureOption in pictureOptions)
            {
                var sourceFile = $"{GetPictureFolderTemp()}/{pictureOption.UploadedFileName}";
                if (File.Exists(sourceFile))
                {
                    var destinationFile = $"{questionPictureFolder}/{pictureOption.UploadedFileName}";
                    File.Copy(sourceFile, destinationFile, true);
                    File.Delete(sourceFile);
                }
            }
        }


        public bool IsPictureSelection(QuestionDefinition question)
        {
            return (question is PictureSingleSelectionQuestionDefinition || question is PictureMultipleSelectionQuestionDefinition);
        }

        public void DeletePicturesNotInOptions(QuestionDefinition question)
        {
            var questionWithOptions = question as QuestionWithOptionsDefinition;
            if (questionWithOptions == null || !IsPictureSelection(question))
            {
                return;
            }

            var pictureFolder = GetQuestionPictureFolder(questionWithOptions.SurveyId, questionWithOptions.Id);
            if (!Directory.Exists(pictureFolder)) return;

            var pictureNames = questionWithOptions.OptionList.Options.Select(p => p.PictureName).ToList();
            foreach (var fileName in Directory.GetFiles(pictureFolder))
            {
                var file = new FileInfo(fileName);
                if (!pictureNames.Contains(file.Name))
                {
                    File.Delete(fileName);
                }
            }
        }

        public void DeletePictureOptions(QuestionDefinition question)
        {
            string pictureFolder = GetQuestionPictureFolder(question.SurveyId, question.Id);
            if (!IsPictureSelection(question) || !Directory.Exists(pictureFolder)) return;
            Directory.Delete(pictureFolder, true);
        }

        public void DuplicatePictureFolder(string surveyId, string sourceQuestionId, string destQuestionId)
        {
            var sourceFolder = new DirectoryInfo(GetQuestionPictureFolder(surveyId, sourceQuestionId));
            if (sourceFolder.Exists)
            {
                var destQuestionPictureFolder = GetQuestionPictureFolder(surveyId, destQuestionId);
                Directory.CreateDirectory(destQuestionPictureFolder);

                foreach (var file in sourceFolder.GetFiles())
                {
                    file.CopyTo(Path.Combine(destQuestionPictureFolder, file.Name));
                }
            }
        }

        public void DeleteQuestionPictureFolders(string surveyId, IEnumerable<string> questionIds)
        {
            foreach (var questionId in questionIds)
            {
                var pictureFolder = new DirectoryInfo(GetQuestionPictureFolder(surveyId, questionId));
                if (pictureFolder.Exists)
                {
                    pictureFolder.Delete(true);
                }
            }
        }
    }
}