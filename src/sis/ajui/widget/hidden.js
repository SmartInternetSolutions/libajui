/**
 * @deprecated 
 */

function AdminJUI_Hidden() {
	AdminJUI_FormElement.call(this);

	this._className = 'Hidden';
	this._allowedChildrenClasses = [];

	this._inputField = $('<input type="hidden" />');
}

AdminJUI_Hidden.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_Hidden.prototype._postprocessHtmlNode = function() {
	this._htmlNode = $('<div />');
	this._htmlNode.append(this._inputField);
};

AdminJUI_Hidden.prototype._valueChanged = function() {
	this._inputField.val(this._value);
};

AdminJUI_Hidden.prototype.getValue = function() {
	return this._inputField.val();
};

AdminJUI_Elements.registerElementClass('hidden', AdminJUI_Hidden);
