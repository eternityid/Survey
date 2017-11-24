using LearningPlatform.Domain.SurveyLayout;
using System.Collections.Generic;

namespace LearningPlatform.Domain.DefaultData.Templates
{
    public class TemplatesForLayoutWithContainer
    {
        public static List<Template> GetTemplateData()
        {
            var list = new List<Template>();
            AddBodyTemplate(list);
            AddPageTemplate(list);
            AddPageErrorAreaTemplate(list);
            AddPageErrorTemplate(list);
            AddQuestionErrorAreaTemplate(list);
            AddQuestionErrorTemplate(list);
            AddQuestionTemplate(list);
            AddOtherQuestionTemplate(list);
            AddSurveyProgressTemplate(list);
            return list;
        }

        private static void AddBodyTemplate(List<Template> list)
        {
            list.Add(new BodyTemplate
            {
                Name = null,
                Content = @"<div class='data-container'>
                            <div class='data-content'></div>
                            <div class='row'>
                               @page
                           </div><!--row-->
                           @surveyProgress
                        </div> <!--body-content-->",
                IsDefault = true
            });
        }

        private static void AddPageTemplate(List<Template> list)
        {
            list.Add(new PageTemplate
            {
                Name = null,
                Content = @"
                @pageErrorArea
                @questions
                @navigation",
                IsDefault = true
            });
        }

        private static void AddPageErrorAreaTemplate(List<Template> list)
        {
            list.Add(new PageErrorAreaTemplate
            {
                Name = null,
                Content = @"@pageErrors",
                IsDefault = true
            });
        }

        private static void AddPageErrorTemplate(List<Template> list)
        {
            list.Add(new PageErrorTemplate
            {
                Name = null,
                Content = @"
                        <div class='alert alert-warning' role='alert'>
                            @error
                        </div> ",
                IsDefault = true
            });
        }

        private static void AddQuestionErrorAreaTemplate(List<Template> list)
        {
            list.Add(new QuestionErrorAreaTemplate
            {
                Name = null,
                Content = @"
                        <div class='alert alert-info' role='alert'>
                            @questionErrors
                        </div> <!!--errors--> ",
                IsDefault = true
            });
        }

        private static void AddQuestionErrorTemplate(List<Template> list)
        {
            list.Add(new QuestionErrorTemplate
            {
                Name = null,
                Content = @"
                <p>
                    @error
                </p>",
                IsDefault = true
            });
        }

        private static void AddQuestionTemplate(List<Template> list)
        {
            list.Add(new QuestionTemplate
            {
                Name = null,
                Content = @"
                        <div>
                            @questionErrorArea
                        </div>
                        <div class='question'>
                            <div class='question-title'>
                                @questionTitle
                            </div>
                            @questionDescription
                            <div class='inputArea'>
                                @userInputArea
                            </div>  <!--inputArea-->
                        </div>",
                IsDefault = true
            });
        }

        private static void AddOtherQuestionTemplate(List<Template> list)
        {
            list.Add(new OtherQuestionTemplate
            {
                Name = null,
                Content = @"@userInputArea",
                IsDefault = true
            });
        }

        private static void AddSurveyProgressTemplate(List<Template> list)
        {
            list.Add(new SurveyProgressTemplate
            {
                Name = null,
                Content = @"
                        <div class='row'>
                            <label class='progress-label question-title'>Survey Progress</label>
                            <div class='progress'>
                                <div class='progress-bar' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='min-width: 2em; width: @progress%;'>
                                   @progress%
                                </div>
                            </div>
                        </div>",
                IsDefault = true
            });
        }
    }
}
