function AdminJUI_Ruler() {
	AdminJUI_Widget.call(this);

	this._className = 'Ruler';
	this._allowedChildrenClasses = [];
}

AdminJUI_Ruler.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_Ruler.prototype._buildHtmlNode = function() {
	this._htmlNode = $('<hr/>');

	return this._htmlNode;
};

AdminJUI_Elements.registerElementClass('ruler', AdminJUI_Ruler);
