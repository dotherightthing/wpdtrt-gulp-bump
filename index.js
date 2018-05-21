/*jslint node:true, stupid:true */

'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');

/**
 * Plugin
 *
 * require() is relative to the active gulpfile not to the CWD
 * as it is wpdtrt-plugin-boilerplate/gulpfile.js which is always run
 * ./package.json will always be wpdtrt-plugin-boilerplate/package.json
 * therefore we differentiate between root_package & wpdtrt_plugin_boilerplate_package
 *
 * process.cwd() returns the path of the parent directory
 * of the js file running as the node process
 * not the js file it is executed in
 *
 * @param opts array optional Options
 */
var wpdtrtPluginBump = function (opts) {
    opts = opts || {};

    if (!opts.root_input_path) {
        opts.root_input_path = '';
    }

    // root_output_path is only used to redirect output during testing
    if (!opts.root_output_path) {
        opts.root_output_path = opts.root_input_path;
    }

    if (!opts.wpdtrt_plugin_boilerplate_input_path) {
        opts.wpdtrt_plugin_boilerplate_input_path = '';
    }

    // wpdtrt_plugin_boilerplate_output_path is only used to redirect output during testing
    if (!opts.wpdtrt_plugin_boilerplate_output_path) {
        opts.wpdtrt_plugin_boilerplate_output_path = opts.wpdtrt_plugin_boilerplate_input_path;
    }

    /**
     * Get the version value from wpdtrt-plugin-boilerplate/package.json, in namespace format
     * @param {string} wpdtrt_plugin_boilerplate_package_version
     * @return {string} The version in namespace format
     */
    function namespace_safe_version(wpdtrt_plugin_boilerplate_package_version) {
        return wpdtrt_plugin_boilerplate_package_version.split('.').join('_');
    }

    /**
     * ===== Child replacements =====
     */

    /**
     * Child: version the extended class name
     * @param {string} input_path - Path to wpdtrt-plugin/
     * @param {string} output_path - Path to wpdtrt-plugin/ output directory
     * @param {object} root_package - A reference to the child's package.json file
     * @param {string} wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     * @return {array} src files
     */
    function version_child_src(input_path, output_path, root_package, wpdtrt_plugin_boilerplate_package_version_namespaced) {
        // extends DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
        var files = [
            input_path + 'src/class-' + root_package.name + '-plugin.php',
            input_path + 'src/class-' + root_package.name + '-rewrite.php',
            input_path + 'src/class-' + root_package.name + '-shortcode.php',
            input_path + 'src/class-' + root_package.name + '-taxonomy.php',
            input_path + 'src/class-' + root_package.name + '-widget.php'
        ];

        return gulp.src(files)
            .pipe(replace(
                /(extends DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/,
                '$1' + wpdtrt_plugin_boilerplate_package_version_namespaced
            ))
            .pipe(gulp.dest(output_path + 'src/'));
    }

    /**
     * Child: version the gulpfile
     * @param {string} input_path - Path to wpdtrt-plugin/
     * @param {string} output_path - Path to wpdtrt-plugin/ output directory
     * @param {object} root_package - A reference to the child's package.json file
     * @return {array} src files
     */
    function version_child_gulpfile(input_path, output_path, root_package) {
        // * @version 1.2.3
        var files = input_path + 'gulpfile.js';

        return gulp.src(files)
            .pipe(replace(
                /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
                '$1' + root_package.version
            ))
            .pipe(gulp.dest(output_path));
    }

    /**
     * Child: version the (WordPress) readme
     * @param {string} input_path - Path to wpdtrt-plugin/
     * @param {string} output_path - Path to wpdtrt-plugin/ output directory
     * @param {object} root_package - A reference to the child's package.json file
     * @return {array} src files
     */
    function version_child_readme(input_path, output_path, root_package) {
        var files = input_path + 'readme.txt';

        return gulp.src(files)
            .pipe(replace(
                // Stable tag: 1.2.3
                /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
                '$1' + root_package.version
            ))
            .pipe(replace(
                // == Changelog ==
                //
                // = 1.2.3 =
                //
                /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/,
                "$1" + root_package.version + " =\n\n= $2$3"
            ))
            .pipe(gulp.dest(output_path));
    }

    /**
     * Child: version the child root file
     * @param {string} input_path - Path to wpdtrt-plugin/
     * @param {string} output_path - Path to wpdtrt-plugin/ output directory
     * @param {object} root_package - A reference to the child's package.json file
     * @return {array} src files
     */
    function version_child_root(input_path, output_path, root_package) {
        var files = input_path + root_package.name + '.php';

        return gulp.src(files)
            // * Version: 1.2.3
            .pipe(replace(
                /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
                '$1' + root_package.version
            ))
            // define( 'WPDTRT_FOO_VERSION', '1.2.3' );
            .pipe(replace(
                /(define\( '[A-Z_]+_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/,
                '$1' + root_package.version + '$3'
            ))
            .pipe(gulp.dest(output_path));
    }

    /**
     * ===== Parent replacements =====
     */

    /**
     * Parent: version the autoloader (index) file
     * @param {string} input_path - Path to wpdtrt-plugin-boilerplate/
     * @param {string} output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     * @param {object} wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     * @return {array} src files
     */
    function version_parent_autoloader(input_path, output_path, wpdtrt_plugin_boilerplate_package) {
        var files = input_path + 'index.php';

        // * @version 1.2.3
        return gulp.src(files)
            .pipe(replace(
                /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
                '$1' + wpdtrt_plugin_boilerplate_package.version
            ))
            .pipe(gulp.dest(output_path));
    }

    /**
     * Parent: version the composer file
     * @param {string} input_path - Path to wpdtrt-plugin-boilerplate/
     * @param {string} output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     * @param {string} wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     * @return {array} src files
     */
    function version_parent_composer(input_path, output_path, wpdtrt_plugin_boilerplate_package_version_namespaced) {
        var files = input_path + 'composer.json';

        // "DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_1_2_3\\": "src"
        return gulp.src(files)
            .pipe(replace(
                /("DoTheRightThing\\\\WPDTRT_Plugin_Boilerplate\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\")/,
                '$1' + wpdtrt_plugin_boilerplate_package_version_namespaced + '$3'
            ))
            .pipe(gulp.dest(output_path));
    }

    /**
     * Parent: version the gulpfile
     * @param {string} input_path - Path to wpdtrt-plugin-boilerplate/
     * @param {string} output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     * @param {object} wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     * @return {array} src files
     */
    function version_parent_gulpfile(input_path, output_path, wpdtrt_plugin_boilerplate_package) {
        // * @version 1.2.3
        var files = input_path + 'gulpfile.js';

        return gulp.src(files)
            .pipe(replace(
                /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
                '$1' + wpdtrt_plugin_boilerplate_package.version
            ))
            .pipe(gulp.dest(output_path));
    }

    /**
     * Parent: version the namespaced src files
     * @param {string} input_path - Path to wpdtrt-plugin-boilerplate/
     * @param {string} output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     * @param {string} wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     * @return {array} src files
     */
    function version_parent_src(input_path, output_path, wpdtrt_plugin_boilerplate_package_version_namespaced) {
        var files = [
            input_path + 'src/Rewrite.php',
            input_path + 'src/Shortcode.php',
            input_path + 'src/Taxonomy.php',
            input_path + 'src/TemplateLoader.php',
            input_path + 'src/Widget.php'
        ];

        // DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
        return gulp.src(files)
            .pipe(replace(
                /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/g,
                '$1' + wpdtrt_plugin_boilerplate_package_version_namespaced
            ))
            .pipe(gulp.dest(output_path + 'src/'));
    }

    /**
     * Parent: version the namespaced src/Plugin.php file
     * @param {string} input_path - Path to wpdtrt-plugin-boilerplate/
     * @param {string} output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     * @param {object} wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     * @param {string} wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     * @return {array} src files
     */
    function version_parent_src_plugin(input_path, output_path, wpdtrt_plugin_boilerplate_package, wpdtrt_plugin_boilerplate_package_version_namespaced) {
        var files = input_path + 'src/Plugin.php';

        return gulp.src(files)
            // DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
            .pipe(replace(
                /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/g,
                '$1' + wpdtrt_plugin_boilerplate_package_version_namespaced
            ))
            // const WPDTRT_PLUGIN_VERSION = '1.2.3';
            .pipe(replace(
                /(const WPDTRT_PLUGIN_VERSION = ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(';)/,
                '$1' + wpdtrt_plugin_boilerplate_package.version + '$3'
            ))
            .pipe(gulp.dest(output_path + 'src/'));
    }

    /**
     * Parent: version the (WordPress) readme
     * @param {string} input_path - Path to wpdtrt-plugin-boilerplate/
     * @param {string} output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     * @param {object} wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     * @return {array} src files
     */
    function version_parent_test_readme(input_path, output_path, wpdtrt_plugin_boilerplate_package) {
        var files = input_path + 'tests/generated-plugin/readme.txt';

        return gulp.src(files)
            .pipe(replace(
                // Stable tag: 1.2.3
                /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
                '$1' + wpdtrt_plugin_boilerplate_package.version
            ))
            .pipe(replace(
                // == Changelog ==
                //
                // = 1.2.3 =
                //
                /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/,
                "$1" + wpdtrt_plugin_boilerplate_package.version + " =\n\n= $2$3"
            ))
            .pipe(gulp.dest(output_path + 'tests/generated-plugin/'));
    }

    /**
     * Parent: version the root (WordPress) file
     * @param {string} input_path - Path to wpdtrt-plugin-boilerplate/
     * @param {string} output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     * @param {object} wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     * @return {array} src files
     */
    function version_parent_test_root(input_path, output_path, wpdtrt_plugin_boilerplate_package) {
        var files = input_path + 'tests/generated-plugin/wpdtrt-test.php';

        gulp.src(files)
            // * Version: 1.2.3
            .pipe(replace(
                /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
                '$1' + wpdtrt_plugin_boilerplate_package.version
            ))
            // define( 'WPDTRT_FOO_VERSION', '1.2.3' );
            .pipe(replace(
                /(define\( '[A-Z_]+_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/,
                '$1' + wpdtrt_plugin_boilerplate_package.version + '$3'
            ))
            .pipe(gulp.dest(output_path + 'tests/generated-plugin/'));
    }


    /**
     * Parent: version the namespaced src files
     * @param {string} input_path - Path to wpdtrt-plugin-boilerplate/
     * @param {string} output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     * @param {string} wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     * @return {array} src files
     */
    function version_parent_test_src(input_path, output_path, wpdtrt_plugin_boilerplate_package_version_namespaced) {
        var files = [
            input_path + 'tests/generated-plugin/src/class-wpdtrt-test-plugin.php',
            input_path + 'tests/generated-plugin/src/class-wpdtrt-test-rewrite.php',
            input_path + 'tests/generated-plugin/src/class-wpdtrt-test-shortcode.php',
            input_path + 'tests/generated-plugin/src/class-wpdtrt-test-taxonomy.php',
            input_path + 'tests/generated-plugin/src/class-wpdtrt-test-widget.php'
        ];

        // DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
        return gulp.src(files)
            .pipe(replace(
                /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/g,
                '$1' + wpdtrt_plugin_boilerplate_package_version_namespaced
            ))
            .pipe(gulp.dest(output_path + 'tests/generated-plugin/src/'));
    }

    /**
     * ===== Perform replacements =====
     */

    /**
     * process.cwd() console.log test results
     *
     * /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate/gulpfile.js;
     * /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate/node_modules/gulp-wpdtrt-plugin-bump/index.js
     * = /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate
     *
     * /Volumes/DanBackup/Websites/wpdtrt-blocks/vendor/dotherightthing/wpdtrt-plugin-boilerplate/gulpfile.js
     * /Volumes/DanBackup/Websites/wpdtrt-blocks/node_modules/gulp-wpdtrt-plugin-bump/index.js
     * = /Volumes/DanBackup/Websites/wpdtrt-blocks
     */
    var input,
        output,
        root_package,
        wpdtrt_plugin_boilerplate_input_path,
        wpdtrt_plugin_boilerplate_package,
        wpdtrt_plugin_boilerplate_package_version_namespaced;

    // orphan parent
    if (opts.root_input_path === opts.wpdtrt_plugin_boilerplate_input_path) {

        input = opts.wpdtrt_plugin_boilerplate_input_path;
        output = opts.wpdtrt_plugin_boilerplate_output_path;
        root_package = require(process.cwd() + '/' + input + 'package.json');
        wpdtrt_plugin_boilerplate_package = require(process.cwd() + '/' + input + 'package.json');
        wpdtrt_plugin_boilerplate_package_version_namespaced = namespace_safe_version(wpdtrt_plugin_boilerplate_package.version);

        // get the latest release number
        console.log('Bump ' + wpdtrt_plugin_boilerplate_package.name + ' to ' + wpdtrt_plugin_boilerplate_package.version + ' using package.json');

        version_parent_autoloader(input, output, wpdtrt_plugin_boilerplate_package);

        version_parent_composer(input, output, wpdtrt_plugin_boilerplate_package_version_namespaced);

        version_parent_gulpfile(input, output, wpdtrt_plugin_boilerplate_package);

        version_parent_src(input, output, wpdtrt_plugin_boilerplate_package_version_namespaced);

        version_parent_src_plugin(input, output, wpdtrt_plugin_boilerplate_package, wpdtrt_plugin_boilerplate_package_version_namespaced);

        version_parent_test_readme(input, output, wpdtrt_plugin_boilerplate_package);

        version_parent_test_root(input, output, wpdtrt_plugin_boilerplate_package);

        version_parent_test_src(input, output, wpdtrt_plugin_boilerplate_package_version_namespaced);
    } else {
        // parent installed as a dependency of child
        input = opts.root_input_path;
        output = opts.root_output_path;
        root_package = require(process.cwd() + '/' + input + 'package.json');
        wpdtrt_plugin_boilerplate_input_path = opts.wpdtrt_plugin_boilerplate_input_path;
        wpdtrt_plugin_boilerplate_package = require(process.cwd() + '/' + wpdtrt_plugin_boilerplate_input_path + 'package.json');
        wpdtrt_plugin_boilerplate_package_version_namespaced = namespace_safe_version(wpdtrt_plugin_boilerplate_package.version);

        // bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin-boilerplate 1.2.3 using package.json
        console.log('Bump ' + root_package.name + ' to ' + root_package.version + ' and ' + wpdtrt_plugin_boilerplate_package.name + ' ' + wpdtrt_plugin_boilerplate_package.version + ' using package.json');

        version_child_src(input, output, root_package, wpdtrt_plugin_boilerplate_package_version_namespaced);

        version_child_gulpfile(input, output, root_package);

        version_child_readme(input, output, root_package);

        version_child_root(input, output, root_package);
    }
};

// Export the plugin main function
module.exports = wpdtrtPluginBump;
