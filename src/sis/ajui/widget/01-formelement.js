/**

 form elements:

	<div class="adminjui-form-element-container" id="id">
		<div class="adminjui-form-element-label-container">
			<label class="adminjui-form-element-label">
				Some Text
			</label>
		</div>
		<div class="adminjui-form-element-input-container">
			<input type="text" />
		</div>
		<div class="adminjui-form-element-helptext">
			Lorem Ipsum Dolor Sit Amet.
		</div>
	</div>

 */

// constructor
function AdminJUI_FormElement() {
	AdminJUI_Widget.call(this);

	this._className = 'FormElement';
	this._allowedChildrenClasses = [];

	/* k = done/implemented
		- name:String (k)
		- label:String (k)
		- helpText:String (k)
		- value:String (k)
		- required:bool (k)
		- disabled:bool (k)
	 */

	this._name = '';
	this._label = '';
	this._helpText = '';
	this._errorMessage = null;
	this._required = false;
	this._disabled = false;
	this._value = '';

	this._inputContainer = null;
	this._elem_label = null;
    this._elem_labelContainer = null;
	this._elem_helpText = null;
	this._elem_errorMessage = null;
	this._inputField = null;

	this.SELECTOR_ALL_INPUTS =
		'.adminjui-form-element-input-container input, ' +
		'.adminjui-form-element-input-container textarea, ' +
		'.adminjui-form-element-input-container select';
}

/**
 * collects all available values from given node tree
 */
AdminJUI_FormElement.collectValues = function(node) {
	var children = node.getChildren();

	var data = {};

	for (var name in children) {
		var child = children[name];

		$.extend(data, AdminJUI_FormElement.collectValues(child));
	}

	if (node instanceof AdminJUI_FormElement && node.getName() != '') {
		data[node.getName()] = node.getValue();
	}

	return data;
};

/**
 * scans recursively for an element with given name from given node tree
 */
AdminJUI_FormElement.getElementByName = function(neededName, node) {
	var children = node.getChildren();

	for (var name in children) {
		var child = children[name];

		var element = AdminJUI_FormElement.getElementByName(neededName, child);

		if (element !== null) {
			return element;
		}
	}

	if (node instanceof AdminJUI_FormElement && node.getName() == neededName) {
		return node;
	}

	return null;
};

/**
 * returns all recursively found children with name
 * @param node
 * @returns {___anonymous2280_2281}
 */
AdminJUI_FormElement.getNamedChildren = function(node) {
	var children = node.getChildren();

	var data = {};

	for (var name in children) {
		var child = children[name];

		$.extend(data, AdminJUI_FormElement.getNamedChildren(child));
	}

	if (node instanceof AdminJUI_FormElement && node.getName() != '') {
		data[node.getName()] = node;
	}

	return data;
};

AdminJUI_FormElement.prototype = CloneObject(AdminJUI_Widget.prototype);

AdminJUI_FormElement.prototype.cleanup = function() {
};

AdminJUI_FormElement.prototype._bindEventObservers = function(collection) {
	var that = this;

	// CR: following statement replaces the DRY code below it

	var fns = [
	           'change', 'click', 'dblclick',
	           'mouseover', 'mouseout', 'mousedown', 'mouseup',
	           'keydown', 'keyup', 'keypress'
	       ];

	for (var i = 0, j = fns.length; i != j; i++) {
		collection[fns[i]](function(){
			this.o.getEventManager().getType(this.t).trigger();
		}.bind({o:that, t:fns[i]}));
	}
};

AdminJUI_FormElement.prototype._postprocessHtmlNode = function() {
};

AdminJUI_FormElement.prototype._getInputContainer = function() {
	return this._inputContainer;
};

AdminJUI_FormElement.prototype._getElementCollection = function() {
	return this.getHtmlNode().find(this.SELECTOR_ALL_INPUTS);
};

AdminJUI_FormElement.prototype._buildHtmlNode = function() {
	this._inputContainer = $('<div/>').addClass('adminjui-form-element-input-container');

	this._elem_label = $('<label/>').addClass('adminjui-form-element-label');
    this._elem_labelContainer = $('<div/>').addClass('adminjui-form-element-label-container');
	this._elem_helpText = $('<div/>').addClass('adminjui-form-element-helptext');
	this._elem_errorMessage = $('<div/>').addClass('adminjui-form-element-errormessage');

	this._makeElementUnselectable(this._elem_label);
	this._makeElementUnselectable(this._elem_helpText);
	this._makeElementUnselectable(this._elem_errorMessage);

	this._htmlNode = $('<div/>').addClass('adminjui-form-element-container');
	this._htmlNode.append(this._elem_labelContainer.append(this._elem_label));
	this._htmlNode.append(this._inputContainer);
	this._htmlNode.append(this._elem_helpText);
	this._htmlNode.append(this._elem_errorMessage);

	this._postprocessHtmlNode();

	var collection = this._htmlNode.find(this.SELECTOR_ALL_INPUTS).change(
		function() {
			// mark window as modified if something changes
			if (this.getWindow()) {
				this.getWindow().setModifiedFlag(true);
			}
		}.bind(this)
	).data('adminjui-widget-object', this);

	if (this._required) {
		collection.addClass('adminjui-form-element-required');
	}

	this._bindEventObservers(collection);

	this._postpostprocessHtmlNode();

	return this._htmlNode;
};

AdminJUI_FormElement.prototype._postpostprocessHtmlNode = function() {
};

AdminJUI_FormElement.prototype.focus = function() {
	this.getHtmlNode();

	this._inputField.focus();

	return this;
};

AdminJUI_FormElement.prototype.validate = function() {
	try {
		this.getEventManager().getType('validate').trigger();

		this.setErrorMessage(null);
		return true;
	} catch(e) {
		this.setErrorMessage(e);
		this.focus();
	}

	return false;
};

AdminJUI_FormElement.prototype.addValidator = function(fnc) {
	this.getEventManager().observe('validate', fnc);

	return this;
};

AdminJUI_FormElement.prototype.setName = function(name) {
	this._name = name;

	this._getElementCollection().attr('name', this._name);

	return this;
};

AdminJUI_FormElement.prototype.getName = function() {
	return this._name;
};

AdminJUI_FormElement.prototype.setLabel = function(text) {
	this._label = text;

	this.getHtmlNode(); // initialize label first
	this._elem_label.html(text + ': ');

	return this;
};

AdminJUI_FormElement.prototype.getLabel = function() {
	return this._label;
};

AdminJUI_FormElement.prototype.setHelpText = function(text) {
	this._helpText = text;
	this.getHtmlNode().children('.adminjui-form-element-helptext').html(text);

	return this;
};

AdminJUI_FormElement.prototype.getHelpText = function() {
	return this._helpText;
};

AdminJUI_FormElement.prototype.setErrorMessage = function(text) {
	var elem = this.getHtmlNode().children('.adminjui-form-element-errormessage');

	this._errorMessage = text;
	elem.html(text);

	if (text !== null) {
		elem.slideDown().fadeIn();
	} else {
		elem.slideUp();
	}

	return this;
};

AdminJUI_FormElement.prototype.getErrorMessage = function() {
	return this._errorMessage;
};

AdminJUI_FormElement.prototype.setImportant = function(state) {
	if (this instanceof AdminJUI_Button) {
		return AdminJUI_Widget.prototype.setImportant.call(this, state);
	}

	return this;
};

AdminJUI_FormElement.prototype.getImportant = function() {
	if (this instanceof AdminJUI_Button) {
		return AdminJUI_Widget.prototype.getImportant.call(this);
	}

	return false;
};

AdminJUI_FormElement.prototype.setRequired = function(required) {
	this._required = required;

	if (required) {
		this._getElementCollection().addClass('adminjui-form-element-required');
		this.getHtmlNode().addClass('adminjui-form-element-container-required');
	} else {
		this._getElementCollection().removeClass('adminjui-form-element-required');
		this.getHtmlNode().removeClass('adminjui-form-element-container-required');
	}

	return this;
};

AdminJUI_FormElement.prototype.getRequired = function() {
	return this._required;
};

AdminJUI_FormElement.prototype.setDisabled = function(disabled) {
	this._disabled = disabled;

	if (disabled) {
		this._getElementCollection()
			.addClass('adminjui-form-element-disabled')
			.css('cursor', 'default !important')
			.attr('disabled', true);

		this.getHtmlNode().addClass('adminjui-form-element-container-disabled');

	} else {
		this._getElementCollection()
			.removeClass('adminjui-form-element-disabled')
			.css('cursor', '')
			.attr('disabled', null);

		this.getHtmlNode().removeClass('adminjui-form-element-container-disabled');
	}

	return this;
};

AdminJUI_FormElement.prototype.getDisabled = function() {
	return this._disabled;
};

AdminJUI_FormElement.prototype._valueChanged = function() {
	this.getEventManager().getType('change').trigger(); // TODO: move out to setValue?
};

AdminJUI_FormElement.prototype.setValue = function(val) {
	this._value = val;
	this._valueChanged();

	return this;
};

AdminJUI_FormElement.prototype.getValue = function() {
	if (this._inputField === null) {
		return null;
	}

	return this._inputField.val() || this._value;
};

AdminJUI_FormElement.prototype.clear = function() {
	return this.setValue(null);
};

AdminJUI_FormElement.prototype.setFullSpace = function(on) {
	if (on) {
		this.getHtmlNode().addClass('adminjui-form-element-full-space');
	} else {
		this.getHtmlNode().removeClass('adminjui-form-element-full-space');
	}

	return this;
};

AdminJUI_FormElement.prototype.getFullSpace = function() {
	return this.getHtmlNode().hasClass('adminjui-form-element-full-space');
};

AdminJUI_FormElement.prototype.commitFullSpace = function () {
    this.setFullSpace(true);

    this._elem_helpText.remove();
    this._elem_errorMessage.remove();
    this._elem_labelContainer.remove();

    return this;
};

AdminJUI_Elements.registerElementClass('_formelement', AdminJUI_FormElement, true);
