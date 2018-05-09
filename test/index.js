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
var mocha = require('mocha');
var path = require('path');

// jslint..
var describe = mocha.describe;
var it = mocha.it;

// our plugin
var wpdtrtPluginBump = require('../index.js');

describe('Test plugin', function() {
	// increase default timeout in case assert operations take too long (i/o usage)
	// https://duske.me/simple-functional-tests-for-gulp-tasks/
	this.timeout(4000);

	gulp.task('wpdtrtPluginBump', wpdtrtPluginBump({
    root_path: false,
    wpdtrt_plugin_path: './fixtures/wpdtrt-plugin/'
  }));

	it('Plugin runs in task without error', function(done) {
    // pseudo-task
    gulp.task('test', ['wpdtrtPluginBump'], function() {
	    //assert.equal(1, true);
      done();
    });
    gulp.start('test');
	});
});
