#!/usr/bin/env node

const program = require('commander');
const { load } = require('../index');

program
  .version('0.1.0')
  .arguments('<url>')
  .description('web pages downloader')
  .option('-o, --output [type]', 'destination', '/tmp')
  .action((url) => {
    load(url, program.output)
      .catch((err) => {
        console.error(err.message);
        process.exit(1);
      });
  });
program.parse(process.argv);
