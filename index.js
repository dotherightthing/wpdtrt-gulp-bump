/*jslint white:true, regexp: true, node:true */

// https://duske.me/simple-functional-tests-for-gulp-tasks/
// https://github.com/lazd/gulp-replace/blob/master/test/main.js
// https://artandlogic.com/2014/05/a-simple-gulp-plugin/

'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var PLUGIN_NAME = 'gulp-wpdtrt-plugin-bump';

/**
 * Plugin
 * @param files array Gulp files glob
 * @param opts array optional Options
 * @example
 * 	gulp.task('wpdtrtPluginBump', wpdtrtPluginBump({
 * 		wpdtrt_plugin_is_dependency: false
 * 	}));
 */
var wpdtrtPluginBump = function(opts) {

	opts = opts || {};

	if ( !opts.wpdtrt_plugin_is_dependency ) {
		opts.wpdtrt_plugin_is_dependency = false;
	}

	if ( !opts.basePath ) {
		opts.basePath = './';
	}

	if ( !opts.destinationPath ) {
		opts.destinationPath = './';
	}

	return function() {

		// require() is relative to the active gulpfile not to the CWD
		// as it is wpdtrt-plugin/gulpfile.js which is always run
		// ./package.json will always be wpdtrt-plugin/package.json
		// therefore we differentiate between root_pkg & wpdtrt_plugin_pkg

		var root_pkg,
			wpdtrt_plugin_pkg,
			wpdtrt_plugin_pkg_version_escaped,
			wpdtrt_plugin_pkg_version_namespaced;

		// wpdtrt-foo
		if ( opts.wpdtrt_plugin_is_dependency ) {

			// after getting the latest version via bump_update
			// get the latest release number
			root_pkg = require('../../../package.json');
			wpdtrt_plugin_pkg = require('./package.json');
			wpdtrt_plugin_pkg_version_escaped = wpdtrt_plugin_pkg.version.split('.').join('\\.');
			wpdtrt_plugin_pkg_version_namespaced = wpdtrt_plugin_pkg.version.split('.').join('_');

			// bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin 1.2.3 using package.json
			////taskheader(this, '| bump ' + root_pkg.name + ' to ' + root_pkg.version + ' and ' + wpdtrt_plugin_pkg.name + ' ' + wpdtrt_plugin_pkg.version + ' using package.json' );

			// extends DoTheRightThing\WPPlugin\r_1_2_3
			gulp.src([
					'./src/class-' + root_pkg.name + '-plugin.php',
					'./src/class-' + root_pkg.name + '-widgets.php'
				])
				.pipe(replace(
					/(extends DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/,
					'$1' + wpdtrt_plugin_pkg_version_namespaced
				))
				.pipe(gulp.dest('./src/'));

			// * @version 1.2.3
			gulp.src('./gulpfile.js')
				.pipe(replace(
					/(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
					'$1' + root_pkg.version
				))
				.pipe(gulp.dest('./'));

			gulp.src('./readme.txt')
				.pipe(replace(
					// Stable tag: 1.2.3
					/(Stable tag:.)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
					'$1' + root_pkg.version
				))
				.pipe(replace(
					// == Changelog ==
					//
					// = 1.2.3 =
					//
					// @see https://github.com/dotherightthing/wpdtrt-plugin/issues/101
					/(== Changelog ==\n\n= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\n)/,
					"$1" + root_pkg.version + " =\r\r= $2$3"
				))
				.pipe(gulp.dest('./'));

			gulp.src([
					'./' + root_pkg.name + '.php'
				])
				// DoTheRightThing\WPPlugin\r_1_2_3
				.pipe(replace(
					/(DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/,
					'$1' + wpdtrt_plugin_pkg_version_namespaced
				))
				// * Version: 1.2.3
				.pipe(replace(
					/(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
					'$1' + root_pkg.version
				))
				// define( 'WPDTRT_FOO_VERSION', '1.2.3' );
				.pipe(replace(
					/(define\( '[A-Z_]+_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(.+;)/,
					'$1' + root_pkg.version + '$3'
				))
				.pipe(gulp.dest('./'));
		}
		// wpdtrt-plugin
		else {

			// get the latest release number
			wpdtrt_plugin_pkg = require('./package.json');
			wpdtrt_plugin_pkg_version_escaped = wpdtrt_plugin_pkg.version.split('.').join('\\.');
			wpdtrt_plugin_pkg_version_namespaced = wpdtrt_plugin_pkg.version.split('.').join('_');

			////taskheader(this, '| bump ' + wpdtrt_plugin_pkg.name + ' to ' + wpdtrt_plugin_pkg.version + ' using package.json' );

			// DoTheRightThing\WPPlugin\r_1_2_3
			gulp.src([
					'./src/class-wpdtrt-test-plugin.php',
					'./src/class-wpdtrt-test-widgets.php',
					'./src/Shortcode.php',
					'./src/Taxonomy.php',
					'./src/TemplateLoader.php',
					'./src/Widget.php'
				])
				.pipe(replace(
					/(DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/g,
					'$1' + wpdtrt_plugin_pkg_version_namespaced
				))
				.pipe(gulp.dest('./src/'));

			gulp.src('./src/Plugin.php')
				// DoTheRightThing\WPPlugin\r_1_2_3
				.pipe(replace(
					/(DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/g,
					'$1' + wpdtrt_plugin_pkg_version_namespaced
				))
				// const WPPLUGIN_VERSION = '1.2.3';
				.pipe(replace(
					/(const WPPLUGIN_VERSION = ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(';)/,
					'$1' + wpdtrt_plugin_pkg.version + '$3'
				))
				.pipe(gulp.dest('./src/'));

			// "DoTheRightThing\\WPPlugin\\r_1_2_3\\": "src"
			gulp.src('./composer.json')
				.pipe(replace(
					/("DoTheRightThing\\\\WPPlugin\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\")/,
					'$1' + wpdtrt_plugin_pkg_version_namespaced + '$3'
				))
				.pipe(gulp.dest('./'));

			// * @version 1.2.3
			gulp.src('./index.php')
				.pipe(replace(
					/(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
					'$1' + wpdtrt_plugin_pkg.version
				))
				.pipe(gulp.dest('./'));

				gulp.src('./readme.txt')
				.pipe(replace(
					// Stable tag: 1.2.3
					/(Stable tag:.)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
					'$1' + wpdtrt_plugin_pkg.version
				))
				.pipe(replace(
					// == Changelog ==
					//
					// = 1.2.3 =
					//
					// @see https://github.com/dotherightthing/wpdtrt-plugin/issues/101
					/(== Changelog ==\n\n= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\n)/,
					"$1" + wpdtrt_plugin_pkg.version + " =\r\r= $2$3"
				))
				.pipe(gulp.dest('./'));

			gulp.src('./wpdtrt-plugin.php')
				// * Version: 1.2.3
				.pipe(replace(
					/(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
					'$1' + wpdtrt_plugin_pkg.version
				))
				// define( 'WPDTRT_FOO_VERSION', '1.2.3' );
				.pipe(replace(
					/(define\( '[A-Z_]+_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(.+;)/,
					'$1' + wpdtrt_plugin_pkg.version + '$3'
				))
				.pipe(gulp.dest('./'));
		}
	};
};

// Export the plugin main function
module.exports = wpdtrtPluginBump;
