# DTRT WordPress Plugin Boilerplate Utility: Bump

[![GitHub release](https://img.shields.io/github/release/dotherightthing/gulp-wpdtrt-plugin-bump.svg?branch=master)](https://github.com/dotherightthing/gulp-wpdtrt-plugin-bump/releases) [![Build Status](https://travis-ci.org/dotherightthing/gulp-wpdtrt-plugin-bump.svg?branch=master)](https://travis-ci.org/dotherightthing/gulp-wpdtrt-plugin-bump) [![GitHub issues](https://img.shields.io/github/issues/dotherightthing/gulp-wpdtrt-plugin-bump.svg)](https://github.com/dotherightthing/gulp-wpdtrt-plugin-bump/issues) [![GitHub wiki](https://img.shields.io/badge/documentation-wiki-lightgrey.svg)](https://github.com/dotherightthing/wpdtrt-plugin-boilerplate/wiki)

A Gulp utility to update a fixed selection of files in either the [DTRT WordPress Plugin Boilerplate](https://github.com/dotherightthing/wpdtrt-plugin-boilerplate/), or a child generated with the [DTRT WordPress Plugin Boilerplate Generator](https://github.com/dotherightthing/generator-wp-plugin-boilerplate), using the version information in `package.json`.

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

## Maintenance

### Pre-requisites

1. Download and install [Mono](https://www.mono-project.com/download/stable/), which is required by *Natural Docs*.

### Scripts

1. `yarn install` - Install Yarn dependencies, then run the following scripts:
1. `yarn run dependencies` - Install documentation dependencies
1. `yarn run lint` - Run code linting
1. `yarn run test` - Run unit tests
1. `yarn run docs` - Generate documentation to <docs/>
1. `yarn run optimise` - Optimise files

### Release

Prior to committing, please update the version number in the following files:

1. `./package.json`
1. `./config/naturaldocs/Project.txt`
