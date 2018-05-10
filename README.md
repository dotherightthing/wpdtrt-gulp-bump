# gulp-wpdtrt-plugin-bump

[![GitHub release](https://img.shields.io/github/release/dotherightthing/gulp-wpdtrt-plugin-bump.svg?branch=master)](https://github.com/dotherightthing/gulp-wpdtrt-plugin-bump/releases) [![Build Status](https://travis-ci.org/dotherightthing/gulp-wpdtrt-plugin-bump.svg?branch=master)](https://travis-ci.org/dotherightthing/gulp-wpdtrt-plugin-bump) [![GitHub issues](https://img.shields.io/github/issues/dotherightthing/gulp-wpdtrt-plugin-bump.svg)](https://github.com/dotherightthing/gulp-wpdtrt-plugin-bump/issues)

Updates the version of [dotherightthing/wpdtrt-plugin](https://github.com/dotherightthing/wpdtrt-plugin/) and any [generated children](https://github.com/dotherightthing/generator-wp-plugin-boilerplate), using the version information in `package.json`.

## Installation

```
yarn add https://github.com/dotherightthing/gulp-wpdtrt-plugin-bump
```

## Usage

As used in [wpdtrt-plugin's gulpfile.js](https://github.com/dotherightthing/wpdtrt-plugin/blob/master/gulpfile.js):

```
var wpdtrtPluginBump = require('gulp-wpdtrt-plugin-bump');

function moduleIsAvailable(path) {
    try {
       require.resolve(path);
        return true;
    } catch (e) {
        return false;
    }
}

gulp.task('bump_replace', function() {

    // if run from wpdtrt-plugin:
    // gulp bump
    var wpdtrt_plugin_input_path = '',
        wpdtrt_plugin_output_path = '',
        wpdtrt_plugin_package = process.cwd() + '/' + wpdtrt_plugin_input_path + 'package.json',
        root_input_path = wpdtrt_plugin_input_path,
        root_output_path = wpdtrt_plugin_output_path,
        root_package = wpdtrt_plugin_package;

    // if run from a child plugin:
    // gulp bump --gulpfile ./vendor/dotherightthing/wpdtrt-plugin/gulpfile.js --cwd ./
    if ( moduleIsAvailable( '../../../package.json' ) ) {
        root_input_path = '../../../';
        root_output_path = '../../../';
        root_package = root_input_path + 'package.json';
    }

    return wpdtrtPluginBump({
        wpdtrt_plugin_input_path: wpdtrt_plugin_input_path,
        wpdtrt_plugin_output_path: wpdtrt_plugin_output_path,
        wpdtrt_plugin_package: wpdtrt_plugin_package,
        root_input_path: root_input_path,
        root_output_path: root_output_path,
        root_package: root_package
    });
});
```

## Tests

```
// install test dependencies
yarn install

// run tests
yarn test
```