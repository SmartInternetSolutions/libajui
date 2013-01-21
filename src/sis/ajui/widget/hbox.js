/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function AdminJUI_HBox() {
	AdminJUI_Widget.call(this);

	this._className = 'HBox';
	this._allowedChildrenClasses = ['Widget'];

	this._gridObjects = [];
	this._gridObjectsChildrenRelation = [];
	this._rowElement = $('<tr/>');
}

AdminJUI_HBox.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_HBox.prototype.getCell = function(id) {
	this.getHtmlNode();

	if (typeof(this._gridObjects[id]) == 'undefined') {
		return null;
	}

	var hobj = this._gridObjects[id];

	var obj = {
		getHtmlElement: function() {
			return hobj;
		},

		setWidth: function(width) {
			hobj.attr('width', width);

			return obj;
		},

		setAlign: function(align) {
			hobj.css('text-align', align);

			return obj;
		},
		
		setVerticalAlign: function(align) {
			hobj.css('vertical-align', align);
			
			return obj;
		}
	};

	return obj;
};

AdminJUI_HBox.prototype._buildHtmlNode = function() {
	return $('<table/>').append(this._rowElement);
};

AdminJUI_HBox.prototype._afterSetChild = function(child) {
	var td = $('<td/>').append(child.getHtmlNode()).css('vertical-align', 'top').css('text-align', 'left');

	this._rowElement.append(td);
	this._gridObjects.push(td);
	this._gridObjectsChildrenRelation[child] = td;
};

AdminJUI_HBox.prototype.distributeEvenly = function() {
	this._rowElement.find('td')
		.attr('width', Math.floor(100 / this._gridObjects.length) + '%');

	return this;
};

AdminJUI_HBox.prototype._beforeRemoveChild = function(child) {
	var td = this._gridObjectsChildrenRelation[child];

	for (var key in this._gridObjects) {
		if(this._gridObjects[key] === child) {
			this._gridObjects[key] = null;
		}
	}

	td.remove();
};

AdminJUI_Elements.registerElementClass('hbox', AdminJUI_HBox);
