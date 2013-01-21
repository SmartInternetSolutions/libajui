/**
 * (c) 2010 - 2013 Smart Internet Solutions UG (haftungsbeschraenkt)
 */

// declare sis namespace
if (typeof(sis) === 'undefined') {
	var sis = {};
}

// add libajui sub namespace
sis.ajui = {
    // constants
    VERSION: '1.0.0.%__DATE_COMPILE_SHORT%',

    // sub namespaces for all widgets
    // this will be filled later by sis.ajui.Elements.registerElementClass
    widget: {}
};
