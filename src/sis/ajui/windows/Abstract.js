sis.ajui.windows = sis.ajui.windows || {};

(function (){
sis.ajui.windows.Abstract = function Abstract() {
    this._rootNode = null;
    this._form = null;
    
    this._title = 'Untitled';
    this._width = 0;
    this._height = 0;

    this._eventManager = sis.ajui.Elements.createEventManager(this);

    this._dialogOptions = {
        autoOpen: false,
        resizeable: false,
        draggable: false
    };
};

sis.ajui.windows.Abstract.prototype = {
	getEventManager: function() {
		return this._eventManager;
	},

    _prepareRender: function () {
        this._rootNode = $('<div />').addClass('adminjui-inline-window');
    
        $('body').append(this._rootNode);

        this._rootNode.dialog(this._dialogOptions).parent().draggable();
        
        this._rootNode.parent().find('.ui-dialog-title')
            .after($('<div />').addClass('ui-dialog-titlebar-overlay'));
    },
    
    render: function () {
        if (this._rootNode === null) {
            this._prepareRender();
        }

        this._rootNode.dialog('option', 'title', this._title);

        if (this._width > 0) {
            this._rootNode.dialog('option', 'width', this._width);
        }
        
        if (this._height > 0) {
            this._rootNode.dialog('option', 'height', this._height);
        }

		this.getEventManager().getType('render').trigger();
        
        return this;
    },
    
    show: function () {
        this.render();
        
        this._rootNode.parent().fadeIn('fast', function () {
            this._rootNode.dialog('open');
        }.bind(this));

		this.getEventManager().getType('show').trigger();
        
        return this;
    },
    
    hide: function () {
        this._rootNode.parent().fadeOut('fast', function () {
            this._rootNode.dialog('close');
        }.bind(this));
        
		this.getEventManager().getType('hide').trigger();
		
        return this;
    },
    
    getWidth: function () {
         // TODO: read real with
        return this._width;
    },
    
    setWidth: function (width) {
        this._width = width;
        
        this.render();
        
        return this;
    },
    
    getHeight: function () {
        return this._height;
    },
    
    setHeight: function (height) {
        this._height = height;
        
        this.render();
        
        return this;
    },
    
    getTitle: function () {
        return this._title;
    },
    
    setTitle: function (title) {
        this._title = title;
        
        this.render();
        
        return this;
    },
    
    moveTo: function (x, y) {
//       this._rootNode.parent().css({left: x, top: y});
        this._rootNode.dialog('option', 'position', [x, y]);

       return this;
    },
    
    getContent: function () {
        return this._rootNode.html();
    },
    
    setContent: function (content) {
        this.render();
        
        this._rootNode.append(content.getHtmlNode());
        
        return this;
    },
    
    getForm: function () {
        return this._form;
    },
    
    /**
     * this is for smart domain solutions
     * form is a sis.ajui.desktop.Form
     * 
     * if a toolbox is bound to a form and window, we need to blur
     * as soon as the windows collapses or blurs out.
     */
    setForm: function (form) {
        this._form = form;
        
        form.getEventManager().observe('window.attach', function () {
            var evMgr = form.getWindow().getEventManager();
            var close = function () {
                this.hide();
            }.bind(this);
            
            evMgr.observe('close', close);
            evMgr.observe('blur', close);
        }.bind(this));
        
		this.getEventManager().getType('hierachy-changed').trigger();
        
        return this;
    }
};

})();