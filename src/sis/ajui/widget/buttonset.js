/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function AdminJUI_ButtonSet() {
	AdminJUI_Box.call(this);

	this._className = 'ButtonSet';
	this._allowedChildrenClasses = ['Button', 'Link', 'Label']; // TODO: make css for labels
}

AdminJUI_ButtonSet.prototype = CloneObject(AdminJUI_Box.prototype);

AdminJUI_Elements.registerElementClass('buttonset', AdminJUI_ButtonSet);
