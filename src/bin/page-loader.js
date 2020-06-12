#!/usr/bin/env node

import program from 'commander';
import load from '../index.js';

program
  .version('0.1.0')
  .arguments('<url>')
  .description('web pages downloader')
  .option('-o, --output [type]', 'destination', './')
  .action((url) => {
    load(url, program.output)
      .catch((err) => {
        console.error(err.message);
        process.exit(1);
      });
  });
program.parse(process.argv);
