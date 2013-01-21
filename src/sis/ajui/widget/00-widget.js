/**
 * basic widget
 *
 * this is an abstract class, so don't try to initiate it.
 */

function AdminJUI_Widget() {
	this._id = 'adminjui-widget-' + sis.ajui.Elements.createAnonymousId();
	this._eventManager = sis.ajui.Elements.createEventManager(this);

	this._className = 'Widget';
	this._children = {};
	this._hidden = false;

	this._parent = null;
	this._window = null;
	this._form = null;

	this._allowedChildrenClasses = [];

	this._htmlNode = null;

	this._isImportant = false;

    this._hiddenValues = {};
}

AdminJUI_Widget.prototype = {
	_makeElementUnselectable: function(elem) {
		var _ret0fn = function() {return false;};

		elem
			.css('-moz-user-select', 'none')
			.css('-khtml-user-select', 'none')
			.css('user-select', 'none')
			.css('cursor', 'default');

		if ($.browser.msie) {
			elem.each(function() {
				this.ondrag = _ret0fn;
				this.onselectstart = _ret0fn;
			});
		} else if ($.browser.opera) {
			elem.attr('unselectable', 'on');
		}

		return elem;
	},

	_buildHtmlNode: function() {
		return null;
	},

// capsuled synchronized events
	_afterSetChild: function(child) { return this; },
	_beforeSetChild: function(child) { return this; },
	_afterRemoveChild: function(child) { return this; },
	_beforeRemoveChild: function(child) { return this; },

    triggerEventRecursively : function (name, arg0) {
        for (var key in this._children) {
            this._children[key].triggerEventRecursively(name, arg0);
        }

        this.getEventManager().getType(name).trigger(arg0);
    },

	getEventManager: function() {
		return this._eventManager;
	},

	setParent: function(parent) {
		if (this._parent !== parent) {
			this.getEventManager().getType('hierachy-changed').trigger();
		}

		this._parent = parent;

		this.getEventManager().getType('parent-set').trigger();

		return this;
	},

	getParent: function() {
		return this._parent;
	},

	setWindow: function(window) {
		this._window = window;

		for (var key in this._children) {
			var child = this._children[key];

			if(child instanceof AdminJUI_Widget) {
				child.setWindow(window);
			}
		}

		return this;
	},

	getWindow: function() {
		var form = this.getForm();

		if (this._window !== null) {
			return this._window;
		}

		return form != null ? form.getWindow() : null;
	},

	setForm: function(form) {
		if(this._form !== form)
			this.getEventManager().getType('hierachy-changed').trigger();

		this._form = form;

		this.getEventManager().getType('form-set').trigger();

		return this;
	},

	getForm: function() {
		return this._form;
	},

	getId: function() {
		return this._id;
	},

	getClassName: function() {
		return this._className;
	},

	getHtmlNode: function() {
		if (this._htmlNode == null) {
			this._htmlNode = this._buildHtmlNode()
				.addClass('adminjui-' + this.getClassName().toLowerCase() + '-element')
				.data('adminjui-widget-object', this)
				.attr('id', this.getId());
		}

		return this._htmlNode;
	},

    getHiddenValue: function(key) {
        return this._hiddenValues[key];
    },

    setHiddenValue: function(key, value) {
        this._hiddenValues[key] = value;

        return this;
    },

	getImportant: function() {
		return this._isImportant;
	},

	setImportant: function(state) {
		this._isImportant = state;

		this.getHtmlNode().css('font-weight', state ? 'bold' : 'normal');

		return this;
	},

	getChildren: function() {
		return this._children;
	},

	hasChildren: function () {
		for (var x in this._children) { // FIXME
			return true;
		}

		return false;
	},

	getChild: function(name) {
		return this._children[name];
	},

	setChild: function(name, child) {
		if (!child instanceof AdminJUI_Widget) {
			throw 'set child is no AdminJUI_Widget'; // TODO: better exception
		}

		if (child === this) {
			throw 'child equals parent'; // TODO: better exception
		}

		var found = false;

        // check if child class is allowed 
		for (var key in this._allowedChildrenClasses) {
			if (eval('arguments[1] instanceof AdminJUI_' + this._allowedChildrenClasses[key])) {
				found = true;
				break;
			}
		}

		if (!found) {
			throw 'set child is not permitted'; // TODO: better exception
		}

		child.setParent(this);
		child.setForm(this.getForm());

		this._beforeSetChild(child);

		this._children[name] = child;

		this._afterSetChild(child);

		this.getEventManager().getType('hierachy-changed').trigger();

		return this;
	},

	addChild: function(child) {
		return this.setChild(child.getId() || AdminJUI_Elements.createAnonymousId(), child);
	},

	removeChild: function(name) {
		if (typeof(this._children[name]) == 'undefined') {
			return this;
		}

		var child = this._children[name];
		this._beforeRemoveChild(child);
		child.destruct();
		delete this._children[name];
		this._afterRemoveChild(child);

		this.getEventManager().getType('hierachy-changed').trigger();

		return this;
	},

	isHidden: function() {
		return this._hidden;
	},

	hide: function() {
		this._hidden = true;

		this._htmlNode.css('display', 'none');

		return this;
	},

	unhide: function() {
		this._hidden = false;

		this._htmlNode.css('display', 'block'); // block by div

		return this;
	},

	moveTo: function (x, y) {
		this.getHtmlNode().css({
			top: y,
			left: x,
			position: 'absolute'
		});

		this.redraw();

		return this;
	},

	resizeTo: function (w, h) {
		var node = this.getHtmlNode();

		node.css({
			width:  w - (node.outerWidth() - node.width()),
			height: h - (node.outerHeight() - node.height())
		});

		this.redraw();

		return this;
	},

	destruct: function() {
		if (this._htmlNode != null) {
			this._htmlNode.remove();
		}
	},

	validate: function(continueIteratingEvenOnError) {
		var ret = true;

		for (var name in this._children) {
			try {
				if (!this._children[name].validate()) {
					if (!continueIteratingEvenOnError) {
						return false;
					}

					ret = false;
				}
			} catch(e) {
				ret = false;
			}
		}


		return ret;
	},

	/**
	 * redraw will be called if something stylish has been changed in dom which could be relevant for any element
	 */
	redraw: function() {
		for (var key in this._children) {
			this._children[key].redraw();
		}

		return this;
	}
};

AdminJUI_Elements.registerElementClass('_widget', AdminJUI_Widget, true);
