/**
 * <li>
 *   <span>
 *     <a href=""> expand / collapse </a>
 *     <a href=""> ... label ... </a>
 *   </span>
 *   <ul> ... any children, if any </ul>
 * </li>
 * 
 * @returns {AdminJUI_TreeviewItem}
 */

function AdminJUI_TreeviewItem() {
	AdminJUI_Widget.call(this);

	this._className = 'TreeviewItem';
	this._allowedChildrenClasses = ['TreeviewItem'];
	
	this._itemNode = $('<li />');
	this._excoNode = $('<a />').addClass('adminjui-treeview-item-exco');
	this._labelNode = $('<a />').addClass('adminjui-treeview-item-label');
	this._treeNode = $('<ul />');
	
	this._label = '';
//	this._defaultCallback = null;
	
	this._callback = null;
	this._data = {};
	
	this._state = AdminJUI_TreeviewItem.STATE_LASTNODE;
	
	this.setIcon('status', 'image-missing');
	this._setExco(AdminJUI_TreeviewItem.HTML_ICON_LASTNODE);
}
AdminJUI_TreeviewItem.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_TreeviewItem.STATE_COLLAPSED      = 'collapsed';
AdminJUI_TreeviewItem.STATE_EXPANDED       = 'expanded';
AdminJUI_TreeviewItem.STATE_LASTNODE       = 'last-node';

AdminJUI_TreeviewItem.HTML_ICON_LASTNODE   = '&nbsp;';
AdminJUI_TreeviewItem.HTML_ICON_COLLAPSED  = '&#x25b8;';
AdminJUI_TreeviewItem.HTML_ICON_EXPANDED   = '&#x25be;';

AdminJUI_TreeviewItem.prototype.setCallback = function(cb) {
	this.getHtmlNode();
	
	if (this._callback !== cb) {
		this.getEventManager().getType('click').remove(this._callback).add(cb);
		this._callback = cb;
	}
	
	return this;
};

AdminJUI_TreeviewItem.prototype.getCallback = function() {
	return this._callback;
};

AdminJUI_TreeviewItem.prototype._buildHtmlNode = function () {
	this._labelNode
		.attr('href', '#')
		.click(function (ev) {
			this.getEventManager().getType('click').trigger();
			
			ev.preventDefault();
		}.bind(this));

	this._excoNode
		.attr('href', '#')
		.click(function (ev) {
			ev.preventDefault();
			
			if (this._state == AdminJUI_TreeviewItem.STATE_LASTNODE) {
				return;
			}
			
			if (this._state == AdminJUI_TreeviewItem.STATE_EXPANDED) {
				this._state = AdminJUI_TreeviewItem.STATE_COLLAPSED;
			} else {
				this._state = AdminJUI_TreeviewItem.STATE_EXPANDED;
			}

			this._renderState();
		}.bind(this));
	
	this._itemNode.append(this._excoNode);
	this._itemNode.append(this._labelNode);
	this._itemNode.append(this._treeNode);

	this._renderState();
	
	return this._itemNode;
};

AdminJUI_TreeviewItem.prototype._renderState = function () {
	switch (this._state) {
	case AdminJUI_TreeviewItem.STATE_COLLAPSED:
		this._setExco(AdminJUI_TreeviewItem.HTML_ICON_COLLAPSED);
		this._treeNode.slideUp();
		break;
		
	case AdminJUI_TreeviewItem.STATE_EXPANDED:
		this._setExco(AdminJUI_TreeviewItem.HTML_ICON_EXPANDED);
		this._treeNode.slideDown();
		break;
		
	case AdminJUI_TreeviewItem.STATE_LASTNODE:
		this._setExco(AdminJUI_TreeviewItem.HTML_ICON_LASTNODE);
		this._treeNode.hide();
		break;
	}
};

AdminJUI_TreeviewItem.prototype._setExco = function (exco) {
	this._excoNode.html(exco);
};

AdminJUI_TreeviewItem.prototype.setLabel = function (label) {
	this._labelNode.text(label);
	
	this._label = label;
	
	return this;
};

AdminJUI_TreeviewItem.prototype.getLabel = function () {
	return this._label;
};

AdminJUI_TreeviewItem.prototype.setData = function (k, v) {
	if (typeof(v) !== 'undefined') {
		this._data[k] = v;
	} else {
		this._data = k;
	}
	
	return this;
};

AdminJUI_TreeviewItem.prototype.getData = function (k) {
	return typeof(k) !== 'undefined' ? this._data[k] : this._data;
};

AdminJUI_TreeviewItem.prototype.setIcon = function (ns, id) {
	this._labelNode.css('background', 'url(' + SDS.workspace.getIconUrl(16, ns, id) + ') no-repeat left center');
	this._labelNode.css('padding-left', 19);
	
	return this;
};

//AdminJUI_TreeviewItem.prototype.getIcon = function () {
//	
//};

AdminJUI_TreeviewItem.prototype._afterSetChild = function (child) {
	this._treeNode.append(child.getHtmlNode());

	this._state = AdminJUI_TreeviewItem.STATE_EXPANDED;
	this._renderState();
};

AdminJUI_TreeviewItem.prototype._afterRemoveChild = function (child) {
	if (!this.hasChildren()) {
		this._state = AdminJUI_TreeviewItem.STATE_LASTNODE;
		this._renderState();
	}
};

AdminJUI_Elements.registerElementClass('treeview-item', AdminJUI_TreeviewItem);
