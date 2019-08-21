/**
 * File: gulpfile.js
 * Topic: DTRT WordPress Plugin Boilerplate 
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
 * @version     1.5.13
 */

/* globals require, process */

const gulp = require("gulp");
const color = require("gulp-color");
const download = require("gulp-download");
const eslint = require("gulp-eslint");
const log = require("fancy-log");
const runSequence = require("run-sequence");
const shell = require("gulp-shell");
const unzip = require("gulp-unzip");
const validate = require("gulp-nice-package");

/**
 * Function: is_travis
 * 
 * Determines whether the current Gulp process is running on Travis CI.
 *
 * See: <Default Environment Variables: https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables>.
 *
 * Returns:
 *   (boolean)
 */
function is_travis() {
    return (typeof process.env.TRAVIS !== "undefined");
}

/**
 * Get list of JavaScript files to lint.
 *
 * See: <http://usejsdoc.org/about-including-package.html>.
 * 
 * Returns:
 *   (array) jsFiles - Files
 */
function get_js_files_to_lint() {
    // note: es6 orignals only
    const jsFilesToLint = [
        "gulpfile.js",
        "index.js",
        "test/*.js"
    ];

    return jsFilesToLint;
}

/**
 * Function: decorate_log
 *
 * Log a Gulp task result with emoji and colour.
 * 
 * Parameters:
 *   (object) filePath, messageCount, warningCount, errorCount
 */
function decorate_log( {
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
 *   task_category - Task category (string)
 *   task_action - Task action (string)
 *   task_detail - Task detail (string)
 * 
 * Returns:
 *   (string) Task header
 */
function gulp_helper_taskheader(step, task_category, task_action, task_detail) {

    log(" ");
    log("========================================");
    log(`${step} - ${task_category}:`);
    log(`=> ${task_action}: ${task_detail}`);
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

    gulp_helper_taskheader(
        "1",
        "Dependencies",
        "Install",
        ""
    );

    runSequence(
        "dependencies_docs",
        callback
    );
});

/**
 * Function: dependencies_docs
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
gulp.task("dependencies_docs", () => {

    gulp_helper_taskheader(
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

    gulp_helper_taskheader(
        "2",
        "QA",
        "Lint",
        ""
    );

    runSequence(
        "lint_js",
        "lint_package_json",
        callback
    );
});

/**
 * Function: lint_js
 * 
 * Lint JavaScript files.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("lint_js", () => {

    gulp_helper_taskheader(
        "2a",
        "QA",
        "Lint",
        "JS"
    );

    const files = get_js_files_to_lint();

    // return stream or promise for run-sequence
    return gulp.src(files)
        .pipe(eslint())
        .pipe(eslint.result(result => {
            const { filePath: textstring, messages, warningCount, errorCount } = result;
            const { length: messageCount } = messages;
            
            decorate_log({
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
 * Function: lint_package_json
 * 
 * Lint package.json.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task("lint_package_json", () => {

    gulp_helper_taskheader(
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

    gulp_helper_taskheader(
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

    gulp_helper_taskheader(
        "4",
        "Documentation",
        "Generate",
        "All (PHP & JavaScript)"
    );

    // Quotes escape space better than backslash on Travis
    const naturaldocs_path = "Natural Docs/NaturalDocs.exe"; // eslint-disable-line quotes

    // note: src files are not used,
    // this structure is only used
    // to include the preceding log()
    return gulp.src(dummyFile, {read: false})
        .pipe(shell([
            `mono "${naturaldocs_path}" ./config/naturaldocs`
        ]));
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

    const travis = is_travis();

    gulp_helper_taskheader(
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
    );

    callback();
});
