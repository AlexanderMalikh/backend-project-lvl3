#!/usr/bin/env node
const program = require('commander');
const { load } = require('../index');

program
  .version('0.1.0')
  .arguments('<url>')
  .description('web pages downloader')
  .option('-o, --output [type]', 'destination', '/tmp')
  .action((url) => {
    load(url, program.output);
  });
program.parse(process.argv);
