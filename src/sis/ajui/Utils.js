/**
 * (c) 2010 - 2011 Smart Internet Solutions UG (haftungsbeschraenkt)
 */

// theoretically it's waste.
if (typeof(sis) === 'undefined') { var sis = {}; } if (typeof(sis.ajui) === 'undefined') { sis.ajui = {}; }

(function (){
sis.ajui.Utils = function Utils() {
};

/**
 * attaches E-Mail Address validator to textfield 
 * @param elem
 */
sis.ajui.Utils.prototype.attachEmailValidator = function(_elem) {
	_elem.addValidator(function() {
		if (!/^[^@]+@/.test(this.getValue())) {
			throw 'This is not a valid E-Mail address!';
		}
	});
};

// make everything static
sis.ajui.Utils = new sis.ajui.Utils();

})();