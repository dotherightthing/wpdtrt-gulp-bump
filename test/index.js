/*jslint node:true, stupid:true */

'use strict';

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

var gulp = require('gulp');
var assert = require('assert');
var chai = require('chai');

var fs = require('fs');
var mocha = require('mocha');
var path = require('path');
//var rimraf = require('rimraf'); // didn't work, possibly due to async flow

chai.use(require('chai-diff'));

// jslint..
var after = mocha.after;
var before = mocha.before;
var describe = mocha.describe;
var expect = chai.expect;
var it = mocha.it;

// our plugin
var wpdtrtPluginBump = require('../index.js');

describe('Test plugin', function () {
    // increase default timeout in case assert operations take too long (i/o usage)
    // https://duske.me/simple-functional-tests-for-gulp-tasks/
    this.timeout(4000);

    function compare_output_with_expected(filename, output_path, expected_path, done) {

        // https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback

        fs.readFile(output_path + filename, 'utf8', function (output_error, output_data) {

            if (output_error) {
                throw output_error;
            }

            fs.readFile(expected_path + filename, 'utf8', function (expected_error, expected_data) {

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

    var timestamp = new Date().getTime(),
        wpdtrt_plugin_input_path =    'test/fixtures/wpdtrt-plugin/',
        wpdtrt_plugin_output_path =   'tmp/' + timestamp + '/wpdtrt-plugin/',
        wpdtrt_plugin_expected_path = 'test/expected/wpdtrt-plugin/',
        root_input_path =             'test/fixtures/wpdtrt-plugin-child/',
        root_output_path =            'tmp/' + timestamp + '/wpdtrt-plugin-child/',
        root_expected_path =          'test/expected/wpdtrt-plugin-child/',
        i,
        callback = null,
        plugin_parent_files = [
            'src/Plugin.php',
            'src/Rewrite.php',
            'src/Shortcode.php',
            'src/Taxonomy.php',
            'src/TemplateLoader.php',
            'src/Widget.php',
            'tests/generated-plugin/src/class-wpdtrt-test-plugin.php',
            'tests/generated-plugin/src/class-wpdtrt-test-rewrite.php',
            'tests/generated-plugin/src/class-wpdtrt-test-shortcode.php',
            'tests/generated-plugin/src/class-wpdtrt-test-taxonomy.php',
            'tests/generated-plugin/src/class-wpdtrt-test-widget.php',
            'tests/generated-plugin/readme.txt',
            'tests/generated-plugin/wpdtrt-test.php',
            'composer.json',
            'gulpfile.js',
            'index.php'
        ],
        plugin_child_files = [
            'src/class-wpdtrt-plugin-child-plugin.php',
            'src/class-wpdtrt-plugin-child-rewrite.php',
            'src/class-wpdtrt-plugin-child-shortcode.php',
            'src/class-wpdtrt-plugin-child-taxonomy.php',
            'src/class-wpdtrt-plugin-child-widget.php',
            'gulpfile.js',
            'readme.txt',
            'wpdtrt-plugin-child.php'
        ];

    describe('Test orphan parent', function () {

        // Setup
        before(function () {

            // run the plugin, to copy the fixtures to transformed output
            gulp.task('wpdtrtPluginBumpParent', wpdtrtPluginBump({
                wpdtrt_plugin_input_path: wpdtrt_plugin_input_path,
                wpdtrt_plugin_output_path: wpdtrt_plugin_output_path,
                root_input_path: wpdtrt_plugin_input_path,
                root_output_path: wpdtrt_plugin_output_path
            }));
        });

        it('Parent as orphan - plugin runs without error', function (done) {
            // pseudo-task
            gulp.task('test', ['wpdtrtPluginBumpParent'], function () {
                done();
            });
            gulp.start('test');
        });

        it('Parent as orphan - files should be versioned correctly', function (done) {

            gulp.task('test', ['wpdtrtPluginBumpParent'], function () {

                // wait for wpdtrtPluginBump to finish writing output to the file system
                setTimeout(function () {
                    for (i = 0; i < plugin_parent_files.length; i += 1) {

                        // only call done() after last file is checked
                        if ((i + 1) === plugin_parent_files.length) {
                            callback = done;
                        } else {
                            callback = null;
                        }

                        compare_output_with_expected(plugin_parent_files[i], wpdtrt_plugin_output_path, wpdtrt_plugin_expected_path, callback);
                    }
                }, 2000);
            });

            gulp.start('test');
        });
    });

    describe('Test parent installed as a dependency of child', function () {

        // Setup
        before(function () {

            // run the plugin, to copy the fixtures to transformed output
            gulp.task('wpdtrtPluginBumpChild', wpdtrtPluginBump({
                wpdtrt_plugin_input_path: wpdtrt_plugin_input_path,
                wpdtrt_plugin_output_path: wpdtrt_plugin_output_path,
                root_input_path: root_input_path,
                root_output_path: root_output_path
            }));
        });

        it('Parent as dependency - plugin runs without error', function (done) {
            // pseudo-task
            gulp.task('test', ['wpdtrtPluginBumpChild'], function () {
                done();
            });
            gulp.start('test');
        });

        it('Parent as dependency - files should be versioned correctly', function (done) {

            gulp.task('test', ['wpdtrtPluginBumpChild'], function () {

                // wait for wpdtrtPluginBump to finish writing output to the file system
                setTimeout(function () {
                    for (i = 0; i < plugin_child_files.length; i += 1) {

                        // only call done() after last file is checked
                        if ((i + 1) === plugin_child_files.length) {
                            callback = done;
                        } else {
                            callback = null;
                        }

                        compare_output_with_expected(plugin_child_files[i], root_output_path, root_expected_path, callback);
                    }
                }, 2000);
            });

            gulp.start('test');
        });
    });
});
