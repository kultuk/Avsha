var avsha = require('../../parser/avsha.js');
var cmEditor;
function startEditor(){
	cmEditor = CodeMirror(window.rtlEditor, 
		{ 
			value: 'אם(א == 5) אזי{\n\tהדפס("שלום עולם")\n}',
			direction: "rtl",
			rtlMoveVisually: true,
			theme: 'blackboard',
            lineNumbers: true
		});
}
var terminal = new acTerminal(".results", true);
setTimeout(startEditor,500);
window.runCode.addEventListener('click',function (event){
	terminal.clear();
	try{
		var output = avsha.eval(cmEditor.getValue());
    	output && terminal.addLine(output);
	}catch(error){
    	terminal.addError(error.message);
	}
});
