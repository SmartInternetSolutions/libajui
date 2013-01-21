/*
 * text field
 */

function AdminJUI_UploadField() {
	AdminJUI_FormElement.call(this);

	this._className = 'UploadField';
	this._allowedChildrenClasses = [];

	this._ifrId = AdminJUI_Elements.createAnonymousId();

	this._callback = null;
	this._callbackId = '';

	this._inputField = $('<input type="file" />');

	this._dataDummyElement = $('<input type="hidden" />')
		.attr('name', 'handler');

	this._inputFormWrapper = $('<form />')
		.attr('onsubmit', function(){return true;})
		.attr('action', Page.UploadHandlerUrl)
		.attr('method', 'POST')
		.attr('enctype', 'multipart/form-data')
		.attr('target', this._ifrId)
	;
}

AdminJUI_UploadField.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_UploadField.prototype._postprocessHtmlNode = function() {
	var id = AdminJUI_Elements.createAnonymousId();

	// connect label with field
	this._inputField.attr('id', id);
	this._elem_label.attr('for', id);

	this._inputField.addClass('adminjui-form-element').data('adminjui-widget-object', null);

	this._getInputContainer()
		.append(this._inputFormWrapper); // CR: it's important, that the iframe is attached to the structure of the dialog. on dialog close, we will kill every element, so cleanup is taken action.

	this._inputFormWrapper.append(this._inputField).append(this._dataDummyElement);
};

AdminJUI_UploadField.prototype.setName = function(name) {
	this._inputField.attr('name', name);
	this._name = name;

	return this;
};

AdminJUI_UploadField.prototype._valueChanged = function() {
	this._inputField.val(this._value);
};

AdminJUI_UploadField.prototype.getValue = function() {
	return this._callbackId;
};

AdminJUI_UploadField.prototype.setBackendHandler = function(name) {
	this._dataDummyElement.val(name);

	return this;
};

AdminJUI_UploadField.prototype.getBackendHandler = function() {
	return this._dataDummyElement.val();
};

AdminJUI_UploadField.prototype.setFinishedCallback = function(fnc) {
	this._callback = fnc;

	return this;
};

AdminJUI_UploadField.prototype.getFinishedCallback = function() {
	return this._callback;
};

AdminJUI_UploadField.prototype.cleanup = function() {
	this._inputField.val('');

	var that = this;

	window.setTimeout(function() {
		that._iframeHack.remove();
		that._iframeHack = null;
	}, 1000);
	
	return this;
};

AdminJUI_UploadField.prototype.upload = function() {
	var form = this.getForm();

	if (form != null) {
		form.registerUpload(this._ifrId, this);
	} else if(this._callback === null) {
		AdminJUI.addLog('uploading from ' + this.getClassName() + ' with neither having a form nor a callback associated doesn\'t that much make sense.');
	}
	
	var that = this;

	this._iframeHack = $('<iframe/>')
		.css('display', 'none')
		.attr('src', 'about:blank')
		.attr('id', this._ifrId)
		.attr('name', this._ifrId)
		;

	// append to document root to keep the upload available, even we killed the dialog
	$('#Desktop').append(this._iframeHack);

	this._iframeHack.get(0).onload = function() {
		var form = that.getForm();

		that._callbackId = $(that._iframeHack.get(0).contentDocument).find('param[name=id]').text();

		if(form != null) {
			form.markUploadAsDone(that._ifrId);
		}

		if(that._callback) {
			that._callback.call(this);
		}
	};

	AdminJUI.addLog('submitting data');
	this._inputFormWrapper.attr('onsubmit', function(){return true;}).submit();

	return this;
};

AdminJUI_Elements.registerElementClass('uploadfield', AdminJUI_UploadField);
