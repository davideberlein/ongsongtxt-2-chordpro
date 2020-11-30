#!/usr/bin/env node

const yargs = require('yargs');
const onsongTxt2Chordpro = require('./onsongtxt2chordpro');


const argv = yargs
    .usage('Usage: $0 onsongtxt2chordpro [options]')
    .option('input', {
        alias: 'i',
        description: 'Input directory to look for *.txt files',
        default: `./src`,
        type: 'path',
    })
    .option('output', {
        alias: 'o',
        description: 'Output directory to to save thr *.chordpro files to',
        default: `./build`,
        type: 'path',
    })
    .help()
    .alias('help', 'h')
    .argv;

// Prepare args
let input = String(argv.input);
if (input.endsWith('/'))
    input = input.substring(0, input.length - 1)

let output = String(argv.output);
if (output.endsWith('/'))
    output = output.substring(0, output.length - 1)


// Convert files
onsongTxt2Chordpro(argv.input, argv.output);