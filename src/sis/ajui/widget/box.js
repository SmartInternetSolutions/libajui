/**
 * simple prototype of hbox, vbox, table.
 * it can store any widget
 * @returns {AdminJUI_Box}
 */

function AdminJUI_Box() {
	AdminJUI_Widget.call(this);

	this._className = 'Box';
	this._allowedChildrenClasses = ['Widget'];
}

AdminJUI_Box.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_Box.prototype._buildHtmlNode = function() {
	return $('<div/>');
};

AdminJUI_Box.prototype._afterSetChild = function(child) {
	this.getHtmlNode().append(child.getHtmlNode());
};

AdminJUI_Elements.registerElementClass('box', AdminJUI_Box);
