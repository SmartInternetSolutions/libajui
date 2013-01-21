/**
 * dropdown widget
 * you can set options via setValues and select one with setValue
 * @returns {AdminJUI_Dropdown}
 */
function AdminJUI_Dropdown() {
	AdminJUI_FormElement.call(this);

	this._className = 'Dropdown';
	this._allowedChildrenClasses = [];

	this._inputField = $('<select />');
	this._values = [];
}

AdminJUI_Dropdown.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_Dropdown.prototype._postprocessHtmlNode = function() {
	var id = AdminJUI_Elements.createAnonymousId();

	// connect label with field
	this._inputField.attr('id', id);
	this._elem_label.attr('for', id);

	this._inputField.addClass('adminjui-form-element');

	this._getInputContainer().append(this._inputField);
};

AdminJUI_Dropdown.prototype.setValues = function(values) {
	this._inputField.empty();

	for (var key in values) {
		this._inputField.append($('<option />').val(key).html(values[key]));
	}

	this._values = values;
	
	this._valueChanged();
	
	return this;
};

AdminJUI_Dropdown.prototype.getValues = function() {
	return this._values;
};

AdminJUI_Dropdown.prototype.setValue = function(value) {
	if (typeof(value) == 'object') {
		return this.setValues(value);
	}

	if (typeof(this._values[value]) !== 'undefined') {
		this._inputField.val(value);
	}
    
	this._valueChanged();

	return this;
};

AdminJUI_Dropdown.prototype.getValueForFrontend = function() {
    var val = this.getValue();
    
    return typeof(this._values[val]) !== 'undefined' ? 
        this._values[val] : '';
};

AdminJUI_Dropdown.prototype._valueChanged = function() {
};

AdminJUI_Dropdown.prototype.clear = function() {
	return this.setValues([]);
};

AdminJUI_Elements.registerElementClass('dropdown', AdminJUI_Dropdown);
