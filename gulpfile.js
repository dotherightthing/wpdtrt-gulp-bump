/**
 * File: gulpfile.js
 * Topic: DTRT WordPress Plugin Bump
 * 
 * Gulp build tasks.
 *
 * 1. Install Yarn dependencies, then run the following scripts
 * ---
 * yarn install
 * ---
 *
 * 2. Install documentation dependencies
 * ---
 * yarn run dependencies
 * ---
 *
 * 3. Run code linting
 * ---
 * yarn run lint
 * ---
 *
 * 4. Run unit tests
 * ---
 * yarn run test
 * ---
 *
 * 5. Generate documentation to <docs/>
 * ---
 * yarn run docs
 * ---
 *
 * 6. Optimise files
 * ---
 * yarn run optimise
 * ---
 *
 * 7. Package release
 * ---
 * yarn run release
 * ---
 */

/* globals require, process */

const gulp = require("gulp");
const color = require("gulp-color");
const download = require("gulp-download");
const eslint = require("gulp-eslint");
const log = require("fancy-log");
const runSequence = require("run-sequence");
const shell = require("gulp-shell");
const svgo = require("gulp-svgo");
const unzip = require("gulp-unzip");
const validate = require("gulp-nice-package");
const zip = require("gulp-zip");

const distDir = getPluginName;

// Input files.
const jsFilesToLint = [
    "gulpfile.js",
    "index.js",
    "test/*.js"
];
const svgFiles = "readme-styles/icons/*.svg";

/**
 * Function: getPluginName
 * 
 * Get the pluginName from package.json.
 *
 * Returns:
 *   (string) pluginName
 */
function getPluginName() {
    // pop() - remove the last element from the path array and return it
    const pluginName = process.cwd().split("/").pop();

    return pluginName;
}

/**
 * Function: isTravis
 * 
 * Determines whether the current Gulp process is running on Travis CI.
 *
 * See: <Default Environment Variables: https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables>.
 *
 * Returns:
 *   (boolean)
 */
function isTravis() {
    return (typeof process.env.TRAVIS !== "undefined");
}

/**
 * Function: decorateLog
 *
 * Log a Gulp task result with emoji and colour.
 * 
 * Parameters:
 *   (object) filePath, messageCount, warningCount, errorCount
 */
function decorateLog( {
    textstring = "",
    messageCount = 0,
    warningCount = 0,
    errorCount = 0
} = {} ) {
    const colors = { pass: "GREEN", message: "WHITE", warning: "YELLOW", error: "RED" };
    const emojis = { pass: "✔", message: "✖", warning: "✖", error: "✖" };
    let state;

    if ( errorCount > 0 ) {
        state = "error";
    } else if ( warningCount > 0 ) {
        state = "warning";
    } else if ( messageCount > 0 ) {
        state = "message";
    } else {
        state = "pass";
    }

    console.log( color( `${emojis[state]} ${textstring}`, `${colors[state]}` ) );
}

/**
 * Displays a block comment for each task that runs.
 *
 * Parameters:
 *   step - Step number (string)
 *   taskCategory - Task category (string)
 *   taskAction - Task action (string)
 *   taskDetail - Task detail (string)
 * 
 * Returns:
 *   (string) Task header
 */
function gulpHelperTaskheader(
    step = "0",
    taskCategory = "",
    taskAction = "",
    taskDetail = ""
) {

    log(" ");
    log("========================================");
    log(`${step} - ${taskCategory}:`);
    log(`=> ${taskAction}: ${taskDetail}`);
    log("----------------------------------------");
    log(" ");
}

const dummyFile = "README.md";

/**
 * Namespace: gulp
 *
 * Gulp tasks.
 */

/**
 * About: runSequenceCallback
 *
 * Tells runSequence that a task has finished..
 * 
 * By returning a stream,
 * the task system is able to plan the execution of those streams.
 * But sometimes, especially when you're in callback hell
 * or calling some streamless plugin,
 * you aren't able to return a stream.
 * That's what the callback is for.
 * To let the task system know that you're finished
 * and to move on to the next call in the execution chain.
 *
 * See <Where is the gulp task callback function defined?: https://stackoverflow.com/a/29299107/6850747>
 */

/**
 * Method: dependencies
 * 
 * Tasks which install dependencies.
 *
 * Parameters:
 *   callback - The runSequenceCallback that handles the response
 */
gulp.task("dependencies", (callback) => {

    gulpHelperTaskheader(
        "1",
        "Dependencies",
        "Install"
    );

    runSequence(
        "dependenciesDocs",
        callback
    );
});

/**
 * Function: dependenciesDocs
 * 
 * Install documentation dependencies.
 * 
 * Natural Docs can't be installed via Yarn
 * as the Github release needs to be compiled,
 * and the download archive on the website
 * is in .zip rather than .tar format.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("dependenciesDocs", () => {

    gulpHelperTaskheader(
        "1a",
        "Dependencies",
        "Install",
        "Docs"
    );

    const url = "https://naturaldocs.org/download/natural_docs/"
    + "2.0.2/Natural_Docs_2.0.2.zip";

    // return stream or promise for run-sequence
    return download(url)
        .pipe( unzip() )
        .pipe( gulp.dest("./" ) );
});

/**
 * Function: lint
 * 
 * Lint files.
 *
 * Parameters:
 *   callback - The runSequenceCallback that handles the response
 */
gulp.task("lint", (callback) => {

    gulpHelperTaskheader(
        "2",
        "QA",
        "Lint"
    );

    runSequence(
        "lintJS",
        "lintPackageJson",
        callback
    );
});

/**
 * Function: lintJS
 * 
 * Lint JavaScript files.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("lintJS", () => {

    gulpHelperTaskheader(
        "2a",
        "QA",
        "Lint",
        "JS"
    );

    const files = jsFilesToLint;

    // return stream or promise for run-sequence
    return gulp.src( files )
        .pipe( eslint() )
        .pipe( eslint.result( result => {
            const { filePath: textstring, messages, warningCount, errorCount } = result;
            const { length: messageCount } = messages;
            
            decorateLog({
                textstring,
                messageCount,
                warningCount,
                errorCount
            });
        }))
        .pipe(eslint.format());
        // .pipe(eslint.failAfterError());
});

/**
 * Function: lintPackageJson
 * 
 * Lint package.json.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("lintPackageJson", () => {

    gulpHelperTaskheader(
        "2b",
        "QA",
        "Lint",
        "package.json"
    );

    // return stream or promise for run-sequence
    return gulp.src("package.json")
        .pipe(validate({
            recommendations: false
        }));
});

/**
 * Function: test
 * 
 * Run mocha unit tests.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("test", () => {

    gulpHelperTaskheader(
        "3",
        "Documentation",
        "Run tests",
        "Mocha"
    );

    // note: src files are not used,
    // this structure is only used
    // to include the preceding log()
    return gulp.src(dummyFile, {read: false})
        .pipe(shell([
            "mocha"
        ]));
});

/**
 * Function: docs
 * 
 * Generate JS & PHP documentation.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("docs", () => {

    gulpHelperTaskheader(
        "4",
        "Documentation",
        "Generate",
        "All (PHP & JavaScript)"
    );

    // Quotes escape space better than backslash on Travis
    const naturalDocsPath = "Natural Docs/NaturalDocs.exe";

    // note: src files are not used,
    // this structure is only used
    // to include the preceding log()
    return gulp.src(dummyFile, {read: false})
        .pipe(shell([
            `mono "${naturalDocsPath}" ./config/naturaldocs`
        ]));
});

/**
 * Function: optimise
 * 
 * Reduce file size of input.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task( "optimise", () => {

    gulpHelperTaskheader(
        "5",
        "Optimise",
        "SVG"
    );

    // compress to same folder
    return gulp.src( svgFiles )
        .pipe( svgo() )
        .pipe( gulp.dest( "readme-styles/icons/optimised" ) );
});

/**
 * Method: release
 * 
 * Tasks which package a release.
 *
 * Parameters:
 *   callback - The runSequenceCallback that handles the response
 */
gulp.task("release", (callback) => {

    const travis = isTravis();

    if (travis) {
        gulpHelperTaskheader(
            "6",
            "Release",
            "Generate"
        );

        runSequence(
            "releaseYarnDist",
            "releaseCopy",
            "releaseZip",
            callback
        );
    } else {
        callback();
    }
});

/**
 * Method: releaseYarnDist
 * 
 * Uninstall Yarn development dependencies.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("releaseYarnDist", () => {

    gulpHelperTaskheader(
        "6a",
        "Release",
        "Uninstall dev dependencies",
        "Yarn"
    );

    // return stream or promise for run-sequence
    return gulp.src(dummyFile, {read: false})
        .pipe(shell([
            "yarn install --non-interactive --production"
        ]));
});

/**
 * Method: releaseCopy
 * 
 * Copy release files to a temporary folder
 * 
 * See: <globtester: http://www.globtester.com/>
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("releaseCopy", () => {

    gulpHelperTaskheader(
        "6b",
        "Release",
        "Copy files",
        "To temporary folder"
    );

    // Release files are those that are required
    // to use the package as a WP Plugin
    const releaseFiles = [
        "docs",
        "readme-styles",
        "index.js",
        "README.md"
    ];

    // return stream or promise for run-sequence
    // https://stackoverflow.com/a/32188928/6850747
    return gulp.src(releaseFiles, {base: "."})
        .pipe(print())
        .pipe(gulp.dest(distDir));
});

/**
 * Method: releaseZip
 * 
 * Generate release.zip for deployment by Travis/Github.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("releaseZip", () => {

    gulpHelperTaskheader(
        "6c",
        "Release",
        "Generate",
        "ZIP file"
    );

    // return stream or promise for run-sequence
    // https://stackoverflow.com/a/32188928/6850747
    return gulp.src([
        `./${distDir}/**/*`
    ], {base: "."})
        .pipe(zip("release.zip"))
        .pipe(gulp.dest("./"));
});

/**
 * Function: default
 * 
 * Default task
 *
 * Parameters:
 *   callback - The callback that handles the response
 *
 * ---
 * gulp
 * ---
 */
gulp.task("default", (callback) => {

    const travis = isTravis();

    gulpHelperTaskheader(
        "0",
        "Installation",
        "Gulp",
        `Install${ travis ? " and package for release" : ""}`
    );

    runSequence(
        // 1
        "dependencies",
        // 2
        "lint",
        // 3
        "test",
        // 4
        "docs",
        // 5
        "optimise",
        // 6
        "release"
    );

    callback();
});
