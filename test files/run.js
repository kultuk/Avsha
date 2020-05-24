#! /usr/bin/env node

const avsha = require('../Parser/avsha');
var fs = require('fs');

fs.readFile('./test files/code.avsha', 'utf8', function(err, code) {
    if (err) throw err;
    console.log("code: \n");
    console.log(code);
    const output = avsha.eval(code);
    console.log("output :\n");
    console.log(output);
});
