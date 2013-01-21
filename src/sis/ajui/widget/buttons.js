/**
 * button widget
 * @returns {AdminJUI_Button}
 */
function AdminJUI_Button() {
	AdminJUI_FormElement.call(this);

	this._className = 'Button';
	this._allowedChildrenClasses = [];
	this._buttonOptions = {};

	this._buttonLabel = '';
	this._buttonIcon = null;
	this._buttonDefaultCallback = null;
}

AdminJUI_Button.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_Button.prototype.setDisabled = function(disabled) {
	this._disabled = disabled;

	this.getHtmlNode().button({disabled: disabled});

	if (disabled) {
		this.getHtmlNode().attr('disabled', 'disabled');
	} else {
		this.getHtmlNode().attr('disabled', null);
	}
	
	return this;
};

AdminJUI_Button.prototype.setButtonIcon = function(buttonIcon) {
	this._buttonIcon = buttonIcon;

	return this;
};

AdminJUI_Button.prototype.getButtonIcon = function() {
	return this._buttonIcon;
};

AdminJUI_Button.prototype.setCallback = function(cb) {
	this.getHtmlNode();
	
	if (this._callback !== cb) {
		this.getEventManager().getType('click').remove(this._callback).add(cb);
		this._callback = cb;
	}
	
	return this;
};

AdminJUI_Button.prototype.getCallback = function() {
	return this._callback;
};

AdminJUI_Button.prototype.setLabel = function(text) {
	this._label = text;

	this.getHtmlNode().button({label: text});

	return this;
};

AdminJUI_Button.prototype._buildHtmlNode = function() {
	this._htmlNode = $('<button type="button" />').addClass('adminjui-button-element');

	this._buttonOptions.label = this._buttonLabel;
	this._buttonOptions.icons = {primary: this._buttonIcon};

	this._htmlNode
		.button(this._buttonOptions)
	;

	this._bindEventObservers(this._htmlNode);

	if (this._buttonDefaultCallback !== null) {
		this.setCallback(this._buttonDefaultCallback);
	}

	this._elem_label = this._htmlNode;

	return this._htmlNode;
};

AdminJUI_Elements.registerElementClass('button', AdminJUI_Button);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function AdminJUI_SaveButton() {
	AdminJUI_Button.call(this);

	this._className = 'SaveButton';
	this._buttonIcon = 'ui-icon-check';
	var that = this;
	this._buttonDefaultCallback = function() {
		var wMgmt = that.getForm().getWindowMgmt();

		that.getForm().verifyAndSave(function () {
			if (wMgmt) {
				wMgmt.updateForms();
			}
		});

		return false;
	};
	this._buttonLabel = I18n.getText('Save');

}

AdminJUI_SaveButton.prototype = CloneObject(AdminJUI_Button.prototype);

AdminJUI_Elements.registerElementClass('save-button', AdminJUI_SaveButton);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function AdminJUI_OkayButton() {
	AdminJUI_Button.call(this);

	this._className = 'OkayButton';
	var that = this;
	this._buttonDefaultCallback = function() {
		that.getWindow().close();
	};
	
	this._buttonLabel = I18n.getText('Okay');
}

AdminJUI_OkayButton.prototype = CloneObject(AdminJUI_Button.prototype);

AdminJUI_Elements.registerElementClass('okay-button', AdminJUI_OkayButton);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function AdminJUI_CancelButton() {
	AdminJUI_Button.call(this);

	var that = this;

	this._className = 'CancelButton';
	this._buttonIcon = 'ui-icon-close';
	this._buttonLabel = I18n.getText('Cancel');
	this._buttonDefaultCallback = function() {
		that.getWindow().close();
	};
}

AdminJUI_CancelButton.prototype = CloneObject(AdminJUI_Button.prototype);

AdminJUI_Elements.registerElementClass('cancel-button', AdminJUI_CancelButton);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function AdminJUI_CloseButton() {
	AdminJUI_Button.call(this);

	var that = this;

	this._className = 'CloseButton';
	this._buttonIcon = 'ui-icon-close';
	this._buttonLabel = I18n.getText('Close');
	this._buttonDefaultCallback = function() {
		that.getWindow().close();
	};
}

AdminJUI_CloseButton.prototype = CloneObject(AdminJUI_Button.prototype);

AdminJUI_Elements.registerElementClass('close-button', AdminJUI_CloseButton);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function AdminJUI_DeleteButton() {
	AdminJUI_Button.call(this);

	var that = this;

	this._className = 'DeleteButton';
	this._buttonIcon = 'ui-icon-trash';
	this._buttonLabel = I18n.getText('Delete');
	this._buttonDefaultCallback = function() { // let's trigger the common way
		var subject = that.getSubject();
		var confirmMessage = subject !== null ?
			I18n.getText('Are you sure to delete \'{0}\'?',
				subject instanceof AdminJUI_FormElement ? // dynamic subject
					subject.getValue() : subject)
			: I18n.getText('Are you sure to delete?');

		if (confirm(confirmMessage)) {
			that.getForm().remove(function() {
				that.getForm()
					.getWindowMgmt()
					.updateForms();
			});

			that.getWindow().close();
		}
	};

	this._subject = null;
}

AdminJUI_DeleteButton.prototype = CloneObject(AdminJUI_Button.prototype);

AdminJUI_DeleteButton.prototype.setSubject = function(subject) {
	this._subject = subject;
	return this;
};

AdminJUI_DeleteButton.prototype.getSubject = function() {
	return this._subject;
};

AdminJUI_Elements.registerElementClass('delete-button', AdminJUI_DeleteButton);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function AdminJUI_AddButton() {
	AdminJUI_Button.call(this);

	this._className = 'AddButton';
	this._buttonIcon = 'ui-icon-plus';
	this._buttonLabel = I18n.getText('Add');
}

AdminJUI_AddButton.prototype = CloneObject(AdminJUI_Button.prototype);

AdminJUI_Elements.registerElementClass('add-button', AdminJUI_AddButton);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function AdminJUI_RemoveButton() {
	AdminJUI_Button.call(this);

	this._className = 'RemoveButton';
	this._buttonIcon = 'ui-icon-minus';
	this._buttonLabel = I18n.getText('Remove');
}

AdminJUI_RemoveButton.prototype = CloneObject(AdminJUI_Button.prototype);

AdminJUI_Elements.registerElementClass('remove-button', AdminJUI_RemoveButton);
