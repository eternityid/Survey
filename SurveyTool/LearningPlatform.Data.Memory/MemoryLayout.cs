using LearningPlatform.Domain.SurveyLayout;
using System.Collections.Generic;

namespace LearningPlatform.Data.Memory
{
    public class MemoryLayout
    {
        public static Layout Create()
        {
            return new Layout
            {
                Id = "000000000000000000000001",
                Name = "Default Layout",
                Css = "defaultLayout.css",
                Templates = new List<Template>
                {
                    new BodyTemplate
                    {
                        IsDefault = true,
                        Content =
@"<div>
   <div class=""row"">
       @page
   </div><!--row-->
</div> <!--body-content-->
@surveyProgress"
                    },
                    new PageTemplate
                    {
                        IsDefault = true,
                        Content = @"
@pageErrorArea
@questions
@navigation"
                    },
                    new PageErrorAreaTemplate
                    {
                        IsDefault = true,
                        Content = "@pageErrors"
                    },
                    new PageErrorTemplate
                    {
                        IsDefault = true,
                        Content = @"
<div class=""alert alert-warning"" role=""alert"">
@error
</div>"
                    },
                    new QuestionErrorAreaTemplate
                    {
                        IsDefault = true,
                        Content = @"
<div class=""alert alert-info"" role=""alert"">
@questionErrors
</div> <!!--errors-->"
                    },
                    new QuestionErrorTemplate
                    {
                        IsDefault = true,
                        Content = @"
<p>
@error
</p>"
                    },
                    new QuestionTemplate
                    {
                        IsDefault = true,
                        Content = @"
<div>
    @questionErrorArea
</div>
<div class='question'>
    <div class='question-title'>
        @questionTitle
    </div>
    @questionDescription
    <div class=""inputArea"">
        @userInputArea
    </div>  <!--inputArea-->
</div>"
                    },
                    new OtherQuestionTemplate
                    {
                        IsDefault = true,
                        Content = "@userInputArea",
                    },
                    new SurveyProgressTemplate
                    {
                        IsDefault =  true,
                        Content = @"
<div class=""row"">
    <label class=""progress-label question-title"">Survey Progress</label>
    <div class=""progress"">
        <div class=""progress-bar"" role=""progressbar"" aria-valuenow=""60"" aria-valuemin=""0"" aria-valuemax=""100"" style=""min-width: 2em; width: @progress%;"">
           @progress%
        </div>
    </div>
</div>"
                    }
                }
            };

        }
    }
}
