/**
 * File: test/index.js
 * Topic: DTRT WordPress Plugin Boilerplate
 *
 * Unit tests for wpdtrtPluginBump utility.
 * Written in Mocha, with Chai assertions.
 */

const gulp = require( 'gulp' );
const chai = require( 'chai' );
const fs = require( 'fs' );
const mocha = require( 'mocha' );

chai.use( require( 'chai-diff' ) );

// fix for "mocha is assigned a value but never used"
const before = mocha.before;
const describe = mocha.describe;
const expect = chai.expect;
const it = mocha.it;

// our plugin
const wpdtrtPluginBump = require( '../index.js' );

/**
 * Group: Test
 *
 * Copy a preset list of 'fixtures'
 * to a timestamped folder within tmp/,
 * version them there,
 * then compare them to the 'expected' files.
 */
describe( 'Test plugin', function () { // eslint-disable-line func-names
  // increase default timeout in case assert operations take too long
  // (i/o usage)
  // https://duske.me/simple-functional-tests-for-gulp-tasks/
  this.timeout( 4000 );

  const timestamp = new Date().getTime();
  const inputPathRoot = 'test/fixtures/wpdtrt-generated-plugin/';
  const outputPathRoot = `tmp/${timestamp}/wpdtrt-generated-plugin/`;
  const expectedPathRoot = 'test/expected/wpdtrt-generated-plugin/';
  const inputPathBoilerplate = 'test/fixtures/wpdtrt-plugin-boilerplate/';
  const outputPathBoilerplate = `tmp/${timestamp}/wpdtrt-plugin-boilerplate/`;
  const expectedPathBoilerplate = 'test/expected/wpdtrt-plugin-boilerplate/';
  const pluginFilesBoilerplate = [
    'composer.json',
    'config/naturaldocs/Project.txt',
    'gulpfile.js',
    'index.php',
    'src/Plugin.php',
    'src/Rewrite.php',
    'src/Shortcode.php',
    'src/Taxonomy.php',
    'src/TemplateLoader.php',
    'src/Widget.php',
    'tests/generated-plugin/readme.txt',
    'tests/generated-plugin/src/class-wpdtrt-test-plugin.php',
    'tests/generated-plugin/src/class-wpdtrt-test-rewrite.php',
    'tests/generated-plugin/src/class-wpdtrt-test-shortcode.php',
    'tests/generated-plugin/src/class-wpdtrt-test-taxonomy.php',
    'tests/generated-plugin/src/class-wpdtrt-test-widget.php',
    'tests/generated-plugin/wpdtrt-test.php'
  ];
  const pluginFilesGeneratedPlugin = [
    'config/naturaldocs/Project.txt',
    'readme.txt',
    'src/class-wpdtrt-generated-plugin-plugin.php',
    'src/class-wpdtrt-generated-plugin-rewrite.php',
    'src/class-wpdtrt-generated-plugin-shortcode.php',
    'src/class-wpdtrt-generated-plugin-taxonomy.php',
    'src/class-wpdtrt-generated-plugin-widget.php',
    'wpdtrt-generated-plugin.php'
  ];
  let callback = null;

  /**
   * Section: compareOutputWithExpected
   *
   * Copy a 'fixture'
   * to a timestamped folder within tmp/,
   * version it,
   * then compare it to the 'expected' file.
   *
   * Parameters:
   *   (string) filename
   *   (string) outputPath
   *   (string) expectedPath
   *   (boolean) done
   */
  function compareOutputWithExpected(
    filename, outputPath, expectedPath, done
  ) {
    // fs.readFile: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
    fs.readFile( `${outputPath}${filename}`, 'utf8', ( outputError, outputData ) => {
      if ( outputError ) {
        throw outputError;
      }

      fs.readFile( `${expectedPath}${filename}`, 'utf8', ( expectedError, expectedData ) => {
        if ( expectedError ) {
          throw expectedError;
        }

        const testing = '\n      '
          + `A) ${outputPath}${filename}\n`
          + '      '
          + `B) ${expectedPath}${filename}`;

        console.log( testing );

        expect( outputData ).not.differentFrom( expectedData );

        if ( done !== null ) {
          done();
        }
      } );
    } );
  }

  /**
   * Section: Test boilerplate as root
   */
  describe( 'Test boilerplate as root', () => {
    // Setup
    before( () => {
      // run plugin, to copy fixtures to transformed output
      gulp.task( 'wpdtrtPluginBumpBoilerplate', wpdtrtPluginBump( {
        inputPathBoilerplate,
        outputPathBoilerplate,
        inputPathRoot: inputPathBoilerplate,
        outputPathRoot: outputPathBoilerplate
      } ) );
    } );

    it( 'Plugin should run without error', ( done ) => {
      // pseudo-task
      gulp.task( 'test', [ 'wpdtrtPluginBumpBoilerplate' ], () => {
        done();
      } );
      gulp.start( 'test' );
    } );

    it( 'Files should be versioned correctly', ( done ) => {
      gulp.task( 'test', [ 'wpdtrtPluginBumpBoilerplate' ], () => {
        // wait for wpdtrtPluginBump to finish writing output to the file system
        setTimeout( () => {
          pluginFilesBoilerplate.forEach( ( file, i ) => {
            // only call done() after last file is checked
            if ( ( i + 1 ) === pluginFilesBoilerplate.length ) {
              callback = done;
            } else {
              callback = null;
            }

            compareOutputWithExpected(
              pluginFilesBoilerplate[ i ],
              outputPathBoilerplate,
              expectedPathBoilerplate,
              callback
            );
          } );
        }, 1000 );
      } );

      gulp.start( 'test' );
    } );
  } );

  /**
   * Section: Test generated plugin as root (with boilerplate as dependency)
   *
   * The generated plugin calls the Gulpfile provided by the boilerplate.
   */
  describe( 'Test generated plugin as root (with boilerplate as dependency)', () => {
    // Setup
    before( () => {
      // run plugin, to copy fixtures to transformed output
      gulp.task( 'wpdtrtPluginBumpGeneratedPlugin', wpdtrtPluginBump( {
        inputPathRoot,
        outputPathRoot,
        inputPathBoilerplate,
        outputPathBoilerplate
      } ) );
    } );

    it( 'Plugin should run without error', ( done ) => {
      // pseudo-task
      gulp.task( 'test', [ 'wpdtrtPluginBumpGeneratedPlugin' ], () => {
        done();
      } );
      gulp.start( 'test' );
    } );

    it( 'Files should be versioned correctly', ( done ) => {
      gulp.task( 'test', [ 'wpdtrtPluginBumpGeneratedPlugin' ], () => {
        // wait for wpdtrtPluginBump to finish writing output to the file system
        setTimeout( () => {
          pluginFilesGeneratedPlugin.forEach( ( file, i ) => {
            // only call done() after last file is checked
            if ( ( i + 1 ) === pluginFilesGeneratedPlugin.length ) {
              callback = done;
            } else {
              callback = null;
            }

            compareOutputWithExpected(
              pluginFilesGeneratedPlugin[ i ],
              outputPathRoot,
              expectedPathRoot,
              callback
            );
          } );
        }, 1000 );
      } );

      gulp.start( 'test' );
    } );
  } );
} );
