/*jslint white:true, regexp: true, node:true */

'use strict';

var gulp = require('gulp');
//var expect = require('gulp-expect-file');
var replace = require('gulp-replace');

// testing
// var debug = require('gulp-debug');

/**
 * Plugin
 *
 * require() is relative to the active gulpfile not to the CWD
 * as it is wpdtrt-plugin/gulpfile.js which is always run
 * ./package.json will always be wpdtrt-plugin/package.json
 * therefore we differentiate between root_package & wpdtrt_plugin_package
 *
 * process.cwd() returns the path of the parent directory
 * of the js file running as the node process
 * not the js file it is executed in
 *
 * @param opts array optional Options
 */
var WpdtrtPluginBump = function(opts) {
	opts = opts || {};

	if ( !opts.root_input_path ) {
		opts.root_input_path = '';
	}

	if ( !opts.root_output_path ) {
		opts.root_output_path = opts.root_output_path;
	}

	if ( !opts.root_package ) {
		opts.root_package = process.cwd() + '/package.json';
	}

	if ( !opts.wpdtrt_plugin_input_path ) {
		opts.wpdtrt_plugin_input_path = '';
	}

	if ( !opts.wpdtrt_plugin_output_path ) {
		opts.wpdtrt_plugin_output_path = opts.wpdtrt_plugin_input_path;
	}

	if ( !opts.wpdtrt_plugin_package ) {
		opts.wpdtrt_plugin_package = process.cwd() + '/package.json';
	}

	/**
	 * Get the version value from wpdtrt-plugin/package.json, in namespace format
	 * @param {string} wpdtrt_plugin_package_version
	 * @return {string} The version in namespace format
	 */
	function namespace_wpdtrt_plugin_package_version( wpdtrt_plugin_package_version ) {
		return wpdtrt_plugin_package_version.split('.').join('_');
	}

	/**
	 * Child: version the extended class name
	 * @param {string} input_path - Path to wpdtrt-plugin-child/
	 * @param {string} output_path - Path to wpdtrt-plugin-child/ output directory
	 * @param {object} root_package - A reference to the child's package.json file
	 * @param {string} wpdtrt_plugin_package_version_namespaced - The version in namespace format
	 * @return {array} src files
	 */
	function version_child_extend( input_path, output_path, root_package, wpdtrt_plugin_package_version_namespaced) {
		// extends DoTheRightThing\WPPlugin\r_1_2_3
		var files = [
			input_path + 'src/class-' + root_package.name + '-plugin.php',
			input_path + 'src/class-' + root_package.name + '-widgets.php'
		];

		return gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			.pipe(replace(
				/(extends DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/,
				'$1' + wpdtrt_plugin_package_version_namespaced
			))
			.pipe(gulp.dest(input_path + 'src/'));
	}

	/**
	 * Child: version the gulpfile
	 * @param {string} input_path - Path to wpdtrt-plugin-child/
	 * @param {string} output_path - Path to wpdtrt-plugin-child/ output directory
	 * @param {object} root_package - A reference to the child's package.json file
	 * @return {array} src files
	 */
	function version_child_gulpfile( input_path, output_path, root_package ) {
		// * @version 1.2.3
		var files = input_path + 'gulpfile.js';

		return gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			.pipe(replace(
				/(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
				'$1' + root_package.version
			))
			.pipe(gulp.dest(input_path));
	}

	/**
	 * Child: version the (WordPress) readme
	 * @param {string} input_path - Path to wpdtrt-plugin-child/
	 * @param {string} output_path - Path to wpdtrt-plugin-child/ output directory
	 * @param {object} root_package - A reference to the child's package.json file
	 * @return {array} src files
	 */
	function version_child_readme( input_path, output_path, root_package ) {
		var files = input_path + 'readme.txt';

		return gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			.pipe(replace(
				// Stable tag: 1.2.3
				/(Stable tag:.)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
				'$1' + root_package.version
			))
			.pipe(replace(
				// == Changelog ==
				//
				// = 1.2.3 =
				//
				// @see https://github.com/dotherightthing/wpdtrt-plugin/issues/101
				/(== Changelog ==\n\n= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\n)/,
				"$1" + root_package.version + " =\r\r= $2$3"
			))
			.pipe(gulp.dest(input_path));
	}

	/**
	 * Child: version the child root file
	 * @param {string} input_path - Path to wpdtrt-plugin-child/
	 * @param {string} output_path - Path to wpdtrt-plugin-child/ output directory
	 * @param {object} root_package - A reference to the child's package.json file
	 * @param {string} wpdtrt_plugin_package_version_namespaced - The version in namespace format
	 * @return {array} src files
	 */
	function version_child_root( input_path, output_path, root_package, wpdtrt_plugin_package_version_namespaced ) {
		var files = input_path + root_package.name + '.php';

		return gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			// DoTheRightThing\WPPlugin\r_1_2_3
			.pipe(replace(
				/(DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/,
				'$1' + wpdtrt_plugin_package_version_namespaced
			))
			// * Version: 1.2.3
			.pipe(replace(
				/(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
				'$1' + root_package.version
			))
			// define( 'WPDTRT_FOO_VERSION', '1.2.3' );
			.pipe(replace(
				/(define\( '[A-Z_]+_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(.+;)/,
				'$1' + root_package.version + '$3'
			))
			.pipe(gulp.dest(input_path));
	}

	/**
	 * Parent: version the namespaced src files
	 * @param {string} input_path - Path to wpdtrt-plugin/
	 * @param {string} output_path - Path to wpdtrt-plugin/ output directory
	 * @param {string} wpdtrt_plugin_package_version_namespaced - The version in namespace format
	 * @return {array} src files
	 */
	function version_parent_src( input_path, output_path, wpdtrt_plugin_package_version_namespaced ) {
		var files = [
			input_path + 'src/class-wpdtrt-test-plugin.php',
			input_path + 'src/class-wpdtrt-test-widgets.php',
			input_path + 'src/Shortcode.php',
			input_path + 'src/Taxonomy.php',
			input_path + 'src/TemplateLoader.php',
			input_path + 'src/Widget.php'
		];

		// DoTheRightThing\WPPlugin\r_1_2_3
		return gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			.pipe(replace(
				/(DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/g,
				'$1' + wpdtrt_plugin_package_version_namespaced
			))
			.pipe(gulp.dest(input_path + 'src/'));
	}

	/**
	 * Parent: version the namespaced src/Plugin.php file
	 * @param {string} input_path - Path to wpdtrt-plugin/
	 * @param {string} output_path - Path to wpdtrt-plugin/ output directory
	 * @param {object} wpdtrt_plugin_package - A reference to the package.json file
	 * @param {string} wpdtrt_plugin_package_version_namespaced - The version in namespace format
	 * @return {array} src files
	 */
	function version_parent_src_plugin( input_path, output_path, wpdtrt_plugin_package, wpdtrt_plugin_package_version_namespaced ) {
		var files = input_path + 'src/Plugin.php';

		return gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			// DoTheRightThing\WPPlugin\r_1_2_3
			.pipe(replace(
				/(DoTheRightThing\\WPPlugin\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/g,
				'$1' + wpdtrt_plugin_package_version_namespaced
			))
			// const WPPLUGIN_VERSION = '1.2.3';
			.pipe(replace(
				/(const WPPLUGIN_VERSION = ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(';)/,
				'$1' + wpdtrt_plugin_package.version + '$3'
			))
			.pipe(gulp.dest(input_path + 'src/'));
	}

	/**
	 * Parent: version the composer file
	 * @param {string} input_path - Path to wpdtrt-plugin/
	 * @param {string} output_path - Path to wpdtrt-plugin/ output directory
	 * @param {string} wpdtrt_plugin_package_version_namespaced - The version in namespace format
	 * @return {array} src files
	 */
	function version_parent_composer( input_path, output_path, wpdtrt_plugin_package_version_namespaced ) {
		var files = input_path + 'composer.json';

		// "DoTheRightThing\\WPPlugin\\r_1_2_3\\": "src"
		return gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			.pipe(replace(
				/("DoTheRightThing\\\\WPPlugin\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\")/,
				'$1' + wpdtrt_plugin_package_version_namespaced + '$3'
			))
			.pipe(gulp.dest(input_path));
	}

	/**
	 * Parent: version the autoloader (index) file
	 * @param {string} input_path - Path to wpdtrt-plugin/
	 * @param {string} output_path - Path to wpdtrt-plugin/ output directory
	 * @param {object} wpdtrt_plugin_package - A reference to the package.json file
	 * @return {array} src files
	 */
	function version_parent_autoloader( input_path, output_path, wpdtrt_plugin_package ) {
		var files = input_path + 'index.php';

		// * @version 1.2.3
		gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			.pipe(replace(
				/(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
				'$1' + wpdtrt_plugin_package.version
			))
			.pipe(gulp.dest(input_path));

			gulp.src(input_path + 'readme.txt')
			.pipe(replace(
				// Stable tag: 1.2.3
				/(Stable tag:.)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
				'$1' + wpdtrt_plugin_package.version
			))
			.pipe(replace(
				// == Changelog ==
				//
				// = 1.2.3 =
				//
				// @see https://github.com/dotherightthing/wpdtrt-plugin/issues/101
				/(== Changelog ==\n\n= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\n)/,
				"$1" + wpdtrt_plugin_package.version + " =\r\r= $2$3"
			))
			.pipe(gulp.dest(input_path));
	}

	/**
	 * Parent: version the root (WordPress) file
	 * @param {string} input_path - Path to wpdtrt-plugin/
	 * @param {string} output_path - Path to wpdtrt-plugin/ output directory
	 * @param {object} wpdtrt_plugin_package - A reference to the package.json file
	 * @return {array} src files
	 */
	function version_parent_root( input_path, output_path, wpdtrt_plugin_package ) {
		var files = input_path + 'wpdtrt-plugin.php'

		gulp.src(files)
			// .pipe(expect.real(files)) // .pipe(debug())
			// * Version: 1.2.3
			.pipe(replace(
				/(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
				'$1' + wpdtrt_plugin_package.version
			))
			// define( 'WPDTRT_FOO_VERSION', '1.2.3' );
			.pipe(replace(
				/(define\( '[A-Z_]+_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(.+;)/,
				'$1' + wpdtrt_plugin_package.version + '$3'
			))
			.pipe(gulp.dest(input_path));
	}

	return function() {

		var root_package = require(opts.root_package),
			wpdtrt_plugin_package = require(opts.wpdtrt_plugin_package),
			wpdtrt_plugin_package_version_namespaced = namespace_wpdtrt_plugin_package_version( wpdtrt_plugin_package.version ),
			input = '',
			output = '';


		// orphan parent
		if ( opts.root_input_path === opts.wpdtrt_plugin_input_path ) {

			input = opts.wpdtrt_plugin_input_path;
			output = opts.wpdtrt_plugin_output_path;

			// get the latest release number
			console.log('Bump ' + wpdtrt_plugin_package.name + ' to ' + wpdtrt_plugin_package.version + ' using package.json' );

			version_parent_src( input, output, wpdtrt_plugin_package_version_namespaced );

			version_parent_src_plugin( input, output, wpdtrt_plugin_package, wpdtrt_plugin_package_version_namespaced );

			version_parent_composer( input, output, wpdtrt_plugin_package_version_namespaced );

			version_parent_autoloader( input, output, wpdtrt_plugin_package );

			version_parent_root( input, output, wpdtrt_plugin_package );
		}
		// parent installed as a dependency of child
		else {

			input = opts.root_input_path;
			output = opts.root_output_path;

			// bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin 1.2.3 using package.json
			console.log('Bump ' + root_package.name + ' to ' + root_package.version + ' and ' + wpdtrt_plugin_package.name + ' ' + wpdtrt_plugin_package.version + ' using package.json' );

			version_child_extend( input, output, root_package, wpdtrt_plugin_package_version_namespaced );

			version_child_gulpfile( input, output, root_package );

			version_child_readme( input, output, root_package );

			version_child_root( input, output, root_package, wpdtrt_plugin_package_version_namespaced );
		}
	};
};

// Export the plugin main function
module.exports = WpdtrtPluginBump;
