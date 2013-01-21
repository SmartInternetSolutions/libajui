
function ObjectToArray(obj) {
	var arr = new Array();
	
	for(var key in obj) {
		arr[key] = obj[key];
	}

	return arr;
}

function ObjectToSimpleArray(obj) {
	var arr = new Array();

	for(var key in obj) {
		arr.push(obj[key]);
	}

	return arr;
}

function ObjectToHashMapArray(obj) {
	var arr = new Array();

	for(var key in obj) {
		arr.push({
				key: key,
				value: obj[key]
			}
		);
	}

	return arr;
}

// taken from http://oranlooney.com/functional-javascript/
function CloneObject(obj) {
	// A clone of an object is an empty object
	// with a prototype reference to the original.

    // a private constructor, used only by this one clone.

	function Clone() {}
    Clone.prototype = obj;
	
    var c = new Clone();
	c.constructor = Clone;
	return c;
}

function ClearSelection() {
	var sel = null;
	if(document.selection && document.selection.empty){
		document.selection.empty() ;
	} else if(window.getSelection) {
		sel=window.getSelection();
		if(sel && sel.removeAllRanges)
			sel.removeAllRanges();
	}
}

// Example can be run directly in your JavaScript console
// Function.prototype.bind polyfill
// taken from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if ( !Function.prototype.bind ) {

  Function.prototype.bind = function( obj ) {
    var slice = [].slice,
        args = slice.call(arguments, 1),
        self = this,
        nop = function () {},
        bound = function () {
          return self.apply( this instanceof nop ? this : ( obj || {} ),
                              args.concat( slice.call(arguments) ) );
        };

    nop.prototype = self.prototype;

    bound.prototype = new nop();

    return bound;
  };
}

// source: http://james.padolsey.com/javascript/sorting-elements-with-jquery/
jQuery.fn.sortElements = (function(){
	 
    var sort = [].sort;
 
    return function(comparator, getSortable) {
 
        getSortable = getSortable || function(){return this;};
 
        var placements = this.map(function(){
 
            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
 
                // Since the element itself will change position, we have
                // to have some way of storing its original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );
 
            return function() {
 
                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }
 
                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);
 
            };
 
        });
 
        return sort.call(this, comparator).each(function(i){
            placements[i].call(getSortable.call(this));
        });
 
    };
 
})();