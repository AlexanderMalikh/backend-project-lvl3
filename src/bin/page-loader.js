#!/usr/bin/env node
import load from '..';

const program = require('commander');

program
  .version('0.1.0')
  .arguments('<url>')
  .description('web pages downloader')
  .option('-o, --output [type]', 'destination', '/tmp')
  .action((url) => {
    load(url, program.output);
  });
program.parse(process.argv);
