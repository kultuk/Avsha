function startEditor(){
	var myCodeMirror = CodeMirror(window.rtlEditor, 
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
    terminal.addLine('CHEEEEESE');
});
