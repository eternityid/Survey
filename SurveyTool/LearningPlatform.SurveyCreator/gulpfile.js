/*
Examples:
Will serve and open:
    gulp
    gulp --browser=Chrome
    gulp --browser=IExplore
    gulp --browser=Firefox

Will serve and open production build:
    gulp --prod

Serve without opening new browser:
    gulp serve

Open in a new browser:
    gulp open --browser=Chrome

Build only:
    gulp build --prod
    gulp build --production

Karma:
    gulp karma --browser=Chrome
    gulp karma --browser=Firefox
 */

var gulp = require('gulp'),
    argv = require('yargs').argv,
    concat = require('gulp-concat'),
    templateCache = require('gulp-angular-templatecache'),
    jshint = require('gulp-jshint'),
    cdnizer = require("gulp-cdnizer"),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean'),
    changed = require('gulp-changed'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    debug = require('gulp-debug'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    order = require("gulp-order"),
    preprocess = require('gulp-preprocess'),
    plumber = require('gulp-plumber'),
    Server = require('karma').Server,
    less = require('gulp-less'),
    protractor = require("gulp-protractor").protractor;

var sourceFiles = {
    scripts: ['app/**/*.js', '!app/**/angular-sanitize.js', '!app/**/angular-sanitize.min.js'],
    assets: ['assets/**/*', '!assets/less/**/*', '!assets/less/', '!assets/css/index.css'],
    silentRenew: ['app/silent_renew.html'],
    lessIndex: ['assets/less/index.less'],
    less: ['assets/less/**/*.less'],
    fonts: ['bower_components/font-awesome/fonts/**/*', 'bower_components/bootstrap/fonts/**/*'],
    angularTemplates: ['app/**/*.html', '!app/index.html', '!app/silent_renew.html'],
    ckeditorRequired: ['thirdParties/ckeditor/contents.css', 'thirdParties/ckeditor/styles.js'],
    ckeditorSkin: ['thirdParties/ckeditor/skins/**/*'],
    ckeditorPluginsIcon: ['thirdParties/ckeditor/plugins/*.png'],
    ckeditorPluginsImage: ['thirdParties/ckeditor/plugins/image/**/*'],
    ckeditorPluginsLink: ['thirdParties/ckeditor/plugins/link/**/*'],
    ckeditorPluginsSourcedialog: ['thirdParties/ckeditor/plugins/sourcedialog/**/*',
        'thirdParties/ckeditor/plugins/sourcedialog/*.js'],

    ckeditorSpecialChar: ['thirdParties/ckeditor/plugins/specialchar/**/*',
        'thirdParties/ckeditor/plugins/specialchar/*.js'],

    ckeditorTable: ['thirdParties/ckeditor/plugins/table/**/*',
        'thirdParties/ckeditor/plugins/table/*.js'],

    ckeditorAbout: ['thirdParties/ckeditor/plugins/about/**/*',
        'thirdParties/ckeditor/plugins/about/*.js'],

    ckeditorClipboard: ['thirdParties/ckeditor/plugins/clipboard/**/*',
        'thirdParties/ckeditor/plugins/clipboard/*.js'],

    ckeditorPastefromword: ['thirdParties/ckeditor/plugins/pastefromword/**/*',
        'thirdParties/ckeditor/plugins/pastefromword/*.js'],

    ckeditorScayt: ['thirdParties/ckeditor/plugins/scayt/**/*',
        'thirdParties/ckeditor/plugins/scayt/*.js'],

    ckeditorWsc: ['thirdParties/ckeditor/plugins/wsc/**/*',
        'thirdParties/ckeditor/plugins/wsc/*.js'],

    ckeditorPluginsWidget: ['thirdParties/ckeditor/plugins/widget/**/*', 'thirdParties/ckeditor/plugins/widget/*.js'],
    ckeditorPluginsSvtInsertHelper: ['scripts/ckeditor/plugins/svtinserthelper/**/*', 'scripts/ckeditor/plugins/svtinserthelper/*.js'],
    ckeditorPluginsSvtQuestionPlaceholder: ['scripts/ckeditor/plugins/svtquestionplaceholder/**/*', 'scripts/ckeditor/plugins/svtquestionplaceholder/*.js'],
    ckeditorPluginsSvtSurveyLink: ['scripts/ckeditor/plugins/svtsurveylink/**/*', 'scripts/ckeditor/plugins/svtsurveylink/*.js'],
    ckeditorPluginsSvtrespondentplaceholder: ['scripts/ckeditor/plugins/svtrespondentplaceholder/**/*', 'scripts/ckeditor/plugins/svtrespondentplaceholder/*.js'],
    ckeditorPluginsSvtinsertfromfilelibrary: ['scripts/ckeditor/plugins/svtinsertfromfilelibrary/**/*', 'scripts/ckeditor/plugins/svtinsertfromfilelibrary/*.js']
};

var destinationPaths = {
    base: 'dest',
    temp: 'temp',
    fonts: 'dest/assets/fonts',
    assets: 'dest/assets',
    less: 'assets/css',
    ckeditor: 'dest/ckeditor',
    ckeditorSkin: 'dest/ckeditor/skins',
    ckeditorPluginsIcon: 'dest/ckeditor/plugins',
    ckeditorPluginsImage: 'dest/ckeditor/plugins/image',
    ckeditorPluginsLink: 'dest/ckeditor/plugins/link',
    ckeditorPluginsSourcedialog: 'dest/ckeditor/plugins/sourcedialog',
    ckeditorSpecialChar: 'dest/ckeditor/plugins/specialchar',
    ckeditorTable: 'dest/ckeditor/plugins/table',
    ckeditorAbout: 'dest/ckeditor/plugins/about',
    ckeditorClipboard: 'dest/ckeditor/plugins/clipboard',
    ckeditorPastefromword: 'dest/ckeditor/plugins/pastefromword',
    ckeditorScayt: 'dest/ckeditor/plugins/scayt',
    ckeditorWsc: 'dest/ckeditor/plugins/wsc',
    ckeditorPluginsWidget: 'dest/ckeditor/plugins/widget',
    ckeditorPluginsSvtInsertHelper: 'dest/ckeditor/plugins/svtinserthelper',
    ckeditorPluginsSvtQuestionPlaceholder: 'dest/ckeditor/plugins/svtquestionplaceholder',
    ckeditorPluginsSvtSurveyLink: 'dest/ckeditor/plugins/svtsurveylink',
    ckeditorPluginsSvtinsertfromfilelibrary: 'dest/ckeditor/plugins/svtinsertfromfilelibrary',
    ckeditorPluginsSvtrespondentplaceholder: 'dest/ckeditor/plugins/svtrespondentplaceholder'
};

var isProductionBuild = argv.production || argv.prod;
var browser = argv.browser;

gulp.task('default', ['serve'], function () {
    runSequence('open');
});

gulp.task('serve', ['build', 'webServer', 'watch']);
gulp.task('build', isProductionBuild ? ['lint', 'less', 'silent_renew', 'js', 'copy'] : ['lint', 'less']);
gulp.task('clean', ['cleanBase', 'cleanTemp']);

gulp.task('cleanTemp', function () {
    return gulp.src(destinationPaths.temp, { read: false })
        .pipe(clean());
});

gulp.task('cleanBase', function () {
    return gulp.src(destinationPaths.base, { read: false })
        .pipe(clean());
});

gulp.task('lint', function () {
    return gulp.src(sourceFiles.scripts)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('angularTemplates', function () {
    return gulp.src(sourceFiles.angularTemplates)
        .pipe(order(['**/*.html']))
        .pipe(templateCache('surveyCreatorTemplates.js', { module: 'svt' }))
        .pipe(gulp.dest(destinationPaths.temp));
});

gulp.task('silent_renew', function () {
    var useRefAssets = useref.assets();

    return gulp.src(sourceFiles.silentRenew)
        .pipe(useRefAssets) // Build the blocks in index.html. The index.html will not be in the stream.
        .pipe(uglify())
        .pipe(useRefAssets.restore())
        .pipe(useref())
        .pipe(gulp.dest(destinationPaths.base));
});

gulp.task('js', ['angularTemplates'], function () {
    var useRefAssets = useref.assets();
    var addsrc = require("gulp-add-src");

    return gulp.src('./app/index.html')
        .pipe(cdnizer(
            {
                relativeRoot: './app/',
                allowRev: false,
                files: ['google:angular-resource', 'google:angular', 'google:angular-route', 'google:jquery', 'google:angular:angular-sanitize.js']
            }))
        .pipe(useRefAssets) // Build the blocks in index.html. The index.html will not be in the stream.
        .pipe(addsrc('temp/surveyCreatorTemplates.js')) // gulp.src did not work so I had to use a plugin
        .pipe(order(['**/surveyCreator.js'])) // Make sure that surveyCreator.js is the first file so that it is before the surveyCreatorTemplates.js
        .pipe(gulpif('**/surveyCreator.js', preprocess())) // Handle @ifdef, @if etc in config
        .pipe(gulpif('**/combinedCkeditor.js', preprocess())) // Handle @ifdef, @if etc in config
        .pipe(gulpif('**/surveyCreator*.js', concat('surveyCreator.js'))) // Concatenating the surveyCreator.js and surveyCreatorTemplates.js => surveyCreator.js
        .pipe(gulpif(['**/*.js', '!**/combinedCkeditor.js', '!**/combined.js'], uglify())) // Minify all js files except ckEditor and combined js with bower components
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(rev()) // Add revisions to the file names
        .pipe(useRefAssets.restore()) // restore back the index.html
        .pipe(revReplace())  // Substitute in new filenames
        .pipe(useref()) // Required by useref
        .pipe(gulp.dest(destinationPaths.base))
        .pipe(connect.reload()); // Live reload
});

gulp.task('less', function () {
    return gulp.src(sourceFiles.lessIndex)
        .pipe(less())
        .pipe(gulp.dest(destinationPaths.less))
        .pipe(connect.reload());
});

gulp.task('webServer', function () {
    var options;
    if (isProductionBuild) {
        options = {
            root: 'dest/',
            livereload: true,
            port: 4000
        };
    } else {
        options = {
            livereload: true,
            port: 4001
        };
    }
    connect.server(options);
});

gulp.task('open', function () {
    var uri = isProductionBuild ? 'http://localhost:4000/' : 'http://localhost:4001/app/';
    gulp.src('')
        .pipe(open({
            uri: uri,
            app: browser
        }));
});

gulp.task('copy', ['copyFonts', 'copyAssets', 'copyCkeditor']);

gulp.task('copyAssets', function () {
    return gulp.src(sourceFiles.assets)
        .pipe(gulp.dest(destinationPaths.assets));
});

gulp.task('copyFonts', function () {
    return gulp.src(sourceFiles.fonts)
        .pipe(gulp.dest(destinationPaths.fonts));
});

gulp.task('copyCkeditor', function () {
    gulp.src(sourceFiles.ckeditorRequired)
        .pipe(gulp.dest(destinationPaths.ckeditor));

    gulp.src(sourceFiles.ckeditorSkin)
        .pipe(gulp.dest(destinationPaths.ckeditorSkin));

    gulp.src(sourceFiles.ckeditorPluginsIcon)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsIcon));

    gulp.src(sourceFiles.ckeditorPluginsImage)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsImage));

    gulp.src(sourceFiles.ckeditorPluginsSourcedialog)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsSourcedialog));

    gulp.src(sourceFiles.ckeditorSpecialChar)
        .pipe(gulp.dest(destinationPaths.ckeditorSpecialChar));

    gulp.src(sourceFiles.ckeditorTable)
        .pipe(gulp.dest(destinationPaths.ckeditorTable));

    gulp.src(sourceFiles.ckeditorAbout)
        .pipe(gulp.dest(destinationPaths.ckeditorAbout));

    gulp.src(sourceFiles.ckeditorClipboard)
        .pipe(gulp.dest(destinationPaths.ckeditorClipboard));

    gulp.src(sourceFiles.ckeditorWsc)
        .pipe(gulp.dest(destinationPaths.ckeditorWsc));

    gulp.src(sourceFiles.ckeditorPastefromword)
        .pipe(gulp.dest(destinationPaths.ckeditorPastefromword));

    gulp.src(sourceFiles.ckeditorScayt)
        .pipe(gulp.dest(destinationPaths.ckeditorScayt));

    gulp.src(sourceFiles.ckeditorWsc)
        .pipe(gulp.dest(destinationPaths.ckeditorWsc));

    gulp.src(sourceFiles.ckeditorPluginsWidget)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsWidget));

    gulp.src(sourceFiles.ckeditorPluginsSvtInsertHelper)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsSvtInsertHelper));

    gulp.src(sourceFiles.ckeditorPluginsSvtQuestionPlaceholder)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsSvtQuestionPlaceholder));

    gulp.src(sourceFiles.ckeditorPluginsSvtSurveyLink)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsSvtSurveyLink));

    gulp.src(sourceFiles.ckeditorPluginsSvtinsertfromfilelibrary)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsSvtinsertfromfilelibrary));

    gulp.src(sourceFiles.ckeditorPluginsSvtrespondentplaceholder)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsSvtrespondentplaceholder));

    return gulp.src(sourceFiles.ckeditorPluginsLink)
        .pipe(gulp.dest(destinationPaths.ckeditorPluginsLink));
});


gulp.task('karma', function (done) {
    browser =  browser || 'Chrome';
    new Server({
        configFile: __dirname + '/karma.conf.js',
        action: 'run',
        browsers: [browser],
        singleRun: true,
        reporters: ['progress', 'junit', 'coverage'],
        junitReporter: {
            outputDir: 'karmaresults',
            outputFile: undefined,
            suite: '',
            useBrowserName: true
        },
        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'cobertura', subdir: '.' },
                { type: 'lcov', subdir: '.' }
            ]
        }
    }, done).start();
});

gulp.task('watch', function () {
    gulp.watch([sourceFiles.scripts], ['lint', 'js-dev']).on('error', swallowError);
    gulp.watch([sourceFiles.less], ['less']).on('error', swallowError);
    gulp.watch([sourceFiles.angularTemplates], ['html-dev']).on('error', swallowError);
});

gulp.task('js-dev', function () {
    return gulp.src(sourceFiles.scripts)
        .pipe(connect.reload());
});

gulp.task('html-dev', function () {
    return gulp.src(sourceFiles.angularTemplates)
        .pipe(connect.reload());
});

gulp.task('protractor', function () {
    return gulp.src(["./e2e-tests/tests/*.js"])
        .pipe(protractor({
            configFile: "./e2e-tests/protractor.conf.js",
            args: ['--suite', 'nothing']
        }));
});

function swallowError(error) { error.end(); }