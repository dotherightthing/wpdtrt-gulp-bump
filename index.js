/**
 * File: index.js
 * Topic: DTRT WordPress Plugin Boilerplate 
 * 
 * wpdtrtPluginBump utility.
 */

/* globals module, process, require */

const gulp = require("gulp");
const replace = require("gulp-replace");

/**
 * Function: wpdtrtPluginBump
 *
 * require() is relative to the active gulpfile not to the CWD
 * as it is wpdtrt-plugin-boilerplate/gulpfile.js which is always run
 * ./package.json will always be wpdtrt-plugin-boilerplate/package.json
 * therefore we differentiate between
 * root_package & wpdtrt_plugin_boilerplate_package
 *
 * process.cwd() returns the path of the parent directory
 * of the js file running as the node process
 * not the js file it is executed in
 *
 * Parameters:
 *   (object) opts - optional Options
 */
const wpdtrtPluginBump = function ( {
    root_input_path = "",
    // root_output_path is only used to redirect output during testing
    root_output_path = root_input_path,
    wpdtrt_plugin_boilerplate_input_path = "",
    // wpdtrt_plugin_boilerplate_output_path is only used to
    // redirect output during testing
    wpdtrt_plugin_boilerplate_output_path = wpdtrt_plugin_boilerplate_input_path // eslint-disable-line max-len
} = {} ) {
    /**
     * Method: namespace_safe_version
     * 
     * Get the version value from wpdtrt-plugin-boilerplate/package.json,
     *  in namespace format.
     *
     * Parameters:
     *   (string) wpdtrt_plugin_boilerplate_package_version, e.g. 1.2.34
     *
     * Returns:
     *   (string) The version in namespace format
     */
    function namespace_safe_version(wpdtrt_plugin_boilerplate_package_version) {
        return wpdtrt_plugin_boilerplate_package_version.split(".").join("_");
    }

    /**
     * Group: Child replacements
     */

    /**
     * Method: version_generated_plugin_src
     * 
     * Child: version the extended class name.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-generated-plugin/
     *   (string) output_path - Path to wpdtrt-generated-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./src/class-*.php:
     * --- Text
     * extends DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
     * ---
     */
    function version_generated_plugin_src(
        input_path,
        output_path,
        root_package,
        wpdtrt_plugin_boilerplate_package_version_namespaced
    ) {
        const categories = [
            "plugin",
            "rewrite",
            "shortcode",
            "taxonomy",
            "widget"
        ];
        const files = [];
        const re = new RegExp(
            /(extends DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/ // eslint-disable-line max-len
        );
        const { name } = root_package;

        categories.map( category => {
            files.push(
                `${input_path}src/class-${name}-${category}.php`
            );
        });

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${wpdtrt_plugin_boilerplate_package_version_namespaced}`
            ) )
            .pipe(gulp.dest( `${output_path}src/` ) );
    }

    /**
     * Method: version_generated_plugin_gulpfile
     * 
     * Child: version the gulpfile.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-generated-plugin/
     *   (string) output_path - Path to wpdtrt-generated-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./gulpfile.js
     * --- Text
     * * @version 1.2.3
     * ---
     */
    function version_generated_plugin_gulpfile(
        input_path,
        output_path,
        root_package
    ) {
        const files = `${input_path}gulpfile.js`;
        const re = new RegExp(
            /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const { version } = root_package;

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${version}`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_generated_plugin_naturaldocs_project
     * 
     * Child: version the Natural Docs' Project.txt.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-generated-plugin/
     *   (string) output_path - Path to wpdtrt-generated-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./config/naturaldocs/Project.txt
     * --- Text
     * Subtitle: DTRT Foo (1.2.3)
     * ---
     */
    function version_generated_plugin_naturaldocs_project(
        input_path,
        output_path,
        root_package
    ) {
        const files = `${input_path}config/naturaldocs/Project.txt`;
        const re = new RegExp(
            /(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const { version } = root_package;

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${version}`
            ) )
            .pipe( gulp.dest( `${output_path}config/naturaldocs/` ) );
    }

    /**
     * Method: version_generated_plugin_readme
     * 
     * Child: version the (WordPress) readme.txt.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-generated-plugin/
     *   (string) output_path - Path to wpdtrt-generated-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./readme.txt
     * --- Text
     * Stable tag: 1.2.3
     * ---
     * --- Text
     * == Changelog ==
     * 
     * = 1.2.3 =
     * 
     * ---
     */
    function version_generated_plugin_readme(
        input_path,
        output_path,
        root_package
    ) {
        const files = `${input_path}readme.txt`;
        const re1 = new RegExp(
            /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const re2 = new RegExp(
            /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/
        );
        const { version } = root_package;

        return gulp.src(files)
            .pipe( replace(
                re1,
                `$1${version}`
            ) )
            .pipe( replace(
                re2,
                `$1${version} =\n\n= $2$3`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_generated_plugin_root
     * 
     * Child: version the child root file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-generated-plugin/
     *   (string) output_path - Path to wpdtrt-generated-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./wpdtrt-*.php
     * --- Text
     * * Version: 1.2.3
     * ---
     * --- Text
     * define( 'WPDTRT_TEST_VERSION', '1.2.3' );
     * ---
     */
    function version_generated_plugin_root(
        input_path,
        output_path,
        root_package
    ) {
        const { name, version } = root_package;
        const files = `${input_path}${name}.php`;
        const re1 = new RegExp(
            /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const re2 = new RegExp(
            /(define\( 'WPDTRT_TEST_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/ // eslint-disable-line max-len
        );

        return gulp.src( files )
            .pipe( replace(
                re1,
                `$1${version}`
            ) )
            .pipe( replace(
                re2,
                `$1${version}$3`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Group: Parent replacements
     */

    /**
     * Method: version_parent_autoloader
     * 
     * Parent: version the autoloader (index) file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./index.php
     * --- Text
     * * @version 1.2.3
     * ---
     */
    function version_parent_autoloader(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}index.php`;
        const { version } = wpdtrt_plugin_boilerplate_package;
        const re = new RegExp(
            /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${version}`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_parent_composer
     * 
     * Parent: version the composer file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./composer.json
     * --- Text
     * "DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_1_2_3\\": "src"
     * ---
     */
    function version_parent_composer(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package_version_namespaced
    ) {
        const files = `${input_path}composer.json`;
        const re = new RegExp(
            /(\"DoTheRightThing\\\\WPDTRT_Plugin_Boilerplate\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\\")/ // eslint-disable-line max-len
        );

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${wpdtrt_plugin_boilerplate_package_version_namespaced}$3`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_parent_gulpfile
     * 
     * Parent: version the gulpfile.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./gulpfile.js
     * --- Text
     * * @version 1.2.3
     * ---
     */
    function version_parent_gulpfile(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}gulpfile.js`;
        const { version } = wpdtrt_plugin_boilerplate_package;
        const re = new RegExp(
            /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${version}`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_parent_naturaldocs_project
     * 
     * Parent: version the Natural Docs' Project.txt.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./config/naturaldocs/Project.txt
     * --- Text
     * Subtitle: DTRT WordPress Plugin Boilerplate (1.2.3)
     * ---
     */
    function version_parent_naturaldocs_project(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}config/naturaldocs/Project.txt`;
        const re = new RegExp(
            /(Subtitle: DTRT WordPress Plugin Boilerplate \(+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/ // eslint-disable-line max-len
        );
        const { version } = wpdtrt_plugin_boilerplate_package;

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${version}`
            ) )
            .pipe( gulp.dest( `${output_path}config/naturaldocs/` ) );
    }

    /**
     * Method: version_parent_src
     * 
     * Parent: version the namespaced src files.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./src/*.php
     * --- Text
     * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
     * ---
     */
    function version_parent_src(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package_version_namespaced
    ) {
        const categories = [
            "Rewrite",
            "Shortcode",
            "Taxonomy",
            "TemplateLoader",
            "Widget"
        ];
        const files = [];
        const re = new RegExp(
            /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm // eslint-disable-line max-len
        );

        categories.map( category => {
            files.push( `${input_path}src/${category}.php` );
        });

        return gulp.src( files )
            .pipe( replace(
                re,
                `$1${wpdtrt_plugin_boilerplate_package_version_namespaced}`
            ) )
            .pipe(gulp.dest( `${output_path}src/` ) );
    }

    /**
     * Method: version_parent_src_plugin
     * 
     * Parent: version the namespaced src/Plugin.php file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./src/Plugin.php
     * --- Text
     * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
     * ---
     * --- Text
     * const WPDTRT_PLUGIN_VERSION = "1.2.3";
     * ---
     */
    function version_parent_src_plugin(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package,
        wpdtrt_plugin_boilerplate_package_version_namespaced
    ) {
        const files = `${input_path}src/Plugin.php`;
        const { version } = wpdtrt_plugin_boilerplate_package;
        const version_ns = wpdtrt_plugin_boilerplate_package_version_namespaced;
        const re1 = new RegExp(
            /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm // eslint-disable-line max-len
        );
        const re2 = new RegExp(
            /(const WPDTRT_PLUGIN_VERSION = ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(';)/ // eslint-disable-line max-len
        );

        return gulp.src( files )
            .pipe( replace(
                re1,
                `$1${version_ns}`
            ) )
            .pipe( replace(
                re2,
                `$1${version}$3`
            ) )
            .pipe(gulp.dest( `${output_path}src/` ) );
    }

    /**
     * Method: version_parent_test_readme
     * 
     * Parent: version the (WordPress) readme.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./tests/generated-plugin/readme.txt
     * --- Text
     * Stable tag: 1.2.3
     * ---
     * --- Text
     * // == Changelog ==
     * //
     * // = 1.2.3 =
     * //
     * ---
     */
    function version_parent_test_readme(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}tests/generated-plugin/readme.txt`;
        const { version } = wpdtrt_plugin_boilerplate_package;
        const re1 = new RegExp(
            /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const re2 = new RegExp(
            /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/ // eslint-disable-line max-len
        );

        return gulp.src(files)
            .pipe( replace(
                re1,
                `$1${version}`
            ) )
            .pipe( replace(
                re2,
                `$1${version} =\n\n= $2$3`
            ) )
            .pipe(gulp.dest( `${output_path}tests/generated-plugin/` ) );
    }

    /**
     * Method: version_parent_test_naturaldocs_project
     * 
     * Parent: version Natural Docs' Project.txt.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./config/naturaldocs/Project.txt
     * --- Text
     * Subtitle: DTRT Foo (1.2.3)
     * ---
     */
    function version_parent_test_naturaldocs_project(
        input_path,
        output_path,
        root_package
    ) {
        const files = `${input_path}tests/generated-plugin/`
        + "config/naturaldocs/Project.txt";
        const re = new RegExp(
            /(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const { version } = root_package;

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${version}`
            ) )
            .pipe( gulp.dest( `${output_path}tests/generated-plugin/config/naturaldocs/` ) ); // eslint-disable-line max-len
    }

    /**
     * Method: version_parent_test_root
     * 
     * Parent: version the root (WordPress) file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./tests/generated-plugin/index.php
     * --- Text
     * * Version: 1.2.3
     * ---
     * --- Text
     * define( 'WPDTRT_TEST_VERSION', '1.2.3' );
     * ---
     */
    function version_parent_test_root(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}tests/generated-plugin/wpdtrt-test.php`;
        const { version } = wpdtrt_plugin_boilerplate_package;
        const re1 = new RegExp(
            /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const re2 = new RegExp(
            /(define\( 'WPDTRT_TEST_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/ // eslint-disable-line max-len
        );

        gulp.src(files)
            .pipe( replace(
                re1,
                `$1${version}`
            ) )
            .pipe( replace(
                re2,
                `$1${version}$3`
            ) )
            .pipe( gulp.dest( `${output_path}tests/generated-plugin/` ) );
    }

    /**
     * Method: version_parent_test_src
     * 
     * Parent: version the namespaced src files.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
     *
     * Output:
     * ./tests/generated-plugin/src/*.php
     * --- Text
     * DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
     * ---
     */
    function version_parent_test_src(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package_version_namespaced
    ) {
        const categories = [
            "plugin",
            "rewrite",
            "shortcode",
            "taxonomy",
            "widget"
        ];
        const files = [];
        const re = new RegExp(
            /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/ // eslint-disable-line max-len
        );
        const version_ns = wpdtrt_plugin_boilerplate_package_version_namespaced;

        categories.map( category => {
            files.push(
                `${input_path}tests/generated-plugin/src/`
                + `class-wpdtrt-test-${category}.php` );
        });

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${version_ns}`
            ) )
            .pipe( gulp.dest( `${output_path}tests/generated-plugin/src/` ) );
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
    let input;
    let output;
    let root_package;
    let wpdtrt_plugin_boilerplate_package;
    let wpdtrt_plugin_boilerplate_package_version_namespaced;

    // orphan parent
    if (root_input_path === wpdtrt_plugin_boilerplate_input_path) {

        input = wpdtrt_plugin_boilerplate_input_path;
        output = wpdtrt_plugin_boilerplate_output_path;
        root_package = require( `${process.cwd()}/${input}package.json` );
        wpdtrt_plugin_boilerplate_package = require(
            `${process.cwd()}/${input}package.json`
        );

        const { name: bp_name, version: bp_version } = wpdtrt_plugin_boilerplate_package; // eslint-disable-line max-len

        wpdtrt_plugin_boilerplate_package_version_namespaced = namespace_safe_version( bp_version ); // eslint-disable-line max-len

        // get the latest release number
        console.log( `      Bump ${bp_name} to ${bp_version} `
            + "using package.json" );

        version_parent_autoloader(
            input,
            output,
            wpdtrt_plugin_boilerplate_package
        );

        version_parent_composer(
            input,
            output,
            wpdtrt_plugin_boilerplate_package_version_namespaced
        );

        version_parent_gulpfile(
            input,
            output,
            wpdtrt_plugin_boilerplate_package
        );

        version_parent_src(
            input,
            output,
            wpdtrt_plugin_boilerplate_package_version_namespaced
        );

        version_parent_src_plugin(
            input,
            output,
            wpdtrt_plugin_boilerplate_package,
            wpdtrt_plugin_boilerplate_package_version_namespaced
        );

        version_parent_naturaldocs_project(
            input,
            output,
            wpdtrt_plugin_boilerplate_package
        );

        version_parent_test_readme(
            input,
            output,
            wpdtrt_plugin_boilerplate_package
        );

        version_parent_test_root(
            input,
            output,
            wpdtrt_plugin_boilerplate_package
        );

        version_parent_test_src(
            input,
            output,
            wpdtrt_plugin_boilerplate_package_version_namespaced
        );

        version_parent_test_naturaldocs_project(
            input,
            output,
            wpdtrt_plugin_boilerplate_package
        );

        // TODO: version_parent_test_naturaldocs_project
    } else {
        // parent installed as a dependency of child
        input = root_input_path;
        output = root_output_path;
        root_package = require( `${process.cwd()}/${input}package.json` );
        wpdtrt_plugin_boilerplate_package = require(
            `${process.cwd()}/`
            + `${wpdtrt_plugin_boilerplate_input_path}package.json` 
        );

        const { name: rp_name, version: rp_version } = root_package;
        const { name: bp_name, version: bp_version } = wpdtrt_plugin_boilerplate_package; // eslint-disable-line max-len

        wpdtrt_plugin_boilerplate_package_version_namespaced = namespace_safe_version( bp_version ); // eslint-disable-line max-len

        console.log(
            // bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin-boilerplate 1.2.3 using package.json
            `      Bump ${rp_name} to ${rp_version} `
            + `and ${bp_name} ${bp_version} using package.json`
        );

        version_generated_plugin_src(
            input,
            output,
            root_package,
            wpdtrt_plugin_boilerplate_package_version_namespaced
        );

        version_generated_plugin_gulpfile(
            input,
            output,
            root_package
        );

        version_generated_plugin_readme(
            input,
            output,
            root_package
        );

        version_generated_plugin_root(
            input,
            output,
            root_package
        );

        version_generated_plugin_naturaldocs_project(
            input,
            output,
            root_package
        );
    }
};

// Export the plugin main function
module.exports = wpdtrtPluginBump;
