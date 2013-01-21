function AdminJUI_CodeEditor() {
	AdminJUI_FormElement.call(this);

	this._className = 'CodeEditor';
	this._allowedChildrenClasses = [];

	this._editor = null;

	this._editorMode = 'ace/mode/javascript';
}

AdminJUI_CodeEditor.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_CodeEditor.prototype._setupEditor = function () {
    this._editor = ace.edit(this.getId());
    this._editor.setTheme('ace/theme/textmate');
    this._editor.setHighlightActiveLine(true);
    this._editor.setShowInvisibles(true);
    this._editor.setHighlightSelectedWord(true);
    this._editor.getSession().setUseSoftTabs(false);
    this._editor.setFadeFoldWidgets(true);

    this._editor.addEventListener('change', function (e) {
//    	console.log('_editor.onTextInput', this, e);
    	this._valueChanged();
    }.bind(this));

//    this._editor.getSession().setAnnotations(['test']);

//    console.log('djodjod');

    this.setValue(this._value);
    this.setEditorMode(this._editorMode);
};

AdminJUI_CodeEditor.prototype.setEditorMode = function (mode) {
	this._editorMode = mode;

	if (this._editor !== null) {
		var _mode = require(this._editorMode).Mode;

		this._editor.getSession().setMode(new _mode);
	}

	return this;
};

AdminJUI_CodeEditor.prototype.getEditorMode = function () {
	return this._editorMode;
};

AdminJUI_CodeEditor.prototype._buildHtmlNode = function () {
	this._htmlNode = $('<div />').attr('id', this.getId()).text('');

	this.getEventManager().observe('dom-ready', this._setupEditor.bind(this));

	return this._htmlNode;
};

AdminJUI_CodeEditor.prototype.redraw = function () {
	this._editor.resize();

	return this;
};

//AdminJUI_CodeEditor.prototype.setHeight = function (h) {
////	this._htmlNode.height(h);
//	this._editor.setHeight(h);
//
//	return this;
//};
//
//AdminJUI_CodeEditor.prototype.setWidth = function (w) {
////	this._htmlNode.width(w);
//	this._editor.setWidth(w);
//
//	return this;
//};

AdminJUI_CodeEditor.prototype.getValue = function () {
	if (this._editor === null) {
		return this._value;
	}

	return this._editor.getValue();
};

AdminJUI_CodeEditor.prototype.setValue = function (val) {
	if (this._editor === null) {
		this._value = val;
	} else {
		this._editor.setValue(val);
		this._editor.getSelection().clearSelection();
		this._editor.moveCursorTo(0, 0);
	}

	return this;
};

AdminJUI_Elements.registerElementClass('code-editor', AdminJUI_CodeEditor);
