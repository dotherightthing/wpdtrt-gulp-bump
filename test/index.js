/*jslint white:true, regexp: true, node:true */

'use strict';

// https://artandlogic.com/2014/05/a-simple-gulp-plugin/
// https://duske.me/simple-functional-tests-for-gulp-tasks/
// https://github.com/stevelacy/gulp-bump/blob/master/test/index.js
// https://github.com/lazd/gulp-replace/blob/master/test/main.js
// https://samwize.com/2014/02/08/a-guide-to-mochas-describe-it-and-setup-hooks/

// 1. `describe()` is merely for grouping, which you can nest as deep
// 2. `it()` is a test case
// 3. `before()`, `beforeEach()`, `after()`, `afterEach()` are hooks to run
// before/after first/each it() or describe().
// `before()` is run before first it()/describe()

var gulp = require('gulp');
var assert = require('assert');
var chai = require('chai');
var expectFile = require('gulp-expect-file');
var fs = require('fs');
var mocha = require('mocha');
var path = require('path');

// jslint..
var describe = mocha.describe;
var expect = chai.expect;
var it = mocha.it;

// our plugin
var wpdtrtPluginBump = require('../index.js');

describe('Test plugin', function() {
	// increase default timeout in case assert operations take too long (i/o usage)
	// https://duske.me/simple-functional-tests-for-gulp-tasks/
	this.timeout(4000);

  describe('Test orphan parent', function() {

    gulp.task('wpdtrtPluginBumpParent', wpdtrtPluginBump({
      wpdtrt_plugin_path: 'test/fixtures/wpdtrt-plugin/',
      wpdtrt_plugin_package: process.cwd() + '/test/fixtures/wpdtrt-plugin/package.json', // process.cwd() + '/package.json'
      root_path: 'test/fixtures/wpdtrt-plugin/',
      root_package: process.cwd() + '/test/fixtures/wpdtrt-plugin/package.json' // process.cwd() + '/package.json'
    }));

    it('Plugin runs without error', function(done) {
      // pseudo-task
      gulp.task('test', ['wpdtrtPluginBumpParent'], function() {
        //assert.equal(1, true);
        done();
      });
      gulp.start('test');
    });

  });

  describe('Test parent installed as a dependency of child', function() {

    var wpdtrt_plugin_path = 'test/fixtures/wpdtrt-plugin/',
        root_path = 'test/fixtures/wpdtrt-plugin-child/';

    gulp.task('wpdtrtPluginBumpChild', wpdtrtPluginBump({
      wpdtrt_plugin_path: wpdtrt_plugin_path,
      wpdtrt_plugin_package: process.cwd() + '/test/fixtures/wpdtrt-plugin/package.json', // process.cwd() + '/package.json'
      root_path: root_path,
      root_package: process.cwd() + '/test/fixtures/wpdtrt-plugin-child/package.json' // '../../../package.json'
    }));

    it('Plugin runs without error', function(done) {
      // pseudo-task
      gulp.task('test', ['wpdtrtPluginBumpChild'], function() {
        done();
      });
      gulp.start('test');
    });

    it('readme.txt should be updated correctly', function(done) {

      gulp.task('test', ['wpdtrtPluginBumpChild'], function() {
        expect(fs.readFileSync(wpdtrt_plugin_path + 'readme.txt').toString('utf8')).to.contain('Stable tag: 1.4.11');
        done();
      });
      gulp.start('test');
    });

  });
});
