// Karma configuration
// Generated on Mon Apr 06 2015 14:09:21 GMT+0700 (SE Asia Standard Time)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'scripts/ckeditor/ckeditorConfigPath.js',
            'bower_components/file-saver.js/FileSaver.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/sinonjs/sinon.js',
            'bower_components/jasmine-sinon/lib/jasmine-sinon.js',
            'bower_components/toastr/toastr.js',
            'bower_components/highcharts-release/highcharts.js',
            'bower_components/oidc-token-manager/dist/oidc-token-manager.js',
            'bower_components/moment/moment.js',
            'unitTestInit.js',
            'app/**/!(*[Ss]pec).js',
            'app/**/*[Ss]pec.js',
            'app/survey/**/*.html'
        ],


        // list of files to exclude
        exclude: [
            'app/survey/surveyModule.js'
        ],


        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-junit-reporter',
            'karma-jenkins-reporter',
            'karma-coverage',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/survey/**/*.html': ['ng-html2js'],
            'app/**/!(*[Ss]pec).js': ['coverage']
        },

        ngHtml2JsPreprocessor: {
            // If your build process changes the path to your templates,
            // use stripPrefix and prependPrefix to adjust it.
            stripPrefix: "app/"
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],
        browserNoActivityTimeout: 90000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
