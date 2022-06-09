#!/usr/bin/env node
const pkg = require('../package.json')
require('./dlt')

/* eslint-disable no-unused-expressions */
require('yargs')
  .help('help', '显示帮助')
  .alias('help', 'h')
  .version('version', '显示版本号', pkg.version)
  .alias('version', 'v')
  .epilog(`Copyright (c) ${new Date().getFullYear()}`).argv
