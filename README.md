# gulp-wpdtrt-plugin-bump

[![GitHub release](https://img.shields.io/github/release/dotherightthing/gulp-wpdtrt-plugin-bump.svg?branch=master)](https://github.com/dotherightthing/gulp-wpdtrt-plugin-bump/releases) [![Build Status](https://travis-ci.org/dotherightthing/gulp-wpdtrt-plugin-bump.svg?branch=master)](https://travis-ci.org/dotherightthing/gulp-wpdtrt-plugin-bump) [![GitHub issues](https://img.shields.io/github/issues/dotherightthing/gulp-wpdtrt-plugin-bump.svg)](https://github.com/dotherightthing/gulp-wpdtrt-plugin-bump/issues)

Updates a fixed selection of files in either [dotherightthing/wpdtrt-plugin-boilerplate](https://github.com/dotherightthing/wpdtrt-plugin-boilerplate/), or a [generated child](https://github.com/dotherightthing/generator-wp-plugin-boilerplate), using the version information in `package.json`.

## Installation

```
yarn add https://github.com/dotherightthing/gulp-wpdtrt-plugin-bump --dev
```

## Usage

As used in [wpdtrt-plugin-boilerplate's gulpfile.js](https://github.com/dotherightthing/wpdtrt-plugin-boilerplate/blob/master/gulpfile.js):

```
var wpdtrtPluginBump = require('gulp-wpdtrt-plugin-bump');

var pluginName = process.cwd().split("/").pop();

gulp.task("bump_replace", function () {

    "use strict";

    taskheader(
        "Version",
        "Bump",
        "Replace version strings"
    );

    // if run from wpdtrt-plugin-boilerplate:
    // gulp bump
    var root_input_path = "";
    var wpdtrt_plugin_boilerplate_input_path = "";

    // if run from a child plugin:
    // gulp bump
    // --gulpfile ./vendor/dotherightthing/wpdtrt-plugin-boilerplate/gulpfile.js --cwd ./
    if (pluginName !== "wpdtrt-plugin-boilerplate") {
        root_input_path = "";
        wpdtrt_plugin_boilerplate_input_path = "vendor/dotherightthing/wpdtrt-plugin-boilerplate/";
    }

    return wpdtrtPluginBump({
        root_input_path: root_input_path,
        wpdtrt_plugin_boilerplate_input_path: wpdtrt_plugin_boilerplate_input_path
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