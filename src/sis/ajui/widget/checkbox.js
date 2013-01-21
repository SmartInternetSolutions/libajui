function AdminJUI_Checkbox() {
	AdminJUI_FormElement.call(this);

	this._className = 'Checkbox';
	this._allowedChildrenClasses = [];

	this._inputField = $('<input type="checkbox" />');
}

AdminJUI_Checkbox.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_Checkbox.prototype.setLabel = function(text) {
	this._label = text;

	this.getHtmlNode(); // initialize label first
	this._elem_label.html(text);

	return this;
};

AdminJUI_Checkbox.prototype._postprocessHtmlNode = function() {
	var id = AdminJUI_Elements.createAnonymousId();

	// connect label with field
	this._inputField.attr('id', id);
	this._elem_label.html('');

	this._elem_label = this._elem_label.clone().attr('for', id);
	//this._elem_label = $('<label/>').attr('for', id).html(this._label);

	this._inputField.addClass('adminjui-form-element');

	this._getInputContainer().append(this._inputField).append(this._elem_label);
};

AdminJUI_Checkbox.prototype._valueChanged = function() {
	this._inputField.get(0).checked = (this._value != 0);
};

AdminJUI_Checkbox.prototype.getValue = function() { // CR: strange behaviors on chrome
	var value = this._inputField.get(0).checked;

	if (value === 'true') {
		return true;
	} else if (value === 'false') {
		return false;
	}

	return value;
};

AdminJUI_Elements.registerElementClass('checkbox', AdminJUI_Checkbox);
