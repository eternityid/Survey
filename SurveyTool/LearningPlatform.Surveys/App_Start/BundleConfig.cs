using System.Web.Optimization;

namespace LearningPlatform
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/extension").Include(
                "~/Scripts/select2.min.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap.js",
                "~/Scripts/respond.js"));
            bundles.Add(new ScriptBundle("~/bundles/global").Include(
                "~/Scripts/global/globalConstants.js",
                "~/Scripts/global/globalQuestions.js",
                "~/Scripts/global/questionType.js"));
            bundles.Add(new ScriptBundle("~/bundles/utils").Include(
                "~/Scripts/utils/arrayUtil.js",
                "~/Scripts/utils/eventUtil.js",
                "~/Scripts/utils/stringUtil.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/utils").Include(
                "~/Scripts/execution/utils/renderUtil.js",
                "~/Scripts/execution/utils/mobileRenderUtil.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/desktopUtils").Include(
                "~/Scripts/execution/utils/progressBarUtilDesktop.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/mobileUtils").Include(
                "~/Scripts/execution/utils/progressBarUtilMobile.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/generalDesktop").Include(
                "~/Scripts/execution/general/generalPage.js",
                "~/Scripts/execution/general/generalPageDesktop.js",
                "~/Scripts/execution/general/generalQuestion.js",
                "~/Scripts/execution/general/generalQuestionDesktop.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/generalMobile").Include(
                "~/Scripts/execution/general/generalPage.js",
                "~/Scripts/execution/general/generalPageMobile.js",
                "~/Scripts/execution/general/generalPagePreload.js",
                "~/Scripts/execution/general/generalQuestion.js",
                "~/Scripts/execution/general/generalQuestionMobile.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/questionTypes").Include(
                "~/Scripts/execution/questionTypes/gridQuestion.js",
                "~/Scripts/execution/questionTypes/informationQuestion.js",
                "~/Scripts/execution/questionTypes/pictureQuestion.js",
                "~/Scripts/execution/questionTypes/questionWithOption.js",
                "~/Scripts/execution/questionTypes/questionWithRatingOption.js",
                "~/Scripts/execution/questionTypes/textListQuestion.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/questionTypesDesktop").Include(
                "~/Scripts/execution/questionTypes/dateQuestionDesktop.js",
                "~/Scripts/execution/questionTypes/questionWithOptionDesktop.js",
                "~/Scripts/execution/questionTypes/pictureQuestionDesktop.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/questionTypesMobile").Include(
                "~/Scripts/execution/questionTypes/dateQuestionMobile.js",
                "~/Scripts/execution/questionTypes/pictureQuestionMobile.js",
                "~/Scripts/execution/questionTypes/singleMultiplePictureQuestionMobile.js",
                "~/Scripts/execution/questionTypes/singleMultipleSelectionQuestionMobile.js"));
            bundles.Add(new ScriptBundle("~/bundles/indexDesktop").Include(
                "~/Scripts/indexDesktop.js"));
            bundles.Add(new ScriptBundle("~/bundles/indexMobile").Include(
                "~/Scripts/indexMobile.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/validation").Include(
                "~/Scripts/execution/validation/generalQuestionValidation.js",
                "~/Scripts/execution/validation/gridQuestionValidation.js",
                "~/Scripts/execution/validation/decimalPlacesNumberValidation.js",
                "~/Scripts/execution/validation/lengthValidation.js",
                "~/Scripts/execution/validation/rangeNumberValidation.js",
                "~/Scripts/execution/validation/requiredValidation.js",
                "~/Scripts/execution/validation/selectionValidation.js",
                "~/Scripts/execution/validation/wordsAmountValidation.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/questionNavigationDesktop").Include(
                "~/Scripts/execution/navigation/generalQuestionNavigation.js",
                "~/Scripts/execution/navigation/generalQuestionNavigationDesktop.js",
                "~/Scripts/execution/navigation/gridQuestionNavigationDesktop.js",
                "~/Scripts/execution/navigation/pictureQuestionNavigation.js",
                "~/Scripts/execution/navigation/questionWithOptionNavigation.js",
                "~/Scripts/execution/navigation/ratingQuestionNavigation.js",
                "~/Scripts/execution/navigation/selectionQuestionNavigation.js",
                "~/Scripts/execution/navigation/textQuestionNavigation.js",
                "~/Scripts/execution/navigation/pageNavigation.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/questionNavigationMobile").Include(
                "~/Scripts/execution/navigation/generalQuestionNavigation.js",
                "~/Scripts/execution/navigation/generalQuestionNavigationMobile.js"));
            bundles.Add(new ScriptBundle("~/bundles/execution/keyboardSupportDesktop").Include(
                "~/Scripts/execution/keyboardSupport/hotkey.js",
                "~/Scripts/execution/keyboardSupport/keyboardSupportDesktop.js"));
            bundles.Add(new ScriptBundle("~/bundles/questionPerScreen").Include(
                "~/Scripts/questionPerScreen.js"));
            bundles.Add(new ScriptBundle("~/bundles/jquery.hotkeys").Include(
                "~/Scripts/jquery.hotkeys.js"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap-rating-desktop").Include(
                "~/Scripts/bootstrap-rating-custom-desktop.js"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap-rating-mobile").Include(
                "~/Scripts/bootstrap-rating-custom-mobile.js"));
            bundles.Add(new ScriptBundle("~/bundles/question-preview").Include(
                "~/Scripts/question-preview.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/select2.css",
                "~/Content/pickmeup.css",
                "~/Content/site.css",
                "~/Content/bootstrap-rating.css"));

            bundles.Add(new StyleBundle("~/Content/questionperscreen").Include(
                "~/Content/question-per-screen.css"));
            bundles.Add(new StyleBundle("~/Content/desktopstyle").Include(
                "~/Content/desktop-style.css"));
            bundles.Add(new StyleBundle("~/Content/bootstrapcss").Include(
                "~/Content/bootstrap.css", new CssRewriteUrlTransform()));
        }
    }
}