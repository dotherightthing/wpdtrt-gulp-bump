/*jslint node:true */

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

    var timestamp = new Date().getTime(),
        wpdtrt_plugin_input_path =    'test/fixtures/wpdtrt-plugin/',
        wpdtrt_plugin_output_path =   'tmp/' + timestamp + '/wpdtrt-plugin/',
        wpdtrt_plugin_expected_path = 'test/expected/wpdtrt-plugin/',
        root_input_path =             'test/fixtures/wpdtrt-plugin-child/',
        root_output_path =            'tmp/' + timestamp + '/wpdtrt-plugin-child/',
        root_expected_path =          'test/expected/wpdtrt-plugin-child/',
        outputBuffer,
        expectedBuffer,
        i,
        plugin_parent_files = [
            'src/class-wpdtrt-test-plugin.php',
            'src/class-wpdtrt-test-widgets.php',
            'src/Plugin.php',
            'src/Shortcode.php',
            'src/Taxonomy.php',
            'src/TemplateLoader.php',
            'src/Widget.php',
            'composer.json',
            'index.php',
            'readme.txt',
            'wpdtrt-plugin.php'
        ],
        plugin_child_files = [
            'src/class-wpdtrt-plugin-child-plugin.php',
            'src/class-wpdtrt-plugin-child-widgets.php',
            'gulpfile.js',
            'readme.txt',
            'wpdtrt-plugin-child.php'
        ];

    describe('Test orphan parent', function () {

        // Setup
        before(function () {

            gulp.task('wpdtrtPluginBumpParent', wpdtrtPluginBump({
                wpdtrt_plugin_input_path: wpdtrt_plugin_input_path,
                wpdtrt_plugin_output_path: wpdtrt_plugin_output_path,
                wpdtrt_plugin_package: process.cwd() + '/' + wpdtrt_plugin_input_path + 'package.json', // process.cwd() + '/package.json'
                root_input_path: wpdtrt_plugin_input_path,
                root_output_path: wpdtrt_plugin_output_path,
                root_package: process.cwd() + '/test/fixtures/wpdtrt-plugin/package.json' // process.cwd() + '/package.json'
            }));
        });

        it('Plugin runs without error', function (done) {
            // pseudo-task
            gulp.task('test', ['wpdtrtPluginBumpParent'], function () {
                done();
            });
            gulp.start('test');
        });

        it('Files should be versioned correctly', function (done) {

            gulp.task('test', ['wpdtrtPluginBumpParent'], function () {

                setTimeout(function () {

                    for (i = 0; i < plugin_parent_files.length; i += 1) {

                        outputBuffer = fs.readFileSync(wpdtrt_plugin_output_path + plugin_parent_files[i]);
                        expectedBuffer = fs.readFileSync(wpdtrt_plugin_expected_path + plugin_parent_files[i]);

                        expect(outputBuffer.toString('utf8').trim()).not.differentFrom(expectedBuffer.toString('utf8').trim())
                    }

                    done();
                }, 1000);
            });

            gulp.start('test');
        });
    });

    describe('Test parent installed as a dependency of child', function () {

        // Setup
        before(function () {

            gulp.task('wpdtrtPluginBumpChild', wpdtrtPluginBump({
                wpdtrt_plugin_input_path: wpdtrt_plugin_input_path,
                wpdtrt_plugin_output_path: wpdtrt_plugin_output_path,
                wpdtrt_plugin_package: process.cwd() + '/' + wpdtrt_plugin_input_path + 'package.json', // process.cwd() + '/package.json'
                root_input_path: root_input_path,
                root_output_path: root_output_path,
                root_package: process.cwd() + '/' + root_input_path + 'package.json' // '../../../package.json'
            }));
        });

        it('Plugin runs without error', function (done) {
            // pseudo-task
            gulp.task('test', ['wpdtrtPluginBumpChild'], function () {
                done();
            });
            gulp.start('test');
        });

        it('Files should be versioned correctly', function (done) {

            gulp.task('test', ['wpdtrtPluginBumpChild'], function () {

                setTimeout(function () {

                    for (i = 0; i < plugin_child_files.length; i += 1) {

                        outputBuffer = fs.readFileSync(root_output_path + plugin_child_files[i]);
                        expectedBuffer = fs.readFileSync(root_expected_path + plugin_child_files[i]);

                        expect(outputBuffer.toString('utf8').trim()).not.differentFrom(expectedBuffer.toString('utf8').trim())
                    }

                    done();
                }, 1000);
            });

            gulp.start('test');
        });
    });
});
