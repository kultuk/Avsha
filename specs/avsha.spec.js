const test = require('tape');
const avsha = require('../Parser/avsha');

test('Should have a method called eval', (t) => {
  t.is(typeof avsha.eval === 'function');
  t.end();
});
