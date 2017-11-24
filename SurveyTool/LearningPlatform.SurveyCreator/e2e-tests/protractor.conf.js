var path = require('path');

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    allScriptsTimeout: 70000,

    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            args: [
                'disable-extensions'
            ]
        }
    },

    onPrepare: function () {
        var SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: 'all',  //(all|specs|summary|none)
            displayPendingSummary: false,
            colors: {
                success: 'green',
                failure: 'yellow',
                pending: 'white'
            },
            prefixes: {
                success: 'V ',
                failure: 'X ',
                pending: '* '
            }
        }));

        var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
        // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
        jasmine.getEnv().addReporter(
        new Jasmine2HtmlReporter({
            savePath: 'target/screenshots/',
            screenshotsFolder: 'images',
            takeScreenshotsOnlyOnFailures: true,
            fixedScreenshotName: true
        })
      );
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: 'protractorresults',
            filePrefix: 'protractor-test-output'
        }));


        requirePage = function (name) {
            return require(__dirname + "/pages/" + name);
        };
        requireLib = function (name) {
            return require(__dirname + "/lib/" + name);
        };
        requireUtil = function (name) {
            return require(__dirname + '/utils/' + name);
        };
        getBaseUrl = function () {
            if (typeof process.env.BaseURL !== "undefined") {
                return process.env.BaseURL;
            }
            return 'https://localhost:44301/app/';
        };

        getSurveyExecutionUrl = function () {
            if (typeof process.env.SurveyExecutionURL !== "undefined") {
                return process.env.SurveyExecutionURL;
            }
            return 'https://localhost:44304/';
        };
        getLoginUrl = function () {
            if (typeof process.env.LoginURL !== "undefined") {
                return process.env.LoginURL;
            }
            return 'https://localhost:44300/';
        };
    },

    suites: {
        all: [
           'tests/app/survey/surveyList.spec.js',
           'tests/app/survey/SurveyDesigner/question.spec.js',
           'tests/app/survey/SurveyDesigner/page.spec.js',
           'tests/app/survey/SurveyDesigner/surveySettings.spec.js',
           'tests/app/survey/SurveyDesigner/lookAndFeel.spec.js',
           'tests/app/survey/surveyRespondent.spec.js',
           'tests/app/survey/surveyLaunch.spec.js',
           'tests/app/survey/surveyExecution.spec.js',
           'tests/app/survey/surveyResult.spec.js',
           'tests/app/survey/surveyReport.spec.js'
        ],
        surveyList: [
            'tests/app/survey/surveyList.spec.js'
        ],
        surveyDesigner: [
           'tests/app/survey/SurveyDesigner/question.spec.js',
           'tests/app/survey/SurveyDesigner/page.spec.js',
           'tests/app/survey/SurveyDesigner/surveySettings.spec.js',
           'tests/app/survey/SurveyDesigner/lookAndFeel.spec.js'
        ],
        surveyDesigner_question: [
           'tests/app/survey/SurveyDesigner/question.spec.js'
        ],
        surveyDesigner_page: [
            'tests/app/survey/SurveyDesigner/page.spec.js'
        ],
        surveyDesigner_surveySettings: [
            'tests/app/survey/SurveyDesigner/surveySettings.spec.js'
        ],
        surveyDesigner_lookAndFeel: [
            'tests/app/survey/SurveyDesigner/lookAndFeel.spec.js'
        ],
        pages: [
            'tests/app/survey/SurveyDesigner/surveyDesignerPage.spec.js'
        ],
        responses: [
            'tests/app/survey/surveyRespondent.spec.js'
        ],
        launch: [
            'tests/app/survey/surveyLaunch.spec.js'
        ],
        results: [
            'tests/app/survey/surveyResult.spec.js'
        ],
        reports: [
            'tests/app/survey/surveyReport.spec.js'
        ],
        surveyExecution: [
            'tests/app/survey/surveyExecution.spec.js'
        ],
        warmup: [
            'tests/app/survey/warmup.spec.js'
        ],
        smoketest: [
            'tests/app/survey/smoketest.spec.js'
        ]
    },
    framework: 'jasmine2',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 90000,
        print: function () { }
    },
    restartBrowserBetweenTests: false
};
