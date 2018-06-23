const Environment = require('./Environment.js');
const TokenStream = require('./TokenStream.js');
const InputStream = require('./InputStream.js');
const evaluate = require('./evaluator.js');
const parse = require('./parser.js');

const createEnv = () => {
  const env = new Environment();

  env.def('תזמן', function(func) {
    try {
      console.time('תזמן');
      return func();
    } finally {
      console.timeEnd('תזמן');
    }
  });

  env.def('הדפס', console.log);
  return env;
};

const evalStr = code => {
  const env = createEnv();
  const ast = parse(TokenStream(InputStream(code)));
  return evaluate(ast, env);
};

module.exports = { eval: evalStr };
