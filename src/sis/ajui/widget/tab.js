
function AdminJUI_Tab() {
	AdminJUI_Box.call(this);

	this._className = 'Tab';
	this._title = '';
}

AdminJUI_Tab.prototype = CloneObject(AdminJUI_Box.prototype);

AdminJUI_Tab.prototype.setTitle = function(title) {
	this._title = title;

	if (this.getParent()) {
		this.getParent().refreshTabs();
	}
	
	return this;
};

AdminJUI_Tab.prototype.getTitle = function() {
	return this._title;
};

AdminJUI_Elements.registerElementClass('tab', AdminJUI_Tab);
