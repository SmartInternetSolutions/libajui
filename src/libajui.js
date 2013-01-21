/**
 * (c) 2010 - 2013 Smart Internet Solutions UG (haftungsbeschraenkt)
 *     libajui is covered by the GNU LGPL v3.
 */

/*
 * == HOWTO ==
 * do not include this file directly, always include a compiled and minified
 * version created by ajuijsc.php in tools/.
 *
 * the library's classes will be accessible via sis.ajui.*
 *
 * 0. make some changes or leave it as it is.
 * 1. run tools/ajuijsc.php
 * 2. include out/ajui.js
 * 3. enjoy using it
 *
 * all ui widgets need to be created via
 *	sis.ajui.Elements.create('...');
 *
 * You also can use the XML renderer and implement all elements via the
 * ajui-namespace in your XHTML document. Just take a look at tests.
 */

// @include('sis/ajui.js');
// @include('sis/ajui/Elements.js');
// @include('sis/ajui/Utils.js');

// capsule all widget classes. they will be exposed in sis.ajui.widget later
(function ($, jQuery, AdminJUI_Elements, undefined) {
	// include CloneObject and so on
	// @include('core/misc.js');
	
	// @include('sis/ajui/widget/widget.js');
	// @include('sis/ajui/widget/formelement.js');
	// @include('sis/ajui/widget/box.js');
	// @include('sis/ajui/widget/buttons.js');
	// @include('sis/ajui/widget/buttonset.js');
	// @include('sis/ajui/widget/codeeditor.js');
	// @include('sis/ajui/widget/checkbox.js');
	// @include('sis/ajui/widget/datatable.js');
	// @include('sis/ajui/widget/dropdown.js');
	// @include('sis/ajui/widget/hbox.js');
	// @include('sis/ajui/widget/hidden.js');
	// @include('sis/ajui/widget/label.js');
	// @include('sis/ajui/widget/link.js');
	// @include('sis/ajui/widget/multidropdown.js');
	// @include('sis/ajui/widget/patterndesigner.js');
	// @include('sis/ajui/widget/ruler.js');
	// @include('sis/ajui/widget/tab.js');
	// @include('sis/ajui/widget/tabset.js');
	// @include('sis/ajui/widget/tagfield.js');
	// @include('sis/ajui/widget/textarea.js');
	// @include('sis/ajui/widget/textfield.js');
	// @include('sis/ajui/widget/tinymce.js');
	// @include('sis/ajui/widget/treeview.js');
	// @include('sis/ajui/widget/treeview-item.js');
	// @include('sis/ajui/widget/uploadfield.js');
	// @include('sis/ajui/windows/Abstract.js');
	// @include('sis/ajui/windows/ToolBox.js');
})(jQuery, jQuery, sis.ajui.Elements);
