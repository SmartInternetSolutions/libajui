/* 
 * simple link
 */

function AdminJUI_Link() {
	AdminJUI_Box.call(this);

	this._className = 'Link';
	this._allowedChildrenClasses = [];
	this._label = '';
	this._href = '';
	this._target = '';
}

AdminJUI_Link.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_Link.prototype.setLabel = function(name) {
	this._label = name;

	this.getHtmlNode().html(name);

	return this;
};

AdminJUI_Link.prototype.getLabel = function() {
	return this._label;
};

AdminJUI_Link.prototype.setHelpText = function(text) {
	this._helpText = text;

	this.getHtmlNode().attr('title', text);

	return this;
};

AdminJUI_Link.prototype.getHelpText = function() {
	return this._helpText;
};

AdminJUI_Link.prototype.getHref = function() {
	return this._href;
};

AdminJUI_Link.prototype.setHref = function(href) {
	this._href = href;

	this.getHtmlNode().attr('href', href);

	return this;
};

AdminJUI_Link.prototype._buildHtmlNode = function() {
	return $('<a/>');
};

AdminJUI_Elements.registerElementClass('link', AdminJUI_Link);
