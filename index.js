/**
 * File: index.js
 * Topic: DTRT WordPress Plugin Boilerplate
 *
 * wpdtrtPluginBump utility.
 */

const gulp = require( 'gulp' );
const replace = require( 'gulp-replace' );

/**
 * Function: wpdtrtPluginBump
 *
 * require() is relative to the active gulpfile not to the CWD
 * as it is wpdtrt-plugin-boilerplate/gulpfile.js which is always run.
 *
 * ./package.json will always be wpdtrt-plugin-boilerplate/package.json
 *
 * Therefore we differentiate between
 * packageJsonRoot & packageJsonBoilerplate
 *
 * process.cwd() returns the path of the parent directory
 * of the js file running as the node process
 * not the js file it is executed in
 *
 * Parameters:
 *   (object) Options
 *   * inputPathRoot - Location of the plugin root directory
 *     * Used to load package.json
 *     * Relative to the active gulpfile, not to the CWD
 *     * For unit testing this is a location within 'fixtures'
 *   * outputPathRoot - Location to output versioned files to
 *     * For real plugins this is the plugin root directory (inputPathRoot)
 *     * Only used to redirect output during testing
 *     * For unit testing this is the tmp wpdtrt-generated-plugin directory
 *     * For unit testing this is the tmp wpdtrt-plugin-boilerplate directory
 *   * inputPathBoilerplate
 *   * outputPathBoilerplate
 *     * Only used to redirect output during testing
 */
const wpdtrtPluginBump = function ( {
  inputPathRoot = '',
  outputPathRoot = inputPathRoot,
  inputPathBoilerplate = '',
  outputPathBoilerplate = inputPathBoilerplate
} = {} ) {
  console.log( `inputPathRoot = ${inputPathRoot}` );
  console.log( `outputPathRoot = ${outputPathRoot}` );
  console.log( `inputPathBoilerplate = ${inputPathBoilerplate}` );
  console.log( `outputPathBoilerplate = ${outputPathBoilerplate}` );

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
   * Group: Child replacements
   */

  /**
   * Method: versionGeneratedPluginSrc
   *
   * Child: version the extended class name.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageJsonRoot - A reference to the generated plugin's
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
    packageJsonRoot,
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
    const { name } = packageJsonRoot;

    categories.forEach( ( category ) => {
      files.push(
        `${inputPath}src/class-${name}-${category}.php`
      );
    } );

    return gulp.src( files )
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
   *   (object) packageJsonRoot - A reference to the generated plugin's
   *   package.json file
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
  function versionGeneratedPluginGulpfile(
    inputPath,
    outputPath,
    packageJsonRoot
  ) {
    const files = `${inputPath}gulpfile.js`;
    const re = new RegExp(
      /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const { version } = packageJsonRoot;

    return gulp.src( files )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionNaturalDocsGeneratedPlugin
   *
   * Child: version the Natural Docs' Project.txt.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageJsonRoot - A reference to the generated plugin's
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
  function versionNaturalDocsGeneratedPlugin(
    inputPath,
    outputPath,
    packageJsonRoot
  ) {
    const files = `${inputPath}config/naturaldocs/Project.txt`;
    const re = new RegExp(
      /(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const { version } = packageJsonRoot;

    return gulp.src( files )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( `${outputPath}config/naturaldocs/` ) );
  }

  /**
   * Method: versionReadmeGeneratedPlugin
   *
   * Child: version the (WordPress) readme.txt.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageJsonRoot - A reference to the generated plugin's
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
  function versionReadmeGeneratedPlugin(
    inputPath,
    outputPath,
    packageJsonRoot
  ) {
    const files = `${inputPath}readme.txt`;
    const re1 = new RegExp(
      /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const re2 = new RegExp(
      /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/
    );
    const { version } = packageJsonRoot;

    return gulp.src( files )
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
   * Method: versionRootGeneratedPlugin
   *
   * Child: version the child root file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-generated-plugin/
   *   (string) outputPath - Path to wpdtrt-generated-plugin/ output directory
   *   (object) packageJsonRoot - A reference to the generated plugin's
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
  function versionRootGeneratedPlugin(
    inputPath,
    outputPath,
    packageJsonRoot
  ) {
    const { name, version } = packageJsonRoot;
    const files = `${inputPath}${name}.php`;
    const re1 = new RegExp(
      /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const re2 = new RegExp(
      /(define\( 'WPDTRT_PLUGIN_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/
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
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Group: Parent replacements
   */

  /**
   * Method: versionAutoloaderParent
   *
   * Parent: version the autoloader (index) file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageJsonBoilerplate - A reference to the package.json file
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
  function versionAutoloaderParent(
    inputPath,
    outputPath,
    packageJsonBoilerplate
  ) {
    const files = `${inputPath}index.php`;
    const { version } = packageJsonBoilerplate;
    const re = new RegExp(
      /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    return gulp.src( files )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionComposerParent
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
  function versionComposerParent(
    inputPath,
    outputPath,
    packageVersionBoilerplateNamespaced
  ) {
    const files = `${inputPath}composer.json`;
    const re = new RegExp(
      /("DoTheRightThing\\\\WPDTRT_Plugin_Boilerplate\\\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})(\\\\")/
    );

    return gulp.src( files )
      .pipe( replace(
        re,
        `$1${packageVersionBoilerplateNamespaced}$3`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionGulpfileParent
   *
   * Parent: version the gulpfile.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageJsonBoilerplate - A reference to the package.json file
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
  function versionGulpfileParent(
    inputPath,
    outputPath,
    packageJsonBoilerplate
  ) {
    const files = `${inputPath}gulpfile.js`;
    const { version } = packageJsonBoilerplate;
    const re = new RegExp(
      /(\* @version\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );

    return gulp.src( files )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( outputPath ) );
  }

  /**
   * Method: versionNaturalDocsParent
   *
   * Parent: version the Natural Docs' Project.txt.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageJsonBoilerplate - A reference to the package.json file
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
  function versionNaturalDocsParent(
    inputPath,
    outputPath,
    packageJsonBoilerplate
  ) {
    const files = `${inputPath}config/naturaldocs/Project.txt`;
    const re = new RegExp(
      /(Subtitle: DTRT WordPress Plugin Boilerplate \(+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const { version } = packageJsonBoilerplate;

    return gulp.src( files )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe( gulp.dest( `${outputPath}config/naturaldocs/` ) );
  }

  /**
   * Method: versionSrcParent
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
  function versionSrcParent(
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

    return gulp.src( files )
      .pipe( replace(
        re,
        `$1${packageVersionBoilerplateNamespaced}`
      ) )
      .pipe( gulp.dest( `${outputPath}src/` ) );
  }

  /**
   * Method: versionSrcPluginParent
   *
   * Parent: version the namespaced src/Plugin.php file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageJsonBoilerplate - A reference to the package.json file
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
  function versionSrcPluginParent(
    inputPath,
    outputPath,
    packageJsonBoilerplate,
    packageVersionBoilerplateNamespaced
  ) {
    const files = `${inputPath}src/Plugin.php`;
    const { version } = packageJsonBoilerplate;
    const versionNamespaceSafeStr = packageVersionBoilerplateNamespaced;
    const re1 = new RegExp(
      /(DoTheRightThing\\WPDTRT_Plugin_Boilerplate\\r_)([0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3})/gm
    );
    const re2 = new RegExp(
      /(const WPDTRT_PLUGIN_VERSION = ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(';)/
    );

    return gulp.src( files )
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
   * Method: versionNaturalDocsParentTest
   *
   * Parent: version Natural Docs' Project.txt.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageJsonBoilerplate - A reference to the package.json file
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
  function versionNaturalDocsParentTest(
    inputPath,
    outputPath,
    packageJsonRoot
  ) {
    const files = `${inputPath}tests/generated-plugin/`
        + 'config/naturaldocs/Project.txt';
    const re = new RegExp(
      /(Subtitle: [A-Za-z0-9( ]+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const { version } = packageJsonRoot;

    return gulp.src( files )
      .pipe( replace(
        re,
        `$1${version}`
      ) )
      .pipe(
        gulp.dest( `${outputPath}tests/generated-plugin/config/naturaldocs/` )
      );
  }

  /**
   * Method: versionReadmeParentTest
   *
   * Parent: version the (WordPress) readme.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageJsonBoilerplate - A reference to the package.json file
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
  function versionReadmeParentTest(
    inputPath,
    outputPath,
    packageJsonBoilerplate
  ) {
    const files = `${inputPath}tests/generated-plugin/readme.txt`;
    const { version } = packageJsonBoilerplate;
    const re1 = new RegExp(
      /(Stable tag: )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const re2 = new RegExp(
      /(== Changelog ==\s\s= )([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})+( =\s)/
    );

    return gulp.src( files )
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
   * Method: versionRootParentTest
   *
   * Parent: version the root (WordPress) file.
   *
   * Parameters:
   *   (string) inputPath - Path to wpdtrt-plugin-boilerplate/
   *   (string) outputPath - Path to wpdtrt-plugin-boilerplate/ output directory
   *   (object) packageJsonBoilerplate - A reference to the package.json file
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
  function versionRootParentTest(
    inputPath,
    outputPath,
    packageJsonBoilerplate
  ) {
    const files = `${inputPath}tests/generated-plugin/wpdtrt-test.php`;
    const { version } = packageJsonBoilerplate;
    const re1 = new RegExp(
      /(\* Version:\s+)([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
    );
    const re2 = new RegExp(
      /(define\( 'WPDTRT_TEST_VERSION', ')([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(' \);)/
    );

    gulp.src( files )
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
   * Method: versionSrcParentTest
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
  function versionSrcParentTest(
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

    return gulp.src( files )
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
   * /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate/gulpfile.js;
   * /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate/node_modules/gulp-wpdtrt-plugin-bump/index.js
   * = /Volumes/DanBackup/Websites/wpdtrt-plugin-boilerplate
   *
   * /Volumes/DanBackup/Websites/wpdtrt-blocks/vendor/dotherightthing/wpdtrt-plugin-boilerplate/gulpfile.js
   * /Volumes/DanBackup/Websites/wpdtrt-blocks/node_modules/gulp-wpdtrt-plugin-bump/index.js
   * = /Volumes/DanBackup/Websites/wpdtrt-blocks
   */
  let packageJsonRoot;
  let packageJsonBoilerplate;
  let packageVersionBoilerplateNamespaced;

  // orphan parent
  if ( inputPathRoot === inputPathBoilerplate ) {
    /* eslint-disable global-require */
    packageJsonRoot = require( `${process.cwd()}/${inputPathBoilerplate}package.json` );
    packageJsonBoilerplate = require(
      `${process.cwd()}/${inputPathBoilerplate}package.json`
    );
    /* eslint-enable global-require */

    const {
      name: nameBoilerplate, version: versionBoilerplate
    } = packageJsonBoilerplate;

    packageVersionBoilerplateNamespaced = versionNamespaceSafe(
      versionBoilerplate
    );

    // get the latest release number
    console.log( `      Bump ${nameBoilerplate} to ${versionBoilerplate} `
            + 'using package.json' );

    versionAutoloaderParent(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageJsonBoilerplate
    );

    versionComposerParent(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageVersionBoilerplateNamespaced
    );

    versionGulpfileParent(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageJsonBoilerplate
    );

    versionSrcParent(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageVersionBoilerplateNamespaced
    );

    versionSrcPluginParent(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageJsonBoilerplate,
      packageVersionBoilerplateNamespaced
    );

    versionNaturalDocsParent(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageJsonBoilerplate
    );

    versionReadmeParentTest(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageJsonBoilerplate
    );

    versionRootParentTest(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageJsonBoilerplate
    );

    versionSrcParentTest(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageVersionBoilerplateNamespaced
    );

    versionNaturalDocsParentTest(
      inputPathBoilerplate,
      outputPathBoilerplate,
      packageJsonBoilerplate
    );

    // TODO: versionNaturalDocsParentTest
  } else {
    // parent installed as a dependency of child
    /* eslint-disable global-require */
    packageJsonRoot = require( `${process.cwd()}/${inputPathRoot}package.json` );
    packageJsonBoilerplate = require(
      `${process.cwd()}/`
            + `${inputPathBoilerplate}package.json`
    );
    /* eslint-enable global-require */

    const { name: nameRoot, version: versionRoot } = packageJsonRoot;
    const {
      name: nameBoilerplate, version: versionBoilerplate
    } = packageJsonBoilerplate;

    packageVersionBoilerplateNamespaced = versionNamespaceSafe(
      versionBoilerplate
    );

    console.log(
      // bump wpdtrt-foo to 0.1.2 and wpdtrt-plugin-boilerplate 1.2.3 using package.json
      `      Bump ${nameRoot} to ${versionRoot} `
            + `and ${nameBoilerplate} ${versionBoilerplate} using package.json`
    );

    versionGeneratedPluginSrc(
      inputPathRoot,
      outputPathRoot,
      packageJsonRoot,
      packageVersionBoilerplateNamespaced
    );

    versionGeneratedPluginGulpfile(
      inputPathRoot,
      outputPathRoot,
      packageJsonRoot
    );

    versionReadmeGeneratedPlugin(
      inputPathRoot,
      outputPathRoot,
      packageJsonRoot
    );

    versionRootGeneratedPlugin(
      inputPathRoot,
      outputPathRoot,
      packageJsonRoot
    );

    versionNaturalDocsGeneratedPlugin(
      inputPathRoot,
      outputPathRoot,
      packageJsonRoot
    );
  }
};

// Export the plugin main function
module.exports = wpdtrtPluginBump;
