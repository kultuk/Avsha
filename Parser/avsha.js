var TokenStream = require('./TokenStream.js');
var InputStream = require('./InputStream.js');
var parse = require('./parser.js');
var Environment = require('./Environment.js');
var evaluate = require('./evaluator.js');
/* -----[ entry point for NodeJS ]----- */

var globalEnv = new Environment();

globalEnv.def("תזמן", function(func){
    try {
        console.time("תזמן");
        return func();
    } finally {
        console.timeEnd("תזמן");
    }
});

if (typeof process != "undefined") (function(){
    var util = require("util");
    // globalEnv.def("הדפס_לבד", function(val){
    //     util.puts(val);
    // });
    globalEnv.def("הדפס", function(val){
        // throw 'mmm'
        console.log(val);
    });
    process.stdin.setEncoding("utf16le");
    var code = process.argv[2];
    // process.stdin.on("readable", function(){
    //     var chunk = process.stdin.read();
    //     if (chunk) code += chunk;
    // });
    // process.stdin.on("end", function(){
    
    // console.log(code);
    var ast = parse(TokenStream(InputStream(code)));
    var output = evaluate(ast, globalEnv);
    // console.log(output);
    // console.log(globalEnv);
    // });
})();