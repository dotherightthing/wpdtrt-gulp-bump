/*jslint white:true, regexp: true, node:true */

// https://duske.me/simple-functional-tests-for-gulp-tasks/
// https://github.com/lazd/gulp-replace/blob/master/test/main.js
// https://artandlogic.com/2014/05/a-simple-gulp-plugin/

'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');

/**
 * Plugin
 * @param files array Gulp files glob
 * @param opts array optional Options
 */

var WpdtrtPluginBump = function(opts) {

	opts = opts || {};

	if ( !opts.root_path ) {
		opts.root_path = false; // '../../../package.json'
	}

	if ( !opts.wpdtrt_plugin_path ) {
		opts.wpdtrt_plugin_path = './';
	}

	//function escape_wpdtrt_plugin_pkg_version( wpdtrt_plugin_pkg ) {
	//	return wpdtrt_plugin_pkg.version.split('.').join('\\.');
	//}

	function namespace_wpdtrt_plugin_pkg_version( wpdtrt_plugin_pkg ) {
		return wpdtrt_plugin_pkg.version.split('.').join('_');
	}

	function version_child_extend(root_pkg, wpdtrt_plugin_path, wpdtrt_plugin_pkg_version_namespaced) {
		// extends DoTheRightThing\WPPlugin\r_1_2_3
		return gulp.src([
				wpdtrt_plugin_path + 'src/class-' + root_pkg.name + '-plugin.php',
				wpdtrt_plugin_path + 'src/class-' + root_pkg.name + '-widgets.php'
			])
			.pipe(replace(
				/(extends DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/,
				'$1' + wpdtrt_plugin_pkg_version_namespaced
			))
			.pipe(gulp.dest(wpdtrt_plugin_path + 'src/'));
	}

	function version_child_gulpfile( root_pkg, wpdtrt_plugin_path ) {
		// * @version 1.2.3
		return gulp.src(wpdtrt_plugin_path + 'gulpfile.js')
			.pipe(replace(
				/(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
				'$1' + root_pkg.version
			))
			.pipe(gulp.dest(wpdtrt_plugin_path));
	}

	function version_child_readme( root_pkg, wpdtrt_plugin_path ) {
		return gulp.src(wpdtrt_plugin_path + 'readme.txt')
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
			.pipe(gulp.dest(wpdtrt_plugin_path));
	}

	function version_child_root( root_pkg, wpdtrt_plugin_path, wpdtrt_plugin_pkg_version_namespaced ) {
		return gulp.src([
				wpdtrt_plugin_path + root_pkg.name + '.php'
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
			.pipe(gulp.dest(wpdtrt_plugin_path));
	}

	function version_parent_src( wpdtrt_plugin_path, wpdtrt_plugin_pkg_version_namespaced ) {

		// DoTheRightThing\WPPlugin\r_1_2_3
		return gulp.src([
				wpdtrt_plugin_path + 'src/class-wpdtrt-test-plugin.php',
				wpdtrt_plugin_path + 'src/class-wpdtrt-test-widgets.php',
				wpdtrt_plugin_path + 'src/Shortcode.php',
				wpdtrt_plugin_path + 'src/Taxonomy.php',
				wpdtrt_plugin_path + 'src/TemplateLoader.php',
				wpdtrt_plugin_path + 'src/Widget.php'
			])
			.pipe(replace(
				/(DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/g,
				'$1' + wpdtrt_plugin_pkg_version_namespaced
			))
			.pipe(gulp.dest(wpdtrt_plugin_path + 'src/'));
	}

	function version_parent_src_plugin( wpdtrt_plugin_path, wpdtrt_plugin_pkg, wpdtrt_plugin_pkg_version_namespaced ) {

		return gulp.src(wpdtrt_plugin_path + 'src/Plugin.php')
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
			.pipe(gulp.dest(wpdtrt_plugin_path + 'src/'));
	}

	function version_parent_composer( wpdtrt_plugin_path, wpdtrt_plugin_pkg_version_namespaced ) {

		// "DoTheRightThing\\WPPlugin\\r_1_2_3\\": "src"
		return gulp.src(wpdtrt_plugin_path + 'composer.json')
			.pipe(replace(
				/("DoTheRightThing\\\\WPPlugin\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\")/,
				'$1' + wpdtrt_plugin_pkg_version_namespaced + '$3'
			))
			.pipe(gulp.dest(wpdtrt_plugin_path));
	}

	function version_parent_autoloader( wpdtrt_plugin_path, wpdtrt_plugin_pkg ) {

		// * @version 1.2.3
		gulp.src(wpdtrt_plugin_path + 'index.php')
			.pipe(replace(
				/(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
				'$1' + wpdtrt_plugin_pkg.version
			))
			.pipe(gulp.dest(wpdtrt_plugin_path));

			gulp.src(wpdtrt_plugin_path + 'readme.txt')
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
			.pipe(gulp.dest(wpdtrt_plugin_path));
	}

	function version_parent_root( wpdtrt_plugin_path, wpdtrt_plugin_pkg ) {

		gulp.src(wpdtrt_plugin_path + 'wpdtrt-plugin.php')
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
			.pipe(gulp.dest(wpdtrt_plugin_path));
	}

	return function() {

		var root_pkg = '',
			wpdtrt_plugin_pkg = require(opts.wpdtrt_plugin_path + 'package.json'),
			wpdtrt_plugin_pkg_version_namespaced = namespace_wpdtrt_plugin_pkg_version( wpdtrt_plugin_pkg );

		// require() is relative to the active gulpfile not to the CWD
		// as it is wpdtrt-plugin/gulpfile.js which is always run
		// ./package.json will always be wpdtrt-plugin/package.json
		// therefore we differentiate between root_pkg & wpdtrt_plugin_pkg

		// wpdtrt-foo
		if ( opts.root_path ) {

			// after getting the latest version via bump_update
			// get the latest release number
			root_pkg = require(opts.root_path + 'package.json');

			// bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin 1.2.3 using package.json
			////taskheader(this, '| bump ' + root_pkg.name + ' to ' + root_pkg.version + ' and ' + wpdtrt_plugin_pkg.name + ' ' + wpdtrt_plugin_pkg.version + ' using package.json' );

			version_child_extend( root_pkg, opts.wpdtrt_plugin_path, wpdtrt_plugin_pkg_version_namespaced );

			version_child_gulpfile( root_pkg, opts.wpdtrt_plugin_path );

			version_child_readme( root_pkg, opts.wpdtrt_plugin_path );

			version_child_root( root_pkg, opts.wpdtrt_plugin_path, wpdtrt_plugin_pkg_version_namespaced );
		}
		// wpdtrt-plugin
		else {

			// get the latest release number
			////taskheader(this, '| bump ' + wpdtrt_plugin_pkg.name + ' to ' + wpdtrt_plugin_pkg.version + ' using package.json' );

			version_parent_src( opts.wpdtrt_plugin_path, wpdtrt_plugin_pkg_version_namespaced );

			version_parent_src_plugin( opts.wpdtrt_plugin_path, wpdtrt_plugin_pkg, wpdtrt_plugin_pkg_version_namespaced );

			version_parent_composer( opts.wpdtrt_plugin_path, wpdtrt_plugin_pkg_version_namespaced );

			version_parent_autoloader( opts.wpdtrt_plugin_path, wpdtrt_plugin_pkg );

			version_parent_root( opts.wpdtrt_plugin_path, wpdtrt_plugin_pkg );
		}
	};
};

// Export the plugin main function
module.exports = WpdtrtPluginBump;
