var acTerminal = (function () {
	function acTerminal(selector,copyConsoleLines){
		this.selector = selector;
		this.element = document.querySelector(selector);
		this.element.classList.add('ac-terminal');

		if(copyConsoleLines){
			var self = this;
			self.ogConsoleLog = window.console.log;
			console.log = function () {
			    // fs.appendFile('log.txt ..
				Array.from(arguments).forEach(function (arg) {
					self.addLine(arg);
				});
			    self.ogConsoleLog.apply(console, arguments);
			}
			// window.console.log = function () {
			// }
		}
	}
	acTerminal.prototype.clear = function() {
		this.element.innerHTML = '';
	};

	acTerminal.prototype.addError = function(content) {
		addLine(content,this.element, true);
	};
	acTerminal.prototype.addLine = function(content) {
		addLine(content,this.element);
	};
	function addLine(content,element, isError) {
		var newLine = document.createElement('div');
		newLine.classList.add('output-line');
		if(isError){
			newLine.classList.add('output-line-error');
		}
		newLine.innerText = content;
		element.appendChild(newLine);
	}
	return acTerminal;
}).call()