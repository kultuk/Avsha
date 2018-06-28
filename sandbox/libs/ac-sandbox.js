function startEditor(){
	var myCodeMirror = CodeMirror(window.rtlEditor, 
		{ 
			value: 'אם(א == 5) אזי{\n\tהדפס("שלום עולם")\n}',
			direction: "rtl",
			rtlMoveVisually: true,
			// theme: 'blackboard'
		});
}
setTimeout(startEditor,500)