/*
 * text field
 */

function AdminJUI_Textarea() {
	AdminJUI_FormElement.call(this);

	this._className = 'Textarea';
	this._allowedChildrenClasses = [];

	this._inputField = $('<textarea />');
//
//    // one standard convertor: stripping blank paragraphes
//    this._convertors = [{
//        unparse: function (str) {
//            return str;
//        },
//        
//        parse: function (str) {
//            return str.replace(/<p>\s*<\/p>?/g, '');
//        }
//    }];
//
//	this._wysiwyg = true;
//	this._editorInstance = new nicEditor({
//		fullPanel: true,
//		iconsPath: 
//			'nicEditorIcons.gif'
//			/*
//			'data:image/gif;base64,R0lGODlhsAESAPcAAAAAABERESIiIjMzMzNmIndVIkR3IkRERFVVVWZmZnd3d90iIu' + 
//			'4zM7tEEbtVIqp3M91mAO53EcxmM7t3RIhmd+5ERO5EVe5VVf9VVf9mZv9md+53d/93d1WIIlWIRGaIVXe7RGaIZr' + 
//			'uIM7uZM/+qM/' + 'MM4iIRKqIVYi7RIiqVZm7VbuqVZmZd4i7ZsyZVd2ZVe6ZVcyqRMyZZt2ZZt2qZsyqd92qd8' + 
//			'y7d+67ZpnMZt3MVe7MZu7dZv/dZu7MdzNmqjNmuzN3u0R3u5l3iP93iGaZmUSZqlWIu2aIqlWIzFWI3VWZ3WaIzG' + 
//			'aZzHeZzGaI3WaZ3XeZ3VWq3Waq3Xeq3VWq7maq7neq7ma7/4iIiJmZmZmqiLuqmYiqqqqqqru7u/+IiN2qiMy7iN' + 
//			'27iMy7md27me6qiO6qme67mf+7u5nMiLvMmbvdu93MiO7MiN3Mqu7Mqv/Mu+7du8zuu/' + 'uqoiZ3YiqzJmqzI' + 
//			'iq3Zm73aq73Yiq7oi77pm77qq77rvM3YjM7pnd/6rM7rvM7rvd7szMzMzM3czd3d3d3f' + 
//			'/MzO7dzO7d3f/d3f/' + 'zO7u3f/u3czd7szd/93d/93u7t3u/+7u7v/u7u7u/+7/' + '/' + '/' + 'wAAAA' + 
//			'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' + 
//			'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' + 
//			'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' + 
//			'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' + 
//			'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAJoALAAAAACwARIAAAj+ADUJHEiwoM' + 
//			'GDCBMqXMiwocOHECNKnEixosWLGDNq3Mhx4x8qTZKEDCnSTiaGjtDUqIHGUceXMGPKhJgJEB9ANvlQyqgHDxMhQI' + 
//			'IKDSqEyaCZSDEa0nOnqdOndwwlpXmRyqWrWK9OAnkSoaMxNsbAgTNGhgw5U9OqjXjJz1RCgiBB0qkRj9xMmTBhxa' + 
//			'SX0qAmgtYKXqinUtbDlyrdGazJEiODjNIkstjkUqTLciERykQIpKUbbQrCkYFGTo8SJeTAQSOjjGAFsBUkSIAAwY' + 
//			'EDAwQwnunHbVJAgm5S6YrxCCQqfJlgzXSJkt9BQnY3JOSHUMRCWRR4GagFwZeCdy7+Ne2ipryaIkXuKM6YqQ+lTF' + 
//			'c0SbrSB6ElDhweD2SUIQMY/RMlYdllmG0WCSV2iEHHCAOlFAYOJJBQwmlhhDHWBC4RVIgWsH2hRQJaVIJQbLPNVp' + 
//			'ttB2BEookn3rbQFyUqMCJsJdJWm4sFrcgiigb5VoiOtRkEZIspGiQIIXxAAggVx1kxxZNUEKSjjTwOJMRxeil3SV' + 
//			'7NUcIkEAdV4sUXX3iRRUJapJlFJdnJyBYffPg2kB+DuPXFkAhxSFAlbhIUXh7kqZHDoF2kt15Gg+whiXtX7GEfB0' + 
//			'QQkZ9A/GlARAZpEBdREpkcSKBmk1ziSBt0xHDDQGTJQQKEOJSAgwr+IKAAx0oGwXimJt0loJFsNt6WmwABBPCSAt' + 
//			'7t1pucMFECHCTKUtGZFFZYEUV9EwFx3FXK8dUlJVEIAqaQ32niBQIJ/ZjAdmaKGBEfbTlKEHXWRfRhjgb9Sd6gOb' + 
//			'SQA3qH7vlFFlpkgQibAX+h7kGJZrJHfAhlgh8YHGTASKURV6DppttSUuAfpO5wQ1eOyHDGBS+sWmEYIOQAQhhoTF' + 
//			'BrAreOW+RBMFJ52wHbYUStJjTuuBAiQSbEq82+DiBkiURyRG3PVBrEB1x99HEcJVNIscQUeFwsENG4GT2QtVQ4R8' + 
//			'klfTkHSRR6fKvhuQP1eRDQCHjhtkQLazSvlPVeAqj+oC303UIRXdBQgwtoCZRJmpUg4qEWiCiepqaV/BvwmQRnYb' + 
//			'BBmWgAacT9Vaw1RAKK7VwkkBzS8QmWDIQGGhtscIFYY4WxAgor2IDGAwaNS7ltt2J0I24CADuzQX3ssRORXS/UXe' + 
//			'+DRX3JQ5TwQS3yA3htuCCCUIF91FT0McUShCyBR0VgM2F+E+ibbz7aPxiECG2Ma1LIQjIfjKaabMKmSR9USKJRFr' + 
//			'oiSAD9pLcuDMpvKUiBG+TwCDm4YCB3QkQWDgAi2RwgC3ILlyYOxzjH4apxi9NaJjJgKfxw4AIWS0jjVliI+RkkdG' + 
//			'I7kOnosIMRIIEgNYBDGC6wgdFMQAb+cDCCEGdwu9wh4FwJoGBCdnSz6uXmInvoAx/CNpEkavAgTCzaEwuSxa5tkS' + 
//			'CX4INDoie9KDEkelITCCXwQIUlLAESglhCFLjIteoFjyBgo4Ie9RiFPvoxD+0zSBZulAAXJqQSt2EeQsyFrjVBYg' + 
//			'+XYBZBBtGHo0RkkFysVyXykIciIDAFPpDDAuVAA+5koRCZOMAXClGmA2QCO1qAoAKwQ8H5WRCDCrjiQDJxAQ5gAA' + 
//			'McSKEKV9g4QxIEhmb7wg1oOIJDJIEgQFyNhVw2ATQI0QgvKGJBxuWmLAwAAfajyLHGGbWo8WEP7hrIHqi4oyohBB' + 
//			'E42k0YBfKF33VNNwT+8RLD2hlPTdxEepo4Th+eIIXxxfEJ5DvOHvnoxz4CUpaxsaAAAEBRAChSINqp3vzCGKe31U' + 
//			'ZuAqECFEZakD4IwlH1RNE9EYJJgpALPHrLwx1MQFMT+KARPPABDWjwPIHIjZY3S+SPcoarUyoALyfBCyJmCbCDMK' + 
//			'KXvwwmgA6SCRai8iDIPAQXuDCCGMTgC5d4pupkUAPYyeABpGGBEVgwhhrgbpsIcFMlghfLg8jMi8Ej6pwGwVe+Yk' + 
//			'8QfiinGQfCME1oMXj4zNMB5mYQezoRscIqiGPtiJA9sDEiDDvsHRUiCClMYQgOaIADKPA5zQILj4NYKBUa6kc8BH' + 
//			'JPA/H+Am6GtycMasKbAygEu/yQTrgeIJxG2kNg5KXKgWBHkwlMgQlc4IKb8iCnLsiQQN6nBS94gUMK0MIWPvABD2' + 
//			'whtky9mSbgecGhQuYCGcCPBjSAgQpMFXMtvCpWJ+GcP9jhC4r4wgm4AIlMBKEgKanBBFiyGhu84AVhGMME3pA7JQ' + 
//			'okeBeVSGDLeU42qnYjCBiALqUzFUgsQQlDkIAZ4mAGEVMECKlFqoqR2gTX1kqvArBejmAGt9vMr25hSmRMEAlO+R' + 
//			'0AEZpkg5DZUAPnQrcLBanqbDpUiBC0YA1zaEEHvjteEFlXT9m9cgKATJCnpheFFbBABizAgPcmWb5YvUT+FfRoBz' + 
//			'skAQlViLN/vVLNGRw4m2EY8EG0cICXaiF4XC5IE+0YvGBF1iKD/hWwglWuLyYk0YUOFgAMAulIHzqkeoRIpRd9aY' + 
//			'NEQXwihkEEIgADBxCk0oae9NcGEYVM+O3VLcBEi18b2wEcTAARVgj/' + 'HeQjOZ2x8SKqzEHop4hk6EGOIXuIh' + 
//			'bDEA+sYQ2ubgEBDPe+BHSIZz1DhKa8fEKLZYIBFchABcpckSBMAgtISHe6qRCIQGBhzggxCxpsx5oHuKZWskFAdu' + 
//			'IaaA4/5EO1GeBuqIgUSPRBCUoQRAPigNQINODEKR6yxNkgayfQ2qd9rq6eIPLISO6kttvB7bD+CeIHKiCLI4W5yr' + 
//			'HJoAPoOqJfCjEAtPGyhml7utVQsORBEoHe9nbl22FmwGQoYm4sGP3oSIf3QRzxgAqdFUMa8YKiOV3Xi9wTsp1GNK' + 
//			'E5XVFKb33RCfGSuH4laYp6feqMVgjCEf4EB4h61BB4uEGwHoCur7rVsPYbJphg8ZeIlKQzFtjvRh7SKY6d62Y/CN' + 
//			'btTpClNEUEj3CBCCTvFKkwxAB9i7bNCRIFKEiiDpCAwskJkggLCNNwCxC6RQQ0ida3Pit4EStCyvCAAUvX37hPih' + 
//			'53lpYSw70BZqCIELC34hU7wQnRyf1BSj76lxTADW4QgQgWEZEtdODJUqbyQOpYAAVIaAIKl5BEqxOSCBEOvSJ/aE' + 
//			'IQ1s/+9ifhD8qPv/wFY4bQOiD4FMFDFIASlB/4/' + '/' + 'dwTzxxgFUAAuQAO39xBbQAAEYADaN4AQGIESOI' + 
//			'EUWIEWmBEBAQA7'*/
//	});
}

AdminJUI_Textarea.prototype = CloneObject(AdminJUI_FormElement.prototype);

AdminJUI_Textarea.prototype._postprocessHtmlNode = function() {
	var id = AdminJUI_Elements.createAnonymousId();

	// connect label with field
	this._inputField.attr('id', id);
	this._elem_label.attr('for', id);

	this._inputField.addClass('adminjui-form-element');

	this._getInputContainer().append(this._inputField);

//	if (this._wysiwyg) {
//		this.getEventManager().observe('dom-ready', function() {
//			if (this._editorInstance !== null) {
//				try {
//					this._editorInstance.panelInstance(this._inputField.attr('id'));
//				} catch(e) {
//				}
//			}
//		}.bind(this));
//	}
};

AdminJUI_Textarea.prototype._valueChanged = function() {
//	if (!this._wysiwyg) {
		this._inputField.val(this._value);
//	} else {
//		try {
//            var content = this._value;
//
//            for (var key in this._convertors) {
//                content = this._convertors[key].parse.call(this, content);
//            }
//            
//			this._editorInstance.instanceById(this._inputField.attr('id')).setContent(content);
//		} catch(e) {
//		}
//	}
};

AdminJUI_Textarea.prototype.addConvertor = function(anonConvertorObject) {
//    if (
//        typeof(anonConvertorObject.parse) === 'undefined' ||
//        typeof(anonConvertorObject.unparse) === 'undefined'                
//    ) {
//        throw 'Invalid Convertor Object given';
//    }
//    
//    this._convertors.push(anonConvertorObject);
//    
    return this;
};

AdminJUI_Textarea.prototype.getValue = function() {
//    try {
//        if (this._wysiwyg) {
//            var editorContent = this._editorInstance.instanceById(this._inputField.attr('id')).getContent();
//            
//            for (var key in this._convertors) {
//                editorContent = this._convertors[key].unparse.call(this, editorContent);
//            }
//            
//            return editorContent;
//        } else {
            return this._inputField.val();
//        } 
//    } catch (e) {
//        return this._inputField.val();
//    }
    
//    return null;
};

AdminJUI_Textarea.prototype.enableWysiwyg = function() {
//	this._wysiwyg = true;

	return this;
};

AdminJUI_Textarea.prototype.getPanelHeight = function() {
//	if (!this._wysiwyg) {
		return 0;
//	}
//
//	return this.getHtmlNode().find('.nicEdit-panel').height();
};

AdminJUI_Textarea.prototype.getInnerHeight = function() {
//	if (!this._wysiwyg) {
		return this.getHtmlNode().height();
//	}
//
//	return this.getHtmlNode().find('.nicEdit-main').height();
};

AdminJUI_Textarea.prototype.setInnerHeight = function(h) {
//	if (!this._wysiwyg) {
		return this.getHtmlNode().height(h);
//	}
//
//	return this.getHtmlNode().find('.nicEdit-main').height(h);
};

AdminJUI_Textarea.prototype.attachReadmoreConvertor = function () {
//    var READMORE_TAG = '<!-- READMORE -->';
//    
//    this.addConvertor({
//        unparse: function(str) {
//            var readmore = this.getHtmlNode().find('.adminjui-wysiwyg-editor-readmore');
//            var htmlCode = readmore.wrap('<div/>').parent().html();
//            readmore.unwrap();
//            return str.replace(htmlCode, READMORE_TAG);
//        },
//        parse: function(str) {
//            return str.replace(READMORE_TAG, '<p contenteditable="false" class="adminjui-wysiwyg-editor-readmore"><span>Read More Separator</span></p>');
//        }
//    });
//    
//    return this;
};

AdminJUI_Elements.registerElementClass('textarea', AdminJUI_Textarea);
