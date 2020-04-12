/**
 * File: gulpfile.js
 * Topic: DTRT WordPress Plugin Bump
 *
 * Gulp build tasks.
 *
 * See package.json for scripts, which can be run with:
 * --- Text
 * npm run scriptname
 * ---
 */

const gulp = require( 'gulp' );
const color = require( 'gulp-color' );
const download = require( 'gulp-download' );
const eslint = require( 'gulp-eslint' );
const log = require( 'fancy-log' );
const print = require( 'gulp-print' ).default;
const runSequence = require( 'run-sequence' );
const shell = require( 'gulp-shell' );
const svgo = require( 'gulp-svgo' );
const unzip = require( 'gulp-unzip' );
const zip = require( 'gulp-zip' );

const distDir = process.cwd().split( '/' ).pop();

// Input files.
const jsFilesToLint = [
  'gulpfile.js',
  'index.js',
  'test/tests.js',
  // eslint-plugin-json
  'package.json',
  // eslint-plugin-markdown
  'README.md'
];
const svgFiles = 'readme-styles/icons/*.svg';

/**
 * Function: hasTravisTag
 *
 * Determines whether the commit is tagged
 *
 * See: <Default Environment Variables: https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables>.
 *
 * Returns:
 *   (boolean)
 */
function hasTravisTag() {
  return ( process.env.TRAVIS_TAG !== '' );
}

/**
 * Function: isTravis
 *
 * Determines whether the current Gulp process is running on Travis CI.
 *
 * See: <Default Environment Variables: https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables>.
 *
 * Returns:
 *   (boolean)
 */
function isTravis() {
  return ( typeof process.env.TRAVIS !== 'undefined' );
}

/**
 * Function: decorateLog
 *
 * Log a Gulp task result with emoji and colour.
 *
 * Parameters:
 *   (object) filePath, messageCount, warningCount, errorCount
 */
function decorateLog( {
  textstring = '',
  messageCount = 0,
  warningCount = 0,
  errorCount = 0
} = {} ) {
  const colors = {
    pass: 'GREEN', message: 'WHITE', warning: 'YELLOW', error: 'RED'
  };
  const emojis = {
    pass: '✔', message: '✖', warning: '✖', error: '✖'
  };
  let state;

  if ( errorCount > 0 ) {
    state = 'error';
  } else if ( warningCount > 0 ) {
    state = 'warning';
  } else if ( messageCount > 0 ) {
    state = 'message';
  } else {
    state = 'pass';
  }

  console.log( color( `${emojis[ state ]} ${textstring}`, `${colors[ state ]}` ) );
}

/**
 * Function: taskHeader
 *
 * Displays a block comment for each task that runs.
 *
 * Parameters:
 *   (string) step - Step number
 *   (string) taskCategory - Task category
 *   (string) taskAction - Task action
 *   (string) taskDetail - Task detail
 *
 * Returns:
 *   (string) Task header
 */
function taskHeader(
  step = '0',
  taskCategory = '',
  taskAction = '',
  taskDetail = ''
) {
  log( ' ' );
  log( '========================================' );
  log( `${step} - ${taskCategory}:` );
  log( `=> ${taskAction}: ${taskDetail}` );
  log( '----------------------------------------' );
  log( ' ' );
}

const dummyFile = 'README.md';

/**
 * Namespace: gulp
 *
 * Gulp tasks.
 */

/**
 * About: runSequenceCallback
 *
 * Tells runSequence that a task has finished..
 *
 * By returning a stream,
 * the task system is able to plan the execution of those streams.
 * But sometimes, especially when you're in callback hell
 * or calling some streamless plugin,
 * you aren't able to return a stream.
 * That's what the callback is for.
 * To let the task system know that you're finished
 * and to move on to the next call in the execution chain.
 *
 * See <Where is the gulp task callback function defined?: https://stackoverflow.com/a/29299107/6850747>
 */

/**
 * Method: dependencies
 *
 * Tasks which install dependencies.
 *
 * Parameters:
 *   callback - The runSequenceCallback that handles the response
 *
 * Example:
 * --- Text
 * npm run dependencies
 * ---
 */
gulp.task( 'dependencies', ( callback ) => {
  taskHeader(
    '1',
    'Dependencies',
    'Install'
  );

  runSequence(
    'dependenciesDocs',
    callback
  );
} );

/**
 * Function: dependenciesDocs
 *
 * Install documentation dependencies.
 *
 * Natural Docs can't be installed via NPM
 * as the Github release needs to be compiled,
 * and the download archive on the website
 * is in .zip rather than .tar format.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task( 'dependenciesDocs', () => {
  taskHeader(
    '1a',
    'Dependencies',
    'Install',
    'Docs'
  );

  const url = 'https://naturaldocs.org/download/natural_docs/'
    + '2.0.2/Natural_Docs_2.0.2.zip';

  // return stream or promise for run-sequence
  return download( url )
    .pipe( unzip() )
    .pipe( gulp.dest( './' ) );
} );

/**
 * Function: lint
 *
 * Lint files.
 *
 * Parameters:
 *   callback - The runSequenceCallback that handles the response
 *
 * Example:
 * --- Text
 * npm run lint
 * ---
 */
gulp.task( 'lint', ( callback ) => {
  taskHeader(
    '2',
    'QA',
    'Lint'
  );

  runSequence(
    'lintJS',
    callback
  );
} );

/**
 * Function: lintJS
 *
 * Lint JavaScript files.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task( 'lintJS', () => {
  taskHeader(
    '2a',
    'QA',
    'Lint',
    'JS'
  );

  const files = jsFilesToLint;

  // return stream or promise for run-sequence
  return gulp.src( files )
    .pipe( eslint() )
    .pipe( eslint.result( result => {
      const {
        filePath: textstring, messages, warningCount, errorCount
      } = result;
      const { length: messageCount } = messages;

      decorateLog( {
        textstring,
        messageCount,
        warningCount,
        errorCount
      } );
    } ) )
    .pipe( eslint.format() );
  // .pipe(eslint.failAfterError());
} );

/**
 * Function: tests
 *
 * Run mocha unit tests.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 *
 * Example:
 * --- Text
 * npm run tests
 * ---
 */
gulp.task( 'tests', () => {
  taskHeader(
    '3',
    'Documentation',
    'Run tests',
    'Mocha'
  );

  // note: src files are not used,
  // this structure is only used
  // to include the preceding log()
  return gulp.src( dummyFile, { read: false } )
    .pipe( shell( [
      'mocha'
    ] ) );
} );

/**
 * Function: docs
 *
 * Generate JS & PHP documentation.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 *
 * Example:
 * --- Text
 * npm run docs
 * ---
 */
gulp.task( 'docs', ( callback ) => {
  taskHeader(
    '4',
    'Documentation',
    'Generate',
    'All (PHP & JavaScript)'
  );

  // Quotes escape space better than backslash on Travis
  const naturalDocsPath = 'Natural Docs/NaturalDocs.exe';

  // CI does not install mono unless the release is tagged
  if ( hasTravisTag() ) {
    // note: src files are not used,
    // this structure is only used
    // to include the preceding log()
    return gulp.src( dummyFile, { read: false } )
      .pipe( shell( [
        `mono "${naturalDocsPath}" ./config/naturaldocs`
      ] ) );
  }

  return callback();
} );

/**
 * Function: images
 *
 * Reduce file size of input.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 *
 * Example:
 * --- Text
 * npm run images
 * ---
 */
gulp.task( 'images', () => {
  taskHeader(
    '5',
    'Images',
    'SVG'
  );

  // compress to same folder
  return gulp.src( svgFiles )
    .pipe( svgo() )
    .pipe( gulp.dest( 'readme-styles/icons/optimised' ) );
} );

/**
 * Method: release
 *
 * Tasks which package a release.
 *
 * Parameters:
 *   callback - The runSequenceCallback that handles the response
 *
 * Example:
 * --- Text
 * npm run release
 * ---
 */
gulp.task( 'release', ( callback ) => {
  const travis = isTravis();

  if ( travis ) {
    taskHeader(
      '6',
      'Release',
      'Generate'
    );

    runSequence(
      'releaseNpmDist',
      'releaseCopy',
      'releaseZip',
      callback
    );
  } else {
    callback();
  }
} );

/**
 * Method: releaseNpmDist
 *
 * Uninstall Npm development dependencies.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task( 'releaseNpmDist', () => {
  taskHeader(
    '6a',
    'Release',
    'Uninstall dev dependencies',
    'Npm'
  );

  // return stream or promise for run-sequence
  return gulp.src( dummyFile, { read: false } )
    .pipe( shell( [
      'npm ci --production'
    ] ) );
} );

/**
 * Method: releaseCopy
 *
 * Copy release files to a temporary folder
 *
 * See: <globtester: http://www.globtester.com/>
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task( 'releaseCopy', () => {
  taskHeader(
    '6b',
    'Release',
    'Copy files',
    'To temporary folder'
  );

  // Release files are those that are required
  // to use the package as a WP Plugin
  const releaseFiles = [
    'docs/**/*',
    'readme-styles/**/*',
    'index.js',
    'README.md'
  ];

  // return stream or promise for run-sequence
  // https://stackoverflow.com/a/32188928/6850747
  return gulp.src( releaseFiles, { base: '.' } )
    .pipe( print() ) // eslint-disable-line no-restricted-globals
    .pipe( gulp.dest( distDir ) );
} );

/**
 * Method: releaseZip
 *
 * Generate release.zip for deployment by Travis/Github.
 *
 * Returns:
 *   Stream or promise for run-sequence.
 */
gulp.task( 'releaseZip', () => {
  taskHeader(
    '6c',
    'Release',
    'Generate',
    'ZIP file'
  );

  // return stream or promise for run-sequence
  // https://stackoverflow.com/a/32188928/6850747
  return gulp.src( [
    `./${distDir}/**/*`
  ], { base: '.' } )
    .pipe( zip( 'release.zip' ) )
    .pipe( gulp.dest( './' ) );
} );

/**
 * Function: default
 *
 * Default task
 *
 * Parameters:
 *   callback - The callback that handles the response
 *
 * Example:
 * --- Text
 * gulp
 * ---
 */
gulp.task( 'default', ( callback ) => {
  const travis = isTravis();

  taskHeader(
    '0',
    'Installation',
    'Gulp',
    `Install${ travis ? ' and package for release' : ''}`
  );

  runSequence(
    // 1
    'dependencies',
    // 2
    'lint',
    // 3
    'tests',
    // 4
    'docs',
    // 5
    'images',
    // 6
    'release'
  );

  callback();
} );
