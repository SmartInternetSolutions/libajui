/*
 * text field
 */

function AdminJUI_Textfield() {
	AdminJUI_FormElement.call(this);

	this._className = 'Textfield';
	this._allowedChildrenClasses = [];

	this._inputField = $('<input />');
}

AdminJUI_Textfield.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_Textfield.prototype._postprocessHtmlNode = function() {
	var id = AdminJUI_Elements.createAnonymousId();

	// connect label with field
	this._inputField.attr('id', id);
	this._elem_label.attr('for', id);

	this._inputField.addClass('adminjui-form-element');

	this._getInputContainer().append(this._inputField);
};

AdminJUI_Textfield.prototype._valueChanged = function() {
	this._inputField.val(this._value);
};

/**
 * masks input field
 * 
 * @returns {AdminJUI_Textfield}
 */
AdminJUI_Textfield.prototype.maskInput = function(mask) {
	this.getHtmlNode();
	
	var obj = this._inputField;
	var cursorPosition = 0;
	
	// sample: ^([0-9]+)x([0-9]+)$
	var cursor = {
		_position: 0,
			
		getPosition: function() {
			return cursor._position;
		},
		
		stepForward: function() {
			// cursor is already at the end
			if (cursor._position >= obj.val().length) {
				return;
			}
			
			cursor.setPosition(++cursor._position);
			
			return cursor;
		},
		
		stepBack: function() {
			// cursor reached the beginning
			if (cursor._position === 0) {
				return;
			}
			
			cursor.setPosition(--cursor._position);
			
			return cursor;
		},
			
		setPosition: function(caretPos) {
			if (caretPos === null) {
				caretPos = cursor._position;
			}
			
			// source: http://plugins.jquery.com/content/cursor-position
			if(obj[0].createTextRange) { /* For IE */
			    var range = obj[0].createTextRange();
			    range.move('character', caretPos);
			    range.select();
			} else { /* For other browsers */
				obj[0].setSelectionRange(caretPos, caretPos);
			}
			
			return cursor;
		}
	};

	// on triggering focus, we display mask:
	// _x_
	obj.focus(function() {
		cursor.setPosition(null);
	});
	
	// let's handle all important key inputs
	obj.keyup(function(e) {
		var handled = false;
		
		switch(e.keyCode) {
		case 37:
			handled = true;
			
			cursor.stepBack();
			break;
		
		case 39:
			handled = true;
			
			cursor.stepForward();
			break;
		}
		
		// don't let the system act, we already did.
		if (handled) {
			e.preventDefault();
		}
	});

	return this;
};


AdminJUI_Elements.registerElementClass('textfield', AdminJUI_Textfield);

function AdminJUI_Passwordfield() {
	AdminJUI_Textfield.call(this);

	this._className = 'Textfield';
	this._allowedChildrenClasses = [];

	this._inputField = $('<input type="password" />');
}

AdminJUI_Passwordfield.prototype = CloneObject(AdminJUI_Textfield.prototype);

AdminJUI_Elements.registerElementClass('passwordfield', AdminJUI_Passwordfield);
