/**
 * File: test/index.js
 * Topic: DTRT WordPress Plugin Boilerplate 
 * 
 * Unit tests for wpdtrtPluginBump utility.
 */

/* globals require */

// https://artandlogic.com/2014/05/a-simple-gulp-plugin/
// https://duske.me/simple-functional-tests-for-gulp-tasks/
// https://github.com/stevelacy/gulp-bump/blob/master/test/index.js
// https://github.com/lazd/gulp-replace/blob/master/test/main.js
// https://samwize.com/2014/02/08/a-guide-to-mochas-describe-it-and-setup-hooks/
// https://gulpjs.org/writing-a-plugin/testing (TODO)

// 1. `describe()` is merely for grouping, which you can nest as deep
// 2. `it()` is a test case
// 3. `before()`, `beforeEach()`, `after()`, `afterEach()` are hooks to run
// before/after first/each it() or describe().
// `before()` is run before first it()/describe()

const gulp = require("gulp");
const chai = require("chai");
const fs = require("fs");
const mocha = require("mocha");

chai.use(require("chai-diff"));

// fix for "mocha is assigned a value but never used"
const before = mocha.before;
const describe = mocha.describe;
const expect = chai.expect;
const it = mocha.it;

// our plugin
const wpdtrtPluginBump = require("../index.js");

describe("Test plugin", function () {
    // increase default timeout in case assert operations take too long (i/o usage)
    // https://duske.me/simple-functional-tests-for-gulp-tasks/
    this.timeout(4000);

    function compare_output_with_expected(
        filename,
        output_path,
        expected_path,
        done
    ) {

        // https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback

        fs.readFile( output_path + filename, "utf8", (output_error, output_data) => {

            if (output_error) {
                throw output_error;
            }

            fs.readFile(expected_path + filename, "utf8", (expected_error, expected_data) => {

                if (expected_error) {
                    throw expected_error;
                }

                expect(output_data).not.differentFrom(expected_data);

                if (done !== null) {
                    done();
                }
            });
        });
    }

    const timestamp = new Date().getTime();
    const wpdtrt_plugin_boilerplate_input_path = "test/fixtures/wpdtrt-plugin-boilerplate/";
    const wpdtrt_plugin_boilerplate_output_path = `tmp/${timestamp}/wpdtrt-plugin-boilerplate/`;
    const wpdtrt_plugin_boilerplate_expected_path = "test/expected/wpdtrt-plugin-boilerplate/";
    const root_input_path = "test/fixtures/wpdtrt-plugin/";
    const root_output_path = `tmp/${timestamp}/wpdtrt-plugin/`;
    const root_expected_path = "test/expected/wpdtrt-plugin/";
    const plugin_parent_files = [
        "config/naturaldocs/Project.txt",
        "src/Plugin.php",
        "src/Rewrite.php",
        "src/Shortcode.php",
        "src/Taxonomy.php",
        "src/TemplateLoader.php",
        "src/Widget.php",
        "tests/generated-plugin/src/class-wpdtrt-test-plugin.php",
        "tests/generated-plugin/src/class-wpdtrt-test-rewrite.php",
        "tests/generated-plugin/src/class-wpdtrt-test-shortcode.php",
        "tests/generated-plugin/src/class-wpdtrt-test-taxonomy.php",
        "tests/generated-plugin/src/class-wpdtrt-test-widget.php",
        "tests/generated-plugin/readme.txt",
        "tests/generated-plugin/wpdtrt-test.php",
        "composer.json",
        "gulpfile.js",
        "index.php"
    ];
    const plugin_child_files = [
        "config/naturaldocs/Project.txt",
        "src/class-wpdtrt-plugin-plugin.php",
        "src/class-wpdtrt-plugin-rewrite.php",
        "src/class-wpdtrt-plugin-shortcode.php",
        "src/class-wpdtrt-plugin-taxonomy.php",
        "src/class-wpdtrt-plugin-widget.php",
        "gulpfile.js",
        "readme.txt",
        "wpdtrt-plugin.php"
    ];
    let callback = null;

    describe("Test orphan parent", () => {

        // Setup
        before( () => {

            // run plugin, to copy fixtures to transformed output
            gulp.task("wpdtrtPluginBumpParent", wpdtrtPluginBump({
                wpdtrt_plugin_boilerplate_input_path: wpdtrt_plugin_boilerplate_input_path,
                wpdtrt_plugin_boilerplate_output_path: wpdtrt_plugin_boilerplate_output_path,
                root_input_path: wpdtrt_plugin_boilerplate_input_path,
                root_output_path: wpdtrt_plugin_boilerplate_output_path
            }));
        });

        it("Parent as orphan - plugin should run without error", (done) => {
            // pseudo-task
            gulp.task("test", ["wpdtrtPluginBumpParent"], () => {
                done();
            });
            gulp.start("test");
        });

        it("Parent as orphan - files should be versioned correctly", (done) => {

            gulp.task("test", ["wpdtrtPluginBumpParent"], () => {

                // wait for wpdtrtPluginBump to finish writing output to the file system
                setTimeout( () => {
                    plugin_parent_files.map( ( i ) => {
                        // only call done() after last file is checked
                        if ((i + 1) === plugin_parent_files.length) {
                            callback = done;
                        } else {
                            callback = null;
                        }

                        compare_output_with_expected(
                            plugin_parent_files[i],
                            wpdtrt_plugin_boilerplate_output_path,
                            wpdtrt_plugin_boilerplate_expected_path,
                            callback
                        );
                    });
                }, 1000);
            });

            gulp.start("test");
        });
    });

    describe("Test parent installed as a dependency of child", () => {

        // Setup
        before( () => {

            // run plugin, to copy fixtures to transformed output
            gulp.task("wpdtrtPluginBumpChild", wpdtrtPluginBump({
                wpdtrt_plugin_boilerplate_input_path,
                wpdtrt_plugin_boilerplate_output_path,
                root_input_path,
                root_output_path
            }));
        });

        it("Parent as dependency - plugin should run without error", (done) => {
            // pseudo-task
            gulp.task("test", ["wpdtrtPluginBumpChild"], () => {
                done();
            });
            gulp.start("test");
        });

        it("Parent as dependency - files should be versioned correctly", (done) => {

            gulp.task("test", ["wpdtrtPluginBumpChild"], () => {

                // wait for wpdtrtPluginBump to finish writing output to the file system
                setTimeout( () => {
                    plugin_child_files.map( ( i ) => {
                        // only call done() after last file is checked
                        if ((i + 1) === plugin_child_files.length) {
                            callback = done;
                        } else {
                            callback = null;
                        }

                        compare_output_with_expected(
                            plugin_child_files[i],
                            root_output_path,
                            root_expected_path,
                            callback
                        );
                    });
                }, 1000);
            });

            gulp.start("test");
        });
    });
});
