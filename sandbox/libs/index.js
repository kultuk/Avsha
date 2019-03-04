(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function Environment(parent) {
    this.vars = Object.create(parent ? parent.vars : null);
    this.parent = parent;
}
Environment.prototype = {
    extend: function() {
        return new Environment(this);
    },
    lookup: function(name) {
        var scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name))
                return scope;
            scope = scope.parent;
        }
    },
    get: function(name) {
        if (name in this.vars){
            return this.vars[name];
        }
        throw new Error("Undeclared Variable: " + name);
        // throw new Error("משתנה לא מוגדר: " + name);
    },
    set: function(name, value) {
        var scope = this.lookup(name);
        if (!scope && this.parent){   
            throw new Error("Undeclared Variable: " + name);
            // throw new Error("משתנה לא מוגדר: " + name);
        }
        return (scope || this).vars[name] = value;
    },
    def: function(name, value) {
        return this.vars[name] = value;
    }
};
module.exports = Environment;
},{}],2:[function(require,module,exports){
function InputStream(input) {
    var pos = 0, line = 1, col = 0;
    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : croak,
    };
    function next() {
        var ch = input.charAt(pos++);
        if (ch == "\n") line++, col = 0; else col++;
        return ch;
    }
    function peek() {
        return input.charAt(pos);
    }
    function eof() {
        return peek() == "";
    }
    function croak(msg) {
        console.log("line: " + line + ",  col:" + col)
        throw new Error(msg + " (" + line + ":" + col + ")");
    }
}
module.exports = InputStream;
},{}],3:[function(require,module,exports){
function TokenStream(input) {
    var current = null;
    var keywords = ["אם", "אז", "אחרת", "מבצע", "אמת", "שקר",  "עבור", "כלעוד", "מש"];
    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : input.croak
    };
    function is_keyword(x) {
        return keywords.indexOf(x) >= 0;
    }
    function is_digit(ch) {
        return /[0-9]/i.test(ch);
    }
    function is_id_start(ch) {
        // return /מש/i.test(ch);
        return /[א-ת]/i.test(ch);
    }
    function is_id(ch) {
        // return is_id_start(ch) || /[א-ת]/i.test(ch);
        return /[א-ת]/i.test(ch);
    }
    function is_op_char(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    }
    function is_punc(ch) {
        return ".,;(){}[]".indexOf(ch) >= 0;
    }
    function is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }
    function read_while(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    }
    function read_number() {
        var has_dot = false;
        var number = read_while(function(ch){
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }
            return is_digit(ch);
        });
        return { type: "num", value: parseFloat(number) };
    }
    function read_ident() {
        var id = read_while(is_id);
        return {
            type  : is_keyword(id) ? "kw" : "var",
            value : id
        };
    }
    function read_escaped(end) {
        var escaped = false, str = "";
        input.next();
        while (!input.eof()) {
            var ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }
    function read_string() {
        return { type: "str", value: read_escaped('"') };
    }
    function skip_comment() {
        read_while(function(ch){ return ch != "\n" });
        input.next();
    }
    function read_next() {
        read_while(is_whitespace);
        if (input.eof()) return null;
        var ch = input.peek();
        if (ch == "#") {
            skip_comment();
            return read_next();
        }
        if (ch == '"') return read_string();
        if (is_digit(ch)) return read_number();
        if (is_id_start(ch)) return read_ident();
        if (is_punc(ch)) return {
            type  : "punc",
            value : input.next()
        };
        if (is_op_char(ch)) return {
            type  : "op",
            value : read_while(is_op_char)
        };
        input.croak("never heard of : " + ch);
    }
    function peek() {
        return current || (current = read_next());
    }
    function next() {
        var tok = current;
        current = null;
        return tok || read_next();
    }
    function eof() {
        return peek() == null;
    }
}
module.exports = TokenStream;

},{}],4:[function(require,module,exports){
const Environment = require('./Environment.js');
const TokenStream = require('./TokenStream.js');
const InputStream = require('./InputStream.js');
const evaluate = require('./evaluator.js');
const parse = require('./parser.js');

const createEnv = function(){
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

const evalStr = function(code){
  const env = createEnv();
  const ast = parse(TokenStream(InputStream(code)));
  return evaluate(ast, env);
};

// evalStr('הדפס("טוק טוק")')
module.exports = { eval: evalStr };

},{"./Environment.js":1,"./InputStream.js":2,"./TokenStream.js":3,"./evaluator.js":5,"./parser.js":6}],5:[function(require,module,exports){
function evaluate(exp, env) {
    switch (exp.type) {
      case "num":
      case "str":
      case "bool":
        return exp.value;

      case "var":
        return env.get(exp.value);

      case "assign":
        if (exp.left.type != "var")
            throw new Error("לא יכול להכיל ערך ל" + JSON.stringify(exp.left));
        return env.set(exp.left.value, evaluate(exp.right, env));

      case "binary":
        return apply_op(exp.operator,
                        evaluate(exp.left, env),
                        evaluate(exp.right, env));

      case "method":
        return make_method(env, exp);

      case "if":
        var cond = evaluate(exp.cond, env);
        if (cond !== false) return evaluate(exp.then, env);
        return exp.else ? evaluate(exp.else, env) : false;

      case "prog":
        var val = false;
        exp.prog.forEach(function(exp){ val = evaluate(exp, env) });
        return val;

      case "call":
        var func = evaluate(exp.func, env);
        return func.apply(null, exp.args.map(function(arg){
            return evaluate(arg, env);
        }));

      default:
        throw new Error("can't evaluate: " + exp.type);
    }
}

function apply_op(op, a, b) {
    function num(x) {
        if (typeof x != "number")
            throw new Error("מצפה למספר אבל קיבלתי " + x);
        return x;
    }
    function div(x) {
        if (num(x) == 0)
            throw new Error("אסור לחלק באפס");
        return x;
    }
    switch (op) {
      case "+": return num(a) + num(b);
      case "-": return num(a) - num(b);
      case "*": return num(a) * num(b);
      case "/": return num(a) / div(b);
      case "%": return num(a) % div(b);
      case "&&": return a !== false && b;
      case "||": return a !== false ? a : b;
      case "<": return num(a) < num(b);
      case ">": return num(a) > num(b);
      case "<=": return num(a) <= num(b);
      case ">=": return num(a) >= num(b);
      case "==": return a === b;
      case "!=": return a !== b;
    }
    throw new Error("לא מכיר את הסימן " + op);
}

function make_method(env, exp) {
    function method() {
        var names = exp.vars;
        var scope = env.extend();
        for (var i = 0; i < names.length; ++i)
            scope.def(names[i], i < arguments.length ? arguments[i] : false);
        return evaluate(exp.body, scope);
    }
    return method;
}
module.exports = evaluate;
},{}],6:[function(require,module,exports){
var FALSE = { type: "bool", value: false };
function parse(input) {
    var PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20,
    };
    return parse_toplevel();
    function is_punc(ch) {
        var tok = input.peek();
        return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
    }
    function is_kw(kw) {
        var tok = input.peek();
        return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
    }
    function is_op(op) {
        var tok = input.peek();
        return tok && tok.type == "op" && (!op || tok.value == op) && tok;
    }
    function skip_punc(ch) {
        if (is_punc(ch)) input.next();
        else input.croak("expecting : \"" + ch + "\"");
    }
    function skip_kw(kw) {
        if (is_kw(kw)) input.next();
        else input.croak("מצפה למילה: \"" + kw + "\"");
    }
    function skip_op(op) {
        if (is_op(op)) input.next();
        else input.croak("מצפה לסימן: \"" + op + "\"");
    }
    function unexpected() {
        input.croak("חלק לא מובן: " + JSON.stringify(input.peek()));
    }
    function maybe_binary(left, my_prec) {
        var tok = is_op();
        if (tok) {
            var his_prec = PRECEDENCE[tok.value];
            if (his_prec > my_prec) {
                input.next();
                return maybe_binary({
                    type     : tok.value == "=" ? "assign" : "binary",
                    operator : tok.value,
                    left     : left,
                    right    : maybe_binary(parse_atom(), his_prec)
                }, my_prec);
            }
        }
        return left;
    }
    function delimited(start, stop, separator, parser) {
        var a = [], first = true;
        skip_punc(start);
        while (!input.eof()) {
            if (is_punc(stop)) break;
            if (first) first = false; else skip_punc(separator);
            if (is_punc(stop)) break;
            a.push(parser());
        }
        skip_punc(stop);
        return a;
    }
    function parse_call(func) {
        return {
            type: "call",
            func: func,
            args: delimited("(", ")", ",", parse_expression),
        };
    }
    function parse_varname() {
        var name = input.next();
        if (name.type != "var") input.croak("מצפה לשם משתנה");
        return name.value;
    }
    function parse_if() {
        skip_kw("אם");
        var cond = parse_expression();
        // if (!is_punc("{")) skip_kw("");
        var then = parse_expression();
        var ret = {
            type: "if",
            cond: cond,
            then: then,
        };
        if (is_kw("אז")) {
            input.next();
            ret.else = parse_expression();
        }
        return ret;
    }
    function parse_while() {
        skip_kw("כלעוד");
        
        var cond = parse_expression();
        if (!is_punc("{")) skip_kw("אז");
        var body = parse_expression();
        var ret = {
            type: "for",
            cond: cond,
            body: body,
        };
        return ret;
    }
    function parse_method() {
        return {
            type: "method",
            vars: delimited("(", ")", ",", parse_varname),
            body: parse_expression()
        };
    }
    function parse_bool() {
        return {
            type  : "bool",
            value : input.next().value == "אמת"
        };
    }
    function maybe_call(expr) {
        expr = expr();
        return is_punc("(") ? parse_call(expr) : expr;
    }
    function parse_atom() {
        return maybe_call(function(){
            if (is_punc("(")) {
                input.next();
                var exp = parse_expression();
                skip_punc(")");
                return exp;
            }
            if (is_punc("{")) return parse_prog();
            if (is_kw("אם")) return parse_if();
            if (is_kw("אמת") || is_kw("שקר")) return parse_bool();
            if (is_kw("מבצע")) {
                input.next();
                return parse_method();
            }
            var tok = input.next();
            if (tok.type == "var" || tok.type == "num" || tok.type == "str")
                return tok;
            unexpected();
        });
    }
    function parse_toplevel() {
        var prog = [];
        while (!input.eof()) {
            prog.push(parse_expression());
            if (!input.eof()) skip_punc(";");
        }
        return { type: "prog", prog: prog };
    }
    function parse_prog() {
        var prog = delimited("{", "}", ";", parse_expression);
        if (prog.length == 0) return FALSE;
        if (prog.length == 1) return prog[0];
        return { type: "prog", prog: prog };
    }
    function parse_expression() {
        return maybe_call(function(){
            return maybe_binary(parse_atom(), 0);
        });
    }
}
module.exports = parse;
},{}],7:[function(require,module,exports){
var avsha = require('../../parser/avsha.js');
var cmEditor;
// function startEditor(){
// 	cmEditor = CodeMirror(window.rtlEditor, 
// 		{ 
//             value: 'בב = 3.\nגג = 4.',
// 			direction: "rtl",
// 			rtlMoveVisually: true,
// 			theme: 'blackboard',
//             lineNumbers: true
// 		});
// }
var terminal = new acTerminal(".results", true);
// setTimeout(startEditor,500);
window.runCode.addEventListener('click',function (event){
	terminal.clear();
	try{
		var output = avsha.eval(cmEditor ? cmEditor.getValue() : window.cmEditor.value);
    	output && terminal.addLine(output);
	}catch(error){
    	terminal.addError(error.message);
	}
});

},{"../../parser/avsha.js":4}]},{},[7]);
