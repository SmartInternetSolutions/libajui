/**
 * dropdown widget
 * you can set options via setValues and select one with setValue
 * @returns {AdminJUI_MultiDropdown}
 */
function AdminJUI_MultiDropdown() {
	AdminJUI_FormElement.call(this);

	this._className = 'MultiDropdown';
	this._allowedChildrenClasses = [];

	// elements
	this._inputField = $('<input type="text" />');
	this._values = [];
	
	this._dropdownListContainer = $('<div />');
	this._dropdownList = $('<ul />');
	
	this._sortBar = $('<select />');
	this._searchBar = $('<input type="text" />');
	
	this._toolbar = null;
	
	this._openerHandle = $('<a />');
	
	// data
	this._primaryKey = null;
	
	// states
	this._dropdownList_open = false;
	this._selectedIndex = 0;
	this._inKeyboardMode = false;
    
    // this should disappear the dropdown as soon as the user clicks somewhere outside
    this._bodyClickFnc = function (event) {
        // this is a bit tricky
        
        var currentTarget = $(event.target);
        var containerTarget = $(this._dropdownListContainer);
        
        var bubblingInside = false;
        
        while (!currentTarget.is('body')) {
            if (currentTarget.get(0) == containerTarget.get(0)) {
                bubblingInside = true;
                break;
            }
            
            currentTarget = currentTarget.parent();
        }
        
        if (!bubblingInside) {
            $(document).die('mouseup', this._bodyClickFnc);
            this._hideDropdown();
            
            return;
        }
        
        event.stopImmediatePropagation();
    }.bind(this);
}

AdminJUI_MultiDropdown.prototype = CloneObject(AdminJUI_FormElement.prototype);

/**
 * recalculate widths
 */
AdminJUI_MultiDropdown.prototype.redraw = function() {
	// width
	this._dropdownListContainer.css('left', this._inputField.offset().left);
	this._dropdownListContainer.width(this._inputField.outerWidth() - 2); // PLEASE NOTE THE 2px (padding, border)
	
	// height
	var childrenHeight = 0, childHeight = 0;
	var maxChildPerPage = 10;
	
	this._dropdownList.children().each(function() {
		if ($(this).css('display') == 'none') {
			return;
		}
		
		childHeight = $(this).outerHeight();
		childrenHeight += $(this).outerHeight();
	});
	
	childrenHeight = Math.min(childHeight * maxChildPerPage, childrenHeight);
	
	if (childrenHeight < childHeight) {
		childrenHeight = childHeight;
	}
	
	this._dropdownListContainer.height(childrenHeight + this._toolbar.outerHeight());
	this._dropdownList.height(childrenHeight);
};

AdminJUI_MultiDropdown.prototype._showDropdown = function() {
	if (this._dropdownList_open) {
		return;
	}
    
    this._dropdownListContainer.show();
	this._getInputContainer().addClass('adminjui-multidropdown-list-shown');

	this._searchBar.focus();

	this.redraw();
	
	this._dropdownList_open = true;

    $(document).mouseup(this._bodyClickFnc);
};

AdminJUI_MultiDropdown.prototype._hideDropdown = function() {
	if (!this._dropdownList_open) {
		return;
	}
	
	this._dropdownListContainer.fadeOut('fast');

	this._getInputContainer().removeClass('adminjui-multidropdown-list-shown');
	
	this._dropdownList_open = false;
    
    $(document).die('mouseup', this._bodyClickFnc);
};

/**
 * sets headers (used by sortbar)
 * headers = {'key': 'Name', ...}
 */
AdminJUI_MultiDropdown.prototype.setHeaders = function(headers) {
	this._sortBar.empty();

	for(var key in headers) {
		var header = headers[key];
		
		this._sortBar.append($('<option />')
			.html(header + ' ' + I18n.getText('ascending'))
			.val(key + ',asc')
		);
		
		this._sortBar.append($('<option />')
			.html(header + ' ' + I18n.getText('descending'))
			.val(key + ',desc')
		);
	}
	
	return this;
};

AdminJUI_MultiDropdown.prototype.setPrimaryKey = function(pk) {
	this._primaryKey = pk;
	
	this._renderValues();
	this._valueChanged();

	return this;
};

AdminJUI_MultiDropdown.prototype.sort = function(sortAfter, orderBy) {
	if (orderBy == 'asc') {
		this._dropdownList.children().sortElements(function(a, b) {
			return $(a).data('valueObj')[sortAfter] > $(b).data('valueObj')[sortAfter] ? 1 : -1;
		});
	} else {
		this._dropdownList.children().sortElements(function(a, b) {
			return $(a).data('valueObj')[sortAfter] < $(b).data('valueObj')[sortAfter] ? 1 : -1;
		});
	}
	
	this._dropdownList.scrollTop(0);
};

// remove _bindEventObservers observers and add own lately
AdminJUI_MultiDropdown.prototype._postpostprocessHtmlNode = function() {
	var ctr = function (event) {
		var val = this._searchBar.val();
		var valIsEmpty = $.trim(val) === '';
		
		if (valIsEmpty || event.keyCode == 27) {
			this._dropdownList.children().each(function() {
				$(this).html($(this).text());
			}).show();
			
			if (valIsEmpty && event.keyCode == 27) {
				this._hideDropdown();
			}

//			var newPos = -1;
//			
//			switch(event.keyCode) {
//			case 13: // K_ENTER
//				if (this._inKeyboardMode) {
//					this._hideDropdown();
//				}
//				break;
//			
//			case 33: // K_PAGEUP
//				newPos = Math.max(0, this._selectedIndex - 8);
//				break;
//				
//			case 38: // K_UP
//				newPos = Math.max(0, this._selectedIndex - 1);
//				break;
//			
//			case 34: // K_PAGEDOWN
//				newPos = Math.min(this._dropdownList.children().length, this._selectedIndex + 8);
//				break;
//				
//			case 40: // K_DOWN
//				newPos = Math.min(this._dropdownList.children().length, this._selectedIndex + 1);
//				break;
//			}
//			
//			if (newPos !== -1) {
//				this._inKeyboardMode = true;
//				this.setValue($(this._dropdownList.children().get(newPos)).data('key'));
//				return;
//			}
			
			this._searchBar.val('');
			event.preventDefault();
			this.redraw();
			return;
		}
		
		this._dropdownList.children().hide().each(function (){
			if ($(this).text().toLowerCase().indexOf(val.toLowerCase()) !== -1) {
				$(this).html($(this).text().replace(val, '<strong>' + val + '</strong>'));
				
				$(this).show();
			}
		});
		
		this.redraw();
		
	}.bind(this);
	
	this._searchBar.unbind().keyup(ctr).change(ctr);
	
	this._sortBar.unbind().change(function() {
		var parts = this._sortBar.val().split(',');
		
		if (parts.length !== 2) {
			return;
		}
		
		var sortAfter = parts[0], orderBy = parts[1];
		
		this.sort(sortAfter, orderBy);
	}.bind(this));
};

AdminJUI_MultiDropdown.prototype._postprocessHtmlNode = function() {
	var id = AdminJUI_Elements.createAnonymousId();
	
	// connect label with field
	this._inputField.attr('id', id);
	this._elem_label.attr('for', id);

	// create toolbar
	this._toolbar = $('<div />').addClass('adminjui-multidropdown-toolbar');
	this._toolbar.append(this._sortBar.addClass('adminjui-multidropdown-sortbar'));
	this._toolbar.append(this._searchBar.addClass('adminjui-multidropdown-searchbar'));
	this._toolbar.append($('<div />').css('clear', 'both'));
	
	// add everything to container
	this._dropdownListContainer
		.addClass('adminjui-multidropdown-dropdownlist')
		.blur(function() {
			this._hideDropdown();
		}.bind(this))
		.append(this._toolbar)
		.append(this._dropdownList)
	;
	
	// prepare input field and make it dump
	this._inputField.addClass('adminjui-form-element');
	
	this._inputField.focus(function() {
		this._openerHandle.focus();
	}.bind(this));
	
	this._inputField.click(function() {
		this._openerHandle.click();
	}.bind(this));
	
	// prepare handle
	this._openerHandle
		.attr('href', '#')
		.html('&#9013;')
		.addClass('ui-state-default')
		.addClass('adminjui-multidropdown-openerhandle');
	
	this._dropdownListContainer.mouseenter(function() {
		this._openerHandle.removeClass('ui-state-default');
		this._openerHandle.addClass('ui-state-hover');
	}.bind(this)).mouseleave(function() {
		this._openerHandle.addClass('ui-state-default');
		this._openerHandle.removeClass('ui-state-hover');
	}.bind(this));
	
	this._openerHandle.click(function() {
		if (this.getDisabled()) {
			return;
		}
		
		if (!this._dropdownList_open) {
			this._showDropdown();
		} else {
			this._hideDropdown();
		}
	}.bind(this));
	
	// add everything to container
	this._getInputContainer()
		.append(this._inputField)
		.append(this._openerHandle)
		.append(this._dropdownListContainer);
};

var hitter = 0;

AdminJUI_MultiDropdown.prototype._renderValues = function() {
	this._dropdownList.empty();

	for (var key in this._values) {
		var value = this._values[key];
		
		var $li = $('<li />');
		$li.text(value[this._primaryKey]);
		$li.data('valueObj', value);
		$li.data('key', key);
//		$li.val(key);
		$li.click(function() {
			this.obj._inKeyboardMode = false;
			this.obj.setValue(this.key);
			this.obj._hideDropdown();
		}.bind({obj: this, key: key}));
		
		this._dropdownList.append($li);
	}

	this.redraw();
	
	return this;
};

AdminJUI_MultiDropdown.prototype.setValues = function(values) {
	this._inputField.empty();
	this._values = values;

	this._renderValues();
	
	this.sort(this._primaryKey, 'asc');
	
	this._valueChanged();
	
	return this;
};

AdminJUI_MultiDropdown.prototype.getValues = function() {
	return this._values;
};

AdminJUI_MultiDropdown.prototype.setValue = function(value) {
	// options got changed, so we emit null value
	if (typeof(value) == 'object') {
		this._value = 0;
		return this.setValues(value);
	}
	
	this._value = value;

	if (this._values !== null && typeof(this._values[value]) !== 'undefined') {
		this._inputField.val(this._values[value][this._primaryKey]);
	}
	
	var ddl = this._dropdownList;
	var that = this;
	var counter = 0;
	this._dropdownList.children().each(function() {
		if ($(this).data('key') == value) {
			ddl.scrollTop(that._selectedIndex * ($(this).outerHeight()));
			
			$(this).addClass('adminjui-multidropdown-selected');
			
			that._selectedIndex = counter;
		} else {
			$(this).removeClass('adminjui-multidropdown-selected');
		}
		
		counter++;
	});
	
	this._valueChanged();

	return this;
};

AdminJUI_MultiDropdown.prototype.getValue = function() {
	return this._value;
};

AdminJUI_MultiDropdown.prototype.getValueForFrontend = function() {
    var val = this.getValue();
    
    return typeof(this._values[val]) !== 'undefined' ? 
        this._values[val] : '';
};

AdminJUI_MultiDropdown.prototype.clear = function() {
	this.setValue([]);
	this.setValue(null);
	return this;
};

AdminJUI_Elements.registerElementClass('multidropdown', AdminJUI_MultiDropdown);
