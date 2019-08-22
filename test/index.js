/**
 * File: test/index.js
 * Topic: DTRT WordPress Plugin Boilerplate 
 * 
 * Unit tests for wpdtrtPluginBump utility.
 * Written in Mocha, with Chai assertions.
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

/**
 * Group: Test
 *
 * Copy a preset list of 'fixtures'
 * to a timestamped folder within tmp/,
 * version them there,
 * then compare them to the 'expected' files.
 */
describe("Test plugin", function () {
    // increase default timeout in case assert operations take too long (i/o usage)
    // https://duske.me/simple-functional-tests-for-gulp-tasks/
    this.timeout(4000);

    const timestamp = new Date().getTime();
    const wpdtrt_plugin_boilerplate_input_path = "test/fixtures/wpdtrt-plugin-boilerplate/";
    const wpdtrt_plugin_boilerplate_output_path = `tmp/${timestamp}/wpdtrt-plugin-boilerplate/`;
    const wpdtrt_plugin_boilerplate_expected_path = "test/expected/wpdtrt-plugin-boilerplate/";
    const root_input_path = "test/fixtures/wpdtrt-generated-plugin/";
    const root_output_path = `tmp/${timestamp}/wpdtrt-generated-plugin/`;
    const root_expected_path = "test/expected/wpdtrt-generated-plugin/";
    const plugin_parent_files = [
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
        "index.php",
        "config/naturaldocs/Project.txt"
    ];
    const plugin_child_files = [
        "src/class-wpdtrt-generated-plugin-plugin.php",
        "src/class-wpdtrt-generated-plugin-rewrite.php",
        "src/class-wpdtrt-generated-plugin-shortcode.php",
        "src/class-wpdtrt-generated-plugin-taxonomy.php",
        "src/class-wpdtrt-generated-plugin-widget.php",
        "readme.txt",
        "wpdtrt-generated-plugin.php",
        "config/naturaldocs/Project.txt"
    ];
    let callback = null;

    /**
     * Function: compare_output_with_expected
     *
     * Copy a 'fixture'
     * to a timestamped folder within tmp/,
     * version it,
     * then compare it to the 'expected' file.
     *
     * Parameters:
     *   (string) filename
     *   (string) output_path
     *   (string) expected_path
     *   (boolean) done
     *
     * See: <fs.readFile: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback>
     */
    function compare_output_with_expected(
        filename,
        output_path,
        expected_path,
        done
    ) {
        fs.readFile( `${output_path}${filename}`, "utf8", (output_error, output_data) => {

            if (output_error) {
                throw output_error;
            }

            fs.readFile( `${expected_path}${filename}`, "utf8", (expected_error, expected_data) => {

                if (expected_error) {
                    throw expected_error;
                }

                const testing = "\n      "
                + `A) ${output_path}${filename}\n`
                + "      "
                + `B) ${expected_path}${filename}`;

                console.log( testing );

                expect(output_data).not.differentFrom(expected_data);

                if (done !== null) {
                    done();
                }
            });
        });
    }

    /**
     * Function: Test orphan parent
     */
    describe("Test orphan parent", () => {

        // Setup
        before( () => {

            // run plugin, to copy fixtures to transformed output
            gulp.task("wpdtrtPluginBumpParent", wpdtrtPluginBump({
                wpdtrt_plugin_boilerplate_input_path,
                wpdtrt_plugin_boilerplate_output_path,
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
                    plugin_parent_files.map( ( file, i ) => {
                        // only call done() after last file is checked
                        if ( (i + 1) === plugin_parent_files.length ) {
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

    /**
     * Function: Test parent installed as a dependency of child
     */
    describe("Test parent installed as a dependency of child", () => {

        // Setup
        before( () => {

            // run plugin, to copy fixtures to transformed output
            gulp.task("wpdtrtPluginBumpChild", wpdtrtPluginBump({
                root_input_path,
                root_output_path,
                wpdtrt_plugin_boilerplate_input_path,
                wpdtrt_plugin_boilerplate_output_path
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
                    plugin_child_files.map( ( file, i ) => {
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
