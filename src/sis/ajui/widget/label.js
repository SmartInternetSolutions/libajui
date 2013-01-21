/*
 * simple label
 */

function AdminJUI_Label() {
	AdminJUI_Widget.call(this);

	this._className = 'Label';
	this._allowedChildrenClasses = [];
	this._label = '';
}

AdminJUI_Label.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_Label.prototype.setValue =
AdminJUI_Label.prototype.setLabel = function(name) {
	this._label = name;

	this.getHtmlNode().html(name);

	return this;
};

AdminJUI_Label.prototype.getValue =
AdminJUI_Label.prototype.getLabel = function() {
	return this._label;
};

AdminJUI_Label.prototype.setHelpText = function(text) {
	this._helpText = text;

	this.getHtmlNode().attr('title', text);

	return this;
};

AdminJUI_Label.prototype.getHelpText = function() {
	return this._helpText;
};

AdminJUI_Label.prototype._buildHtmlNode = function() {
	return this._makeElementUnselectable($('<label/>'));
};

AdminJUI_Elements.registerElementClass('label', AdminJUI_Label);
