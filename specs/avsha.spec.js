const test = require('tape');
const avsha = require('../Parser/avsha');
test('Should have a method called eval', (t) => {
  t.equal(typeof avsha.eval, 'function');
  t.end();
});


test('Math: basic addition', (t) => {
  var calc = avsha.eval("1+8");
  // console.log(calc);
  t.equal(calc, 9);
  t.end();
});

test('Math: basic subtraction', (t) => {
  var calc = avsha.eval("1-8");
  // console.log(calc);
  t.equal(calc, -7);
  t.end();
});

test('Math: basic multiplication', (t) => {
  var calc = avsha.eval("5*6");
  // console.log(calc);
  t.equal(calc, 30);
  t.end();
});

test('Math: basic divition', (t) => {
  var calc = avsha.eval("77/7");
  // console.log(calc);
  t.equal(calc, 11);
  t.end();
});

test('Variables: int assertion', (t) => {
  var calc = avsha.eval("א = 6;\n א;");
  // console.log(calc);
  t.equal(calc, 6);
  t.end();
});

test('Variables: string assertion', (t) => {
  var calc = avsha.eval('א = "חיבוק";\n א;');
  // console.log(calc);
  t.equal(calc, "חיבוק");
  t.end();
});

test('Variables: string concat', (t) => {
  var calc = avsha.eval('"שלום" + "עולם"');
  // console.log(calc);
  t.equal(calc, "שלוםעולם");
  t.end();
});

test('Conditions: if true', (t) => {
  var calc = avsha.eval("א = 6;\n אם(א==6){א=7}; \n א;");
  // console.log(calc);
  t.equal(calc, 7);
  t.end();
});

test('Conditions: if false', (t) => {
  var calc = avsha.eval("א = 6;\n אם(א==8){א=7}; \n א;");
  // console.log(calc);
  t.equal(calc, 6);
  t.end();
});

test('Conditions: else true', (t) => {
  var calc = avsha.eval("א = 6;\n אם(א==8){א=7;}אחרת{א=99;}; \n א;");
  // console.log(calc);
  t.equal(calc, 99);
  t.end();
});

test('Conditions: else false', (t) => {
  var calc = avsha.eval("א = 6;\n אם(א==8){א=7;}אחרת אם(א==8){א=99;}; \n א;");
  // console.log(calc);
  t.equal(calc, 6);
  t.end();
});

test('Functions: return value', (t) => {
  var calc = avsha.eval("פעולה חיבור(ראשון,שני){ראשון+שני};\nחיבור(2,4);");
  // console.log(calc);
  t.equal(calc, 6);
  t.end();
});
test('Site: check examples', (t) => {
  const fs = require("fs");
  fs.readFile('./test files/sitecodeexamples.avsha', 'utf8', function(err, code) {
    if (err) throw err;
    const output = avsha.eval(code);
    t.equal(output, 4);
    t.end();
  });

  
});
