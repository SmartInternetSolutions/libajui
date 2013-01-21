/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function AdminJUI_PatternDesigner() {
	AdminJUI_FormElement.call(this);

	this._className = 'PatternDesigner';
	this._allowedChildrenClasses = [];

	this._inputField = $('<input />');

	this._editContainer = $('<div/>').addClass('adminjui-tools-pattern-designer-editor-container');

    this._avoidRerenderOnce = false;
    this._addButtonsCreated = false;
}

AdminJUI_PatternDesigner.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_PatternDesigner.prototype._postprocessHtmlNode = function() {
	var id = AdminJUI_Elements.createAnonymousId();

	// connect label with field
	this._inputField.attr('id', id);
	this._elem_label.attr('for', id);

	this._inputField.addClass('adminjui-form-element').hide(); // needed by AdminJUI_Form

	this._getInputContainer().append(this._editContainer).append(this._inputField);

    this._tokenizer = {
        tokenize: function(str) { 
            var isOpen = false, tokenPushed = true;
            var tokens = [];
            var currentToken = null;
            
            for (var i = 0, j = str.length; i !== j; i++) {
                switch (str[i]) {
                    case '{':
                        if (!isOpen) {
                            isOpen = true;
                            if (currentToken !== null) {
                                tokens.push(currentToken);
                                tokenPushed = true;
                            }
                            currentToken = {type: 1, content: ''};
                            continue;
                        }
                        break;
                        
                    case '}':
                        if (isOpen) {
                            isOpen = false;
                            tokens.push(currentToken);
                            tokenPushed = true;
                            currentToken = {type: 0, content: ''};
                        }
                        break;
                        
                    default:
                        if (currentToken === null) {
                            currentToken = {type: 0, content: ''};
                        }
                        currentToken.content += str[i];
                        
                        tokenPushed = false;
                        break;
                }
            }
            
            if (!tokenPushed) {
                tokens.push(currentToken);
            }
            
            return tokens; 
        }, compile: function (tkns) { 
            var out = '';
            
            for (var key in tkns) {
                if (typeof(tkns[key]) === 'undefined') {
                    continue;
                }
                
                if (tkns[key].type === 1) {
                    out += '{' + tkns[key].content + '}';
                } else {
                    out += tkns[key].content;
                }
            }
            
            return out; 
        }
    };
};

AdminJUI_PatternDesigner.prototype._rerender = function () {
    this._editContainer.children('.adminjui-token-element').remove();
    console.log(this._tokens);
    
    var tokens = [];
    
    for (var key in this._tokens) {
        if (typeof(this._tokens[key]) !== 'undefined') {
            tokens.push(this._tokens[key]);
        }
    }
    
    this._tokens = tokens;
    
    for (var key in this._tokens) {
        var current = this._tokens[key];
        
        if (typeof(current) === 'undefined') {
            continue;
        }
        
        var tokenElement = $('<div />')
            .addClass('adminjui-token-element')
            .addClass('adminjui-token-element-type-' + current.type);
        
        var tokenContent    = $('<div />').text(current.content).attr('contenteditable', true).attr('spellcheck', false);
        var grabber         = $('<div />').addClass('adminjui-token-element-button-grab');
        var deleteButton    = $('<a />').html('x').attr('href', '#').addClass('adminjui-token-element-button-edit');
        
        var bindPair = [this, key, tokenContent, tokenElement];

        tokenContent.blur(function () {
            // remove any formatting
            this[2].text(this[2].text());
            
            this[0]._tokens[this[1]].content = this[2].text();
            
            this[0]._emitChangeEvent();
        }.bind(bindPair));

        deleteButton.click(function () {
            delete (this[0]._tokens[this[1]]);
            
            this[3].fadeOut('fast', function () {this.remove();}.bind(this[3]));
            
            this[0]._emitChangeEvent();
        }.bind(bindPair));

        tokenElement.append(tokenContent);
        tokenElement.append(grabber);
        tokenElement.append(deleteButton);
        
        tokenElement.data('token', current);
        
        this._editContainer.append(tokenElement);
    }
    
    if (!this._addButtonsCreated) {
        var addButtonType1 = $('<a />').attr('href', '#').text('+').addClass('adminjui-token-add').addClass('adminjui-token-add-type-0');
        var addButtonType2 = $('<a />').attr('href', '#').text('+').addClass('adminjui-token-add').addClass('adminjui-token-add-type-1');

        addButtonType1.click(function () {
            this._tokens.push({
                type: 0,
                content: 'Text'
            });

            this._emitChangeEvent();
            this._rerender();
        }.bind(this));

        addButtonType2.click(function () {
            this._tokens.push({
                type: 1,
                content: 'Text'
            });

            this._emitChangeEvent();
            this._rerender();
        }.bind(this));

        this._editContainer.sortable({
            delay: 1,
            handle: '.adminjui-token-element-button-grab',
            stop: function () {
                var newTokens = [];
                this._editContainer.children('.adminjui-token-element').each(function () {
                    newTokens.push($(this).data('token'));
                });
                this._tokens = newTokens;
                
                // FIXME: only re-attach observers, because binding is now wrong
                this._rerender();

                this._emitChangeEvent();
            }.bind(this)
        });

        this._editContainer.append(addButtonType1);
        this._editContainer.append(addButtonType2);
        
        this._addButtonsCreated = true;
    }
};

AdminJUI_PatternDesigner.prototype.setTokenizer = function(tokenizer) {
    if (typeof(tokenizer.tokenize) === 'undefined' || 
        typeof(tokenizer.compile) === 'undefined') {
        throw 'invalid tokenizer given';
    }
    
    this._tokenizer = tokenizer;
    this._tokens = [];
    
    return this;
};

AdminJUI_PatternDesigner.prototype._tokenize = function() {
    var tokens = this._tokenizer.tokenize(this._value);

    this._tokens = tokens;

    return tokens;
};

AdminJUI_PatternDesigner.prototype._compile = function() {
    return this._tokenizer.compile(this._tokens);
};

AdminJUI_PatternDesigner.prototype._emitChangeEvent = function () {
    this.getEventManager().getType('change').trigger();
    this.setHelpText(this.getValue());
};

AdminJUI_PatternDesigner.prototype._valueChanged = function() {
    this._tokenize(this._value);
    
    AdminJUI_FormElement.prototype._valueChanged.call(this);
    
    if (this._avoidRerenderOnce) {
        this._avoidRerenderOnce = false;
        
        return;
    }
    
    this._rerender();
    this.setHelpText(this.getValue());
};

AdminJUI_PatternDesigner.prototype.getValue = function () {
    return this._compile();
};

AdminJUI_Elements.registerElementClass('patterndesigner', AdminJUI_PatternDesigner);
