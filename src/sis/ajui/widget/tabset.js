
function AdminJUI_Tabset() {
	AdminJUI_Widget.call(this);

	this._className = 'Tabset';
	this._allowedChildrenClasses = ['Tab'];

	this._tabSelector = $('<ul/>').addClass('adminjui-tab-selector');

	this._tabs = [];

	this._namespace = AdminJUI_Elements.createAnonymousId();

	this._height = null;
}

AdminJUI_Tabset.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_Tabset.prototype._buildHtmlNode = function() {
	var elem = $('<div/>').append(this._tabSelector);

// HACK
	if (this._tabs.length > 0) {
		this._htmlNode = elem;
		this._openTab(0);
	}

	return elem;
};

AdminJUI_Tabset.prototype._hideAll = function() {
	this.getHtmlNode().find('.adminjui-tab-element').css('display', 'none');
};

AdminJUI_Tabset.prototype._openTab = function(tab) {
	this._hideAll();

	if (typeof(this._tabs[tab]) != 'undefined') {
		this._tabs[tab].css('display', 'block');
	}

	this.getHtmlNode().find('ul.adminjui-tab-selector > li').removeClass('active');
	this.getHtmlNode().find('#' + this._namespace + '-' + tab).addClass('active');

    this.redraw();
};

AdminJUI_Tabset.prototype._afterSetChild = function(child) {
	var btn = $('<li/>');
	btn.append($('<a/>').attr('href', '#' + child.getId()).html(child.getTitle()));

	var that = this, idx = this._tabs.length;
	btn.click(function() {
		that._openTab(idx);
		return false;
	}).attr('id', this._namespace + '-' + idx);

	this._tabSelector.append(btn);

	var _hNode = child.getHtmlNode();
	if (this._height !== null) {
		_hNode.css('height', this._height);
	}
	this._tabs.push(_hNode);
	this.getHtmlNode().append(_hNode);
};

AdminJUI_Tabset.prototype.refreshTabs = function() {
	// TODO
};

AdminJUI_Tabset.prototype.setHeight = function(val) {
	this._height = val;

	for (var key in this._tabs) {
		this._tabs[key].css('height', val);
	}

	return this;
};

AdminJUI_Elements.registerElementClass('tabset', AdminJUI_Tabset);
