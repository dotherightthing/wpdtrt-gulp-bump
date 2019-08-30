/**
 * File: index.js
 * Topic: DTRT WordPress Plugin Boilerplate
 *
 * wpdtrtPluginBump utility.
 */

const gulp = require( 'gulp' );
const replace = require( 'gulp-replace' );

/**
 * Function: logFiles
 *
 * Print a message to the console.
 *
 * Parameters:
 *   (array) files - Files to version
 *
 * Note:
 * - If files don't exist, the versioning functions will fail silently.
 */
function logFiles( files ) {
  let length = 1;
  let plural = '';
  let filesStr = files;

  if ( Array.isArray( files ) ) {
    length = files.length;
    plural = 's';

    // remove [ and ] from output
    filesStr = files.toString();
    filesStr = filesStr.replace( /,/g, '\n' );
  }

  console.log( `Versioning ${length} file${plural}:` );
  console.log( filesStr );
  console.log( ' ' );
}

/**
 * Function: wpdtrtPluginBump
 *
 * require() is relative to the active gulpfile not to the CWD
 * as it is wpdtrt-plugin-boilerplate/gulpfile.babel.js which is always run.
 *
 * ./package.json will always be wpdtrt-plugin-boilerplate/package.json
 *
 * Therefore we differentiate between
 * packageRoot & packageBoilerplate
 *
 * process.cwd() returns the path of the parent directory
 * of the js file running as the node process
 * not the js file it is executed in
 *
 * Parameters:
 *   (object)
 *   Options:
 *
 *  - inputPathRoot
 *    - Location of the plugin root directory
 *    - Used to load package.json
 *    - Relative to the active gulpfile, not to the CWD
 *    - For real plugins:
 *      - This is the directory containing the Gulpfile
 *    - For unit testing:
 *      - This is a location within 'fixtures'
 *      - Used to load files requiring transformation
 *  - outputPathRoot
 *    - Location to output versioned files to
 *    - For real plugins:
 *      - This is the plugin root directory (inputPathRoot)
 *    - For unit testing:
 *      - Used to output transformated files
 *      - This is the tmp wpdtrt-generated-plugin directory
 *      - This is the tmp wpdtrt-plugin-boilerplate directory
 *  - inputPathBoilerplate
 *    - Used to load package.json
 *    - For real plugins:
 *      - This is the root directory if the boilerplate is not a dependency
 *      - This is Composer's install location if the boilerplate is a dependency
 *    - For unit testing:
 *      - Used to load files requiring transformation
 *  - outputPathBoilerplate
 *    - For unit testing:
 *      - Used to output transformated files
 */
const wpdtrtPluginBump = function ( {
  inputPathRoot = '',
  outputPathRoot = inputPathRoot,
  inputPathBoilerplate = '',
  outputPathBoilerplate = inputPathBoilerplate
} = {} ) {
  // console.log( `inputPathRoot = ${inputPathRoot}` );
  // console.log( `outputPathRoot = ${outputPathRoot}` );
  // console.log( `inputPathBoilerplate = ${inputPathBoilerplate}` );
  // console.log( `outputPathBoilerplate = ${outputPathBoilerplate}` );

  /**
   * Method: versionNamespaceSafe
   *
   * Get the version value from wpdtrt-plugin-boilerplate/package.json,
   *  in namespace format.
   *
   * Parameters:
   *   (string) packageVersionBoilerplate, e.g. 1.2.34
   *
   * Returns:
   *   (string) The version in namespace format, e.g. 1_2_34
   */
  function versionNamespaceSafe( packageVersionBoilerplate ) {
    return packageVersionBoilerplate.split( '.' ).join( '_' );
  }

  /**
   * Group: Generated Plugin versioning
   */

  /**
   * Method: versionGeneratedPluginSrc
   *
   * Child: version the extended class name.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageRoot - A reference to the generated plugin's
   *   package.json file
   *   (string) packageVersionBoilerplateNamespaced - The version in
   *   namespace format
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
  function versionGeneratedPluginSrc(
    inputPath,
    outputPath,
    packageRoot,
    packageVersionBoilerplateNamespaced
  ) {
    const categories = [
      'plugin',
      'rewrite',
      'shortcode',
      'taxonomy',
      'widget'
    ];
    const files = [];
    const re = new RegExp(
      /(extends DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/
    );
    const { name } = packageRoot;

    categories.forEach( ( category ) => {
      files.push(
        `${inputPath}src/class-${name}-${category}.php`
      );
    } );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${packageVersionBoilerplateNamespaced}`
      ) )
      .pipe( gulp.dest( `${outputPath}src/` ) );
  }

  /**
   * Method: versionGeneratedPluginGulpfile
   *
   * Child: version the gulpfile.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageRoot - A reference to the generated plugin's
   *   package.json file
   *
   * Returns:
   *   (array) src files
   *
   * Output:
   * ./gulpfile.babel.js
   * --- Text
   * * @version 1.2.3
   * ---
   */
  function versionGeneratedPluginGulpfile(
    inputPath,
    outputPath,
    packageRoot
  ) {
    const files = `${inputPath}gulpfile.babel.js`;
    const re = new RegExp(
      /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const { version } = packageRoot;

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionGeneratedPluginDocs
   *
   * Child: version the Natural Docs' Project.txt.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageRoot - A reference to the generated plugin's
   *   package.json file
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
  function versionGeneratedPluginDocs(
    inputPath,
    outputPath,
    packageRoot
  ) {
    const files = `${inputPath}config/naturaldocs/Project.txt`;
    const re = new RegExp(
      /(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const { version } = packageRoot;

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( `${outputPath}config/naturaldocs/` ) );
  }

  /**
   * Method: versionGeneratedPluginReadme
   *
   * Child: version the (WordPress) readme.txt.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageRoot - A reference to the generated plugin's
   *   package.json file
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
  function versionGeneratedPluginReadme(
    inputPath,
    outputPath,
    packageRoot
  ) {
    const files = `${inputPath}readme.txt`;
    const re1 = new RegExp(
      /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const re2 = new RegExp(
      /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/
    );
    const { version } = packageRoot;

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re1,
        `$1${version}`
      ) )
      .pipe( replace(
        re2,
        `$1${version} =\n\n= $2$3`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionGeneratedPluginWpRoot
   *
   * Child: version the child root file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageRoot - A reference to the generated plugin's
   *   package.json file
   *
   * Returns:
   *   (array) src files
   *
   * Output:
   * ./wpdtrt-generated-plugin.php ?
   * --- Text
   * * Version: 1.2.3
   * ---
   * --- Text
   * define( 'WPDTRT_PLUGIN_VERSION', '1.2.3' );
   * ---
   */
  function versionGeneratedPluginWpRoot(
    inputPath,
    outputPath,
    packageRoot
  ) {
    const { name, version } = packageRoot;
    const files = `${inputPath}${name}.php`;
    const re1 = new RegExp(
      /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const re2 = new RegExp(
      /(define\( 'WPDTRT_PLUGIN_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/
    );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re1,
        `$1${version}`
      ) )
      .pipe( replace(
        re2,
        `$1${version}$3`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Group: Boilerplate versioning
   */

  /**
   * Method: versionBoilerplateAutoloader
   *
   * Parent: version the autoloader (index) file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageBoilerplate - A reference to the package.json file
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
  function versionBoilerplateAutoloader(
    inputPath,
    outputPath,
    packageBoilerplate
  ) {
    const files = `${inputPath}index.php`;
    const { version } = packageBoilerplate;
    const re = new RegExp(
      /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionBoilerplateComposer
   *
   * Parent: version the composer file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (string) packageVersionBoilerplateNamespaced - The version in namespace format
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
  function versionBoilerplateComposer(
    inputPath,
    outputPath,
    packageVersionBoilerplateNamespaced
  ) {
    const files = `${inputPath}composer.json`;
    const re = new RegExp(
      /("DoTheRightThing\\\\WPDTRT_Plugin_Boilerplate\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\")/
    );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${packageVersionBoilerplateNamespaced}$3`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionBoilerplateGulpfile
   *
   * Parent: version the gulpfile.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageBoilerplate - A reference to the package.json file
   *
   * Returns:
   *   (array) src files
   *
   * Output:
   * ./gulpfile.babel.js
   * --- Text
   * * @version 1.2.3
   * ---
   */
  function versionBoilerplateGulpfile(
    inputPath,
    outputPath,
    packageBoilerplate
  ) {
    const files = `${inputPath}gulpfile.babel.js`;
    const { version } = packageBoilerplate;
    const re = new RegExp(
      /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionBoilerplateNaturalDocs
   *
   * Parent: version the Natural Docs' Project.txt.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageBoilerplate - A reference to the package.json file
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
  function versionBoilerplateNaturalDocs(
    inputPath,
    outputPath,
    packageBoilerplate
  ) {
    const files = `${inputPath}config/naturaldocs/Project.txt`;
    const re = new RegExp(
      /(Subtitle: DTRT WordPress Plugin Boilerplate \(+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const { version } = packageBoilerplate;

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( `${outputPath}config/naturaldocs/` ) );
  }

  /**
   * Method: versionBoilerplateSrc
   *
   * Parent: version the namespaced src files.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (string) packageVersionBoilerplateNamespaced - The version in namespace format
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
  function versionBoilerplateSrc(
    inputPath,
    outputPath,
    packageVersionBoilerplateNamespaced
  ) {
    const categories = [
      'Rewrite',
      'Shortcode',
      'Taxonomy',
      'TemplateLoader',
      'Widget'
    ];
    const files = [];
    const re = new RegExp(
      /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm
    );

    categories.forEach( ( category ) => {
      files.push( `${inputPath}src/${category}.php` );
    } );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${packageVersionBoilerplateNamespaced}`
      ) )
      .pipe( gulp.dest( `${outputPath}src/` ) );
  }

  /**
   * Method: versionBoilerplateSrcPlugin
   *
   * Parent: version the namespaced src/Plugin.php file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageBoilerplate - A reference to the package.json file
   *   (string) packageVersionBoilerplateNamespaced - The version in namespace format
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
  function versionBoilerplateSrcPlugin(
    inputPath,
    outputPath,
    packageBoilerplate,
    packageVersionBoilerplateNamespaced
  ) {
    const files = `${inputPath}src/Plugin.php`;
    const { version } = packageBoilerplate;
    const versionNamespaceSafeStr = packageVersionBoilerplateNamespaced;
    const re1 = new RegExp(
      /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm
    );
    const re2 = new RegExp(
      /(const WPDTRT_PLUGIN_VERSION = ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(';)/
    );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re1,
        `$1${versionNamespaceSafeStr}`
      ) )
      .pipe( replace(
        re2,
        `$1${version}$3`
      ) )
      .pipe( gulp.dest( `${outputPath}src/` ) );
  }

  /**
   * Method: versionBoilerplateTestNaturalDocs
   *
   * Parent: version Natural Docs' Project.txt.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageBoilerplate - A reference to the package.json file
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
  function versionBoilerplateTestNaturalDocs(
    inputPath,
    outputPath,
    packageRoot
  ) {
    const files = `${inputPath}tests/generated-plugin/`
        + 'config/naturaldocs/Project.txt';
    const re = new RegExp(
      /(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const { version } = packageRoot;

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe(
        gulp.dest( `${outputPath}tests/generated-plugin/config/naturaldocs/` )
      );
  }

  /**
   * Method: versionBoilerplateTestReadme
   *
   * Parent: version the (WordPress) readme.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageBoilerplate - A reference to the package.json file
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
  function versionBoilerplateTestReadme(
    inputPath,
    outputPath,
    packageBoilerplate
  ) {
    const files = `${inputPath}tests/generated-plugin/readme.txt`;
    const { version } = packageBoilerplate;
    const re1 = new RegExp(
      /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const re2 = new RegExp(
      /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/
    );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re1,
        `$1${version}`
      ) )
      .pipe( replace(
        re2,
        `$1${version} =\n\n= $2$3`
      ) )
      .pipe( gulp.dest( `${outputPath}tests/generated-plugin/` ) );
  }

  /**
   * Method: versionBoilerplateTestWpRoot
   *
   * Parent: version the root (WordPress) file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageBoilerplate - A reference to the package.json file
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
  function versionBoilerplateTestWpRoot(
    inputPath,
    outputPath,
    packageBoilerplate
  ) {
    const files = `${inputPath}tests/generated-plugin/wpdtrt-test.php`;
    const { version } = packageBoilerplate;
    const re1 = new RegExp(
      /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const re2 = new RegExp(
      /(define\( 'WPDTRT_TEST_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/
    );

    logFiles( files );

    gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re1,
        `$1${version}`
      ) )
      .pipe( replace(
        re2,
        `$1${version}$3`
      ) )
      .pipe( gulp.dest( `${outputPath}tests/generated-plugin/` ) );
  }

  /**
   * Method: versionBoilerplateTestSrc
   *
   * Parent: version the namespaced src files.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (string) packageVersionBoilerplateNamespaced - The version in namespace format
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
  function versionBoilerplateTestSrc(
    inputPath,
    outputPath,
    packageVersionBoilerplateNamespaced
  ) {
    const categories = [
      'plugin',
      'rewrite',
      'shortcode',
      'taxonomy',
      'widget'
    ];
    const files = [];
    const re = new RegExp(
      /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/
    );
    const versionNamespaceSafeStr = packageVersionBoilerplateNamespaced;

    categories.forEach( ( category ) => {
      files.push(
        `${inputPath}tests/generated-plugin/src/`
                + `class-wpdtrt-test-${category}.php`
      );
    } );

    logFiles( files );

    return gulp.src( files, { allowEmpty: true } )
      .pipe( replace(
        re,
        `$1${versionNamespaceSafeStr}`
      ) )
      .pipe( gulp.dest( `${outputPath}tests/generated-plugin/src/` ) );
  }

  /**
   * ===== Perform replacements =====
   */

  /**
   * process.cwd() console.log test results
   *
   * /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate/gulpfile.babel.js;
   * /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate/node_modules/gulp-wpdtrt-plugin-bump/index.js
   * = /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate
   *
   * /Volumes/DanBackup/Websites/wpdtrt-blocks/vendor/dotherightthing/wpdtrt-plugin-boilerplate/gulpfile.babel.js
   * /Volumes/DanBackup/Websites/wpdtrt-blocks/node_modules/gulp-wpdtrt-plugin-bump/index.js
   * = /Volumes/DanBackup/Websites/wpdtrt-blocks
   */
  let packageRoot;
  let packageBoilerplate;
  let packageVersionBoilerplateNamespaced;

  // boilerplate as root
  if ( inputPathRoot === inputPathBoilerplate ) {
    /* eslint-disable global-require */
    packageRoot = require( `${process.cwd()}/${inputPathBoilerplate}package.json` );
    packageBoilerplate = require( `${process.cwd()}/${inputPathBoilerplate}package.json` );
    /* eslint-enable global-require */

    const {
      name: nameBoilerplate, version: versionBoilerplate
    } = packageBoilerplate;

    packageVersionBoilerplateNamespaced = versionNamespaceSafe(
      versionBoilerplate
    );

    // get the latest release number
    console.log( `Bump ${nameBoilerplate} to ${versionBoilerplate} `
            + 'using package.json' );

    versionBoilerplateAutoloader(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageBoilerplate
    );

    versionBoilerplateComposer(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageVersionBoilerplateNamespaced
    );

    versionBoilerplateGulpfile(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageBoilerplate
    );

    versionBoilerplateSrc(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageVersionBoilerplateNamespaced
    );

    versionBoilerplateSrcPlugin(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageBoilerplate,
      packageVersionBoilerplateNamespaced
    );

    versionBoilerplateNaturalDocs(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageBoilerplate
    );

    versionBoilerplateTestReadme(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageBoilerplate
    );

    versionBoilerplateTestWpRoot(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageBoilerplate
    );

    versionBoilerplateTestSrc(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageVersionBoilerplateNamespaced
    );

    versionBoilerplateTestNaturalDocs(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageBoilerplate
    );

    // TODO: versionBoilerplateTestNaturalDocs
  } else {
    // parent installed as a dependency of child
    /* eslint-disable global-require */
    packageRoot = require( `${process.cwd()}/${inputPathRoot}package.json` );
    packageBoilerplate = require(
      `${process.cwd()}/`
            + `${inputPathBoilerplate}package.json`
    );
    /* eslint-enable global-require */

    const { name: nameRoot, version: versionRoot } = packageRoot;
    const {
      name: nameBoilerplate, version: versionBoilerplate
    } = packageBoilerplate;

    packageVersionBoilerplateNamespaced = versionNamespaceSafe(
      versionBoilerplate
    );

    console.log(
      // bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin-boilerplate 1.2.3 using package.json
      `Bump ${nameRoot} to ${versionRoot} `
            + `and ${nameBoilerplate} ${versionBoilerplate} using package.json`
    );

    versionGeneratedPluginSrc(
      inputPathRoot,
      outputPathRoot,
      packageRoot,
      packageVersionBoilerplateNamespaced
    );

    versionGeneratedPluginGulpfile(
      inputPathRoot,
      outputPathRoot,
      packageRoot
    );

    versionGeneratedPluginReadme(
      inputPathRoot,
      outputPathRoot,
      packageRoot
    );

    versionGeneratedPluginWpRoot(
      inputPathRoot,
      outputPathRoot,
      packageRoot
    );

    versionGeneratedPluginDocs(
      inputPathRoot,
      outputPathRoot,
      packageRoot
    );
  }
};

// Export the plugin main function
module.exports = wpdtrtPluginBump;
