#! /usr/bin/env node

const avsha = require('./avsha');

process.stdin.setEncoding("utf16le");

const code = process.argv[2] || '';
const output = avsha.eval(code);
console.log(output);