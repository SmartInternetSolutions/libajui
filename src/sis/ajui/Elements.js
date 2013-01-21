/**
 * (c) 2010 - 2013 Smart Internet Solutions UG (haftungsbeschraenkt)
 */

/**
 * every class needs to be registered with:
 *  sis.ajui.Elements.registerElementClass('<name>', <class>);
 *
 * every class needs to be instantiate via:
 *  sis.ajui.Elements.create('<name>');
 */

if (typeof(sis) === 'undefined') { var sis = {}; } if (typeof(sis.ajui) === 'undefined') { sis.ajui = {}; }

(function () {
sis.ajui.Elements = function Elements() {
	var _counter = 0;
	var _elementFactory = {};
	var _elementNames = [];

	var that = {
        /**
         * @todo move to own class, remove from elements ns
         */
		createEventManager: function(parent) {
			var __types = {};
            var __parent = parent || _this;

			var __createTypeManager = function() {
				var __hooks = [];

				var _this = {
					add: function(c) {
						__hooks.push = c; //.bind(__element);

						return _this;
					},

					flush: function() {
						__hooks = [];

						return _this;
					},

					remove: function(c) {
						for (var k in __hooks) {
							if (__hooks[k] === c) {
								delete __hooks[k];
								return _this;
							}
						}

						return _this;
					},

					trigger: function(data) {
						for (var k in __hooks) {
							__hooks[k].apply(__parent, [data]);
						}

						return _this;
					}
				};

				return _this;
			};

			var _this = {
				getType: function(type) {
					if (typeof(__types[type]) === 'undefined') {
						__types[type] = new __createTypeManager();
					}

					return __types[type];
				},

				observe: function(type, fnc) {
					return _this.getType(type).add(fnc);
				},

                setParent: function (_parent) {
                    __parent = _parent;

                    return _this;
                }
			};

			return _this;
		},

		addLog: function(msg) {
			AdminJUI.addLog('AdminJUI_Elements: ' + msg);
			return that;
		},

		createAnonymousId: function() {
			return 'anonymous-' + _counter++ + '-' + Math.floor(Math.random() * 100000);
		},

		getRegisteredElementClasses: function() {
			return _elementNames;
		},

		registerElementClass: function(elementName, _Class, abstractClass) {
			if (abstractClass !== true) {
				_elementFactory[elementName] = _Class;
			}

			if (!(elementName in _elementNames)) {
				_elementNames.push(elementName);
			}

			var shortName = _Class.name.replace('AdminJUI_', '');

			// expose in our class tree
			if (shortName !== '') {
				sis.ajui.widget[shortName] = _Class;
			}

			that.addLog('registered \'' + _Class.name + '\' as \'' + elementName + '\'');

			return that;
		},

		create: function(elementName) {
			if (typeof(_elementFactory[elementName]) === 'undefined') {
				throw 'unknown element '  + elementName;
			}

			return new _elementFactory[elementName];
		},

		decorateAjuiXml: function(elem) {
			var container = $('<div />')
				.addClass('ui-dialog')
				.addClass('ui-dialog-content')
				.addClass('ui-widget')
				.addClass('ui-widget-content')
				.addClass('ui-corner-all')
				.addClass('ui-dialog-focus')
				.addClass('ui-dialog-inline');

			elem.addClass('ui-dialog-content');

			container.append(elem.replaceWith(container));
			container.css('display', 'none');

			var tree = that.constructByXml(elem.html());

			elem.html(tree.getHtmlNode());

			tree.getEventManager().getType('dom-ready').trigger();

			container.fadeIn();

			var elements = sis.ajui.widget.FormElement.getNamedChildren(tree);

			elements.validate = tree.validate.bind(tree);

			return {
				node: tree,
				container: container,
				elements: elements
			};
		},

		constructByXml: function(_xml) {
			var xml = $(_xml);
			var that = this;
			var elem = null;

			var name = xml[0].nodeName || xml[0].tagName;

			if (typeof(name) === 'undefined' || name[0] === '#') {
				return null;
			}

			if (name.indexOf(':') !== -1) {
				name = name.split(':').pop();
			}

			name = name.toLowerCase();

			elem = this.create(name);

            var html = xml.html();

            // deprecated: please use label attribute instead.
            if (html && typeof(elem.setLabel) !== 'undefined') {
				elem.setLabel(html);
			}

			// TODO: build automatism
			var attrToAttr = {
				'help-text': 'setHelpText',
				'value': 'setValue',
				'important': 'setImportant',
				'name': 'setName',
				'required': 'setRequired',
				'disabled': 'setDisabled',
				'full-space': 'setFullSpace',
				'href': 'setHref',
				'target': 'setTarget',
				'wysiwyg': 'enableWysiwyg',
				'label': 'setLabel',
				'title': 'setTitle'
			};

			for(var attr in attrToAttr) {
				if (typeof(elem[attrToAttr[attr]]) !== 'undefined' && xml.attr(attr)) {
					elem[attrToAttr[attr]](xml.attr(attr));
				}
			}

			var attrToEvent = {
				'on-change': 'change',
				'on-click': 'click',
				'on-dblclick': 'dblclick',
				'on-mouseover': 'mouseover',
				'on-mouseout': 'mouseout',
				'on-mouseup': 'mouseup',
				'on-mousedown': 'mousedown',
				'on-keypress': 'keypress',
				'on-keydown': 'keydown',
				'on-keyup': 'keyup'
			};

			for(var attr2 in attrToEvent) {
				if (xml.attr(attr2)) {
					elem.getEventManager()
						.observe(attrToEvent[attr2], new Function(xml.attr(attr2)));
				}
			}

			xml.children().each(function() {
				var child = that.constructByXml($(this));

				if (child !== null) {
					elem.addChild(child);
				}
			});

			return elem;
		},

		init: function() {
		}
	};

	return that;
}();
})();