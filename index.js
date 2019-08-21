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
    wpdtrt_plugin_boilerplate_output_path = wpdtrt_plugin_boilerplate_input_path
} = {} ) {

    /**
     * Method: namespace_safe_version
     * 
     * Get the version value from wpdtrt-plugin-boilerplate/package.json,
     *  in namespace format.
     *
     * Parameters:
     *   (string) wpdtrt_plugin_boilerplate_package_version
     *
     * Returns:
     *   (string) The version in namespace format
     */
    function namespace_safe_version(wpdtrt_plugin_boilerplate_package_version) {
        return wpdtrt_plugin_boilerplate_package_version.split(".").join("_");
    }

    /**
     * ===== Child replacements =====
     */

    /**
     * Method: version_child_src
     * 
     * Child - version the extended class name.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin/
     *   (string) output_path - Path to wpdtrt-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
     */
    function version_child_src(
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
            // extends DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
            "/(extends DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\"
            + "r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/"
        );

        categories.map( category => {
            files.push(
                `${input_path}src/class-${root_package.name}-${category}.php`
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
     * Method: version_child_gulpfile
     * 
     * Child - version the gulpfile.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin/
     *   (string) output_path - Path to wpdtrt-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *
     * Returns:
     *   (array) src files
     */
    function version_child_gulpfile(
        input_path,
        output_path,
        root_package
    ) {
        const files = `${input_path}gulpfile.js`;
        const re = new RegExp(
            // * @version 1.2.3
            "/(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/"
        );

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${root_package.version}`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_child_readme
     * 
     * Child: version the (WordPress) readme.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin/
     *   (string) output_path - Path to wpdtrt-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *
     * Returns:
     *   (array) src files
     */
    function version_child_readme(
        input_path,
        output_path,
        root_package
    ) {
        const files = `${input_path}readme.txt`;
        const re1 = new RegExp(
            // Stable tag: 1.2.3
            "/(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/"
        );
        const re2 = new RegExp(
            // == Changelog ==
            //
            // = 1.2.3 =
            //
            "/(== Changelog ==\s\s= )"
            + "([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/"
        )

        return gulp.src(files)
            .pipe( replace(
                re1,
                `$1${root_package.version}`
            ) )
            .pipe( replace(
                re2,
                `$1${root_package.version} =\n\n= $2$3`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_child_root
     * 
     * Child - version the child root file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin/
     *   (string) output_path - Path to wpdtrt-plugin/ output directory
     *   (object) root_package - A reference to the child's package.json file
     *
     * Returns:
     *   (array) src files
     */
    function version_child_root(
        input_path,
        output_path,
        root_package
    ) {
        const files = `${input_path}${root_package.name}.php`;
        const { version: rp_version } = root_package;
        const re1 = new RegExp(
            // * Version: 1.2.3
            "/(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/"
        );
        const re2 = new RegExp(
            // define( "WPDTRT_FOO_VERSION", "1.2.3" );
            "/(define\( \"[A-Z_]+_VERSION\", \")"
            + "([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(\" \);)/"
        );

        return gulp.src( files )
            .pipe( replace(
                re1,
                `$1${rp_version}`
            ) )
            .pipe( replace(
                re2,
                `$1${rp_version}$3`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * ===== Parent replacements =====
     */

    /**
     * Method: version_parent_autoloader
     * 
     * Parent - version the autoloader (index) file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     */
    function version_parent_autoloader(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}index.php`;
        const { version: bp_version } = wpdtrt_plugin_boilerplate_package;
        const re = new RegExp(
            // * @version 1.2.3
            /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${bp_version}`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_parent_composer
     * 
     * Parent - version the composer file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
     */
    function version_parent_composer(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package_version_namespaced
    ) {
        const files = `${input_path}composer.json`;
        const re = new RegExp(
            // "DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_1_2_3\\": "src"
            "/(\"DoTheRightThing\\\\WPDTRT_Plugin_Boilerplate\\\\"
            + "r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\\")/"
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
     * Parent - version the gulpfile.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     */
    function version_parent_gulpfile(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}gulpfile.js`;
        const { version: bp_version } = wpdtrt_plugin_boilerplate_package;
        const re = new RegExp(
            // * @version 1.2.3
            /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${bp_version}`
            ) )
            .pipe( gulp.dest( output_path ) );
    }

    /**
     * Method: version_parent_src
     * 
     * Parent - version the namespaced src files.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
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
            /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/ // eslint-disable-line max-len
        );

        categories.map( category => {
            files.push( `${input_path}src/${category}.php` );
        });

        // DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
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
     * Parent - version the namespaced src/Plugin.php file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
     */
    function version_parent_src_plugin(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package,
        wpdtrt_plugin_boilerplate_package_version_namespaced
    ) {
        const files = `${input_path}src/Plugin.php`;
        const { version: bp_version } = wpdtrt_plugin_boilerplate_package;
        const re1 = new RegExp(
            // DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
            /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/ // eslint-disable-line max-len
        );
        const re2 = new RegExp(
            // const WPDTRT_PLUGIN_VERSION = "1.2.3";
            "/(const WPDTRT_PLUGIN_VERSION = \")"
            + "([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(\";)/"
        )

        return gulp.src( files )
            .pipe( replace(
                re1,
                `$1${wpdtrt_plugin_boilerplate_package_version_namespaced}`
            ) )
            .pipe( replace(
                re2,
                `$1${bp_version}$3`
            ) )
            .pipe(gulp.dest( `${output_path}src/` ) );
    }

    /**
     * Method: version_parent_test_readme
     * 
     * Parent - version the (WordPress) readme.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     */
    function version_parent_test_readme(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}tests/generated-plugin/readme.txt`;
        const { version: bp_version } = wpdtrt_plugin_boilerplate_package;
        const re1 = new RegExp(
            // Stable tag: 1.2.3
            /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const re2 = new RegExp(
            // == Changelog ==
            //
            // = 1.2.3 =
            //
            /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/ // eslint-disable-line max-len
        );

        return gulp.src(files)
            .pipe( replace(
                re1,
                `$1${bp_version}`
            ) )
            .pipe( replace(
                re2,
                `$1${bp_version} =\n\n= $2$3`
            ) )
            .pipe(gulp.dest( `${output_path}tests/generated-plugin/` ) );
    }

    /**
     * Method: version_parent_test_root
     * 
     * Parent - version the root (WordPress) file.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (object) wpdtrt_plugin_boilerplate_package - A reference to the package.json file
     *
     * Returns:
     *   (array) src files
     */
    function version_parent_test_root(
        input_path,
        output_path,
        wpdtrt_plugin_boilerplate_package
    ) {
        const files = `${input_path}tests/generated-plugin/wpdtrt-test.php`;
        const { version: bp_version } = wpdtrt_plugin_boilerplate_package;
        const re1 = new RegExp(
            // * Version: 1.2.3
            /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
        );
        const re2 = new RegExp(
            // define( "WPDTRT_FOO_VERSION", "1.2.3" );
            /(define\( \"[A-Z_]+_VERSION\", \")([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(\" \);)/ // eslint-disable-line max-len
        );

        gulp.src(files)
            .pipe( replace(
                re1,
                `$1${bp_version}`
            ) )
            .pipe( replace(
                re2,
                `$1${bp_version}$3`
            ) )
            .pipe( gulp.dest( `${output_path}tests/generated-plugin/` ) );
    }

    /**
     * Method: version_parent_test_src
     * 
     * Parent - version the namespaced src files.
     *
     * Parameters:
     *   (string) input_path - Path to wpdtrt-plugin-boilerplate/
     *   (string) output_path - Path to wpdtrt-plugin-boilerplate/ output directory
     *   (string) wpdtrt_plugin_boilerplate_package_version_namespaced - The version in namespace format
     *
     * Returns:
     *   (array) src files
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
            // DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_2_3
            /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/ // eslint-disable-line max-len
        );

        categories.map( category => {
            files.push(
                `${input_path}tests/generated-plugin/src/`
                + `class-wpdtrt-test-${category}.php` );
        });

        return gulp.src(files)
            .pipe( replace(
                re,
                `$1${wpdtrt_plugin_boilerplate_package_version_namespaced}`
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
        console.log( `Bump ${bp_name} to ${bp_version} using package.json` );

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
    } else {
        // parent installed as a dependency of child
        input = root_input_path;
        output = root_output_path;
        root_package = require( `${process.cwd()}/${input}package.json` );
        wpdtrt_plugin_boilerplate_package = require(
            `${process.cwd()}/`
            + `${wpdtrt_plugin_boilerplate_input_path}package.json` 
        );

        const { rp_name, rp_version } = root_package;
        const { bp_name, bp_version } = wpdtrt_plugin_boilerplate_package;

        wpdtrt_plugin_boilerplate_package_version_namespaced = namespace_safe_version( bp_version ); // eslint-disable-line max-len

        console.log(
            // bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin-boilerplate 1.2.3 using package.json
            `Bump ${rp_name} to ${rp_version} and ${bp_name} ${bp_version} `
            + "using package.json"
        );

        version_child_src(
            input,
            output,
            root_package, wpdtrt_plugin_boilerplate_package_version_namespaced
        );

        version_child_gulpfile(
            input,
            output,
            root_package
        );

        version_child_readme(
            input,
            output,
            root_package
        );

        version_child_root(
            input,
            output,
            root_package
        );
    }
};

// Export the plugin main function
module.exports = wpdtrtPluginBump;
