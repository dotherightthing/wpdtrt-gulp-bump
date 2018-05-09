/*jslint white:true, regexp: true, node:true */

// https://github.com/stevelacy/gulp-bump/blob/master/test/index.js

'use strict';

// Mocha tips:
// https://samwize.com/2014/02/08/a-guide-to-mochas-describe-it-and-setup-hooks/
//
// 1. `describe()` is merely for grouping, which you can nest as deep
// 2. `it()` is a test case
// 3. `before()`, `beforeEach()`, `after()`, `afterEach()` are hooks to run
// before/after first/each it() or describe().
//
// Which means, `before()` is run before first it()/describe()

/**
 * Path from node_modules to gulpfile.js
 * 	This exposes the function as gulpfile.wpdtrtPluginBump()
 * @see https://duske.me/simple-functional-tests-for-gulp-tasks/
 */ 
//const gulpfile = require('../gulpfile.js');
var gulp = require('gulp');
var assert = require('assert');
var mocha = require('mocha');
var path = require('path');

// jslint..
var describe = mocha.describe;
var it = mocha.it;

// our plugin
var wpdtrtPluginBump = require('../index.js');

// https://duske.me/simple-functional-tests-for-gulp-tasks/
describe('Test gulp tasks', function() {
	// increase default timeout in case assert operations take too long (i/o usage)
	// https://duske.me/simple-functional-tests-for-gulp-tasks/
	this.timeout(4000);

    describe('Replace version number strings', function() {

    	gulp.task('wpdtrtPluginBump', wpdtrtPluginBump({
          root_path: false,
          wpdtrt_plugin_path: './fixtures/wpdtrt-plugin/'
        }));

    	it('should pass simple test', function(done) {
          // pseudo-task
          gulp.task('test', ['wpdtrtPluginBump'], function() {
    		    assert.equal(1, true);



            done();
          });
          gulp.start('test');
    	});
    });
});
