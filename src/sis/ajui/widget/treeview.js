/**
 * <div>
 *  <ul>
 *   ... any child
 *  </ul>
 * </div>
 * 
 * 
 * @returns {AdminJUI_Treeview}
 */

function AdminJUI_Treeview() {
	AdminJUI_Widget.call(this);

	this._className = 'Treeview';
	this._allowedChildrenClasses = ['TreeviewItem'];
	
	this._htmlNode = null;
	this._treeNode = null;
}

AdminJUI_Treeview.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_Treeview.prototype._buildHtmlNode = function () {
	this._treeNode = $('<ul />');
	
	this._htmlNode = $('<div />');
	this._htmlNode.append(this._treeNode);
	
	return this._htmlNode;
};

AdminJUI_Treeview.prototype._afterSetChild = function (child) {
	this.getHtmlNode();
	this._treeNode.append(child.getHtmlNode());
};

AdminJUI_Elements.registerElementClass('treeview', AdminJUI_Treeview);
