/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function AdminJUI_Tagfield() {
	AdminJUI_FormElement.call(this);

	this._className = 'Tagfield';
	this._allowedChildrenClasses = [];

	this._inputField = $('<input />');

	this._editContainer = $('<div/>').addClass('adminjui-tools-tagfield-editor-container');
}

AdminJUI_Tagfield.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_Elements.registerElementClass('tagfield', AdminJUI_Tagfield);
