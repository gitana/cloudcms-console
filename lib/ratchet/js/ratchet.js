/*!
Ratchet Version 1.0.2

Copyright 2012 Gitana Software, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 

You may obtain a copy of the License at 
	http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License. 

For more information, please contact Gitana Software, Inc. at this
address:

  info@gitanasoftware.com
*/

/*
	Base.js, version 1.1a
	Copyright 2006-2010, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

var Base = function() {
	// dummy
};

Base.extend = function(_instance, _static) { // subclass
	var extend = Base.prototype.extend;
	
	// build the prototype
	Base._prototyping = true;
	var proto = new this;
	extend.call(proto, _instance);
  proto.base = function() {
    // call this method from any other method to invoke that method's ancestor
  };
	delete Base._prototyping;
	
	// create the wrapper for the constructor function
	//var constructor = proto.constructor.valueOf(); //-dean
	var constructor = proto.constructor;
	var klass = proto.constructor = function() {
		if (!Base._prototyping) {
			if (this._constructing || this.constructor == klass) { // instantiation
				this._constructing = true;
				constructor.apply(this, arguments);
				delete this._constructing;
			} else if (arguments[0] != null) { // casting
				return (arguments[0].extend || extend).call(arguments[0], proto);
			}
		}
	};
	
	// build the class interface
	klass.ancestor = this;
	klass.extend = this.extend;
	klass.forEach = this.forEach;
	klass.implement = this.implement;
	klass.prototype = proto;
	klass.toString = this.toString;
	klass.valueOf = function(type) {
		//return (type == "object") ? klass : constructor; //-dean
		return (type == "object") ? klass : constructor.valueOf();
	};
	extend.call(klass, _static);
	// class initialisation
	if (typeof klass.init == "function") klass.init();
	return klass;
};

Base.prototype = {	
	extend: function(source, value) {
		if (arguments.length > 1) { // extending with a name/value pair
			var ancestor = this[source];
			if (ancestor && (typeof value == "function") && // overriding a method?
				// the valueOf() comparison is to avoid circular references
				(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
				/\bbase\b/.test(value)) {
				// get the underlying method
				var method = value.valueOf();
				// override
				value = function() {
					var previous = this.base || Base.prototype.base;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				// point to the underlying method
				value.valueOf = function(type) {
					return (type == "object") ? value : method;
				};
				value.toString = Base.toString;
			}
			this[source] = value;
		} else if (source) { // extending with an object literal
			var extend = Base.prototype.extend;
			// if this object has a customised extend method then use it
			if (!Base._prototyping && typeof this != "function") {
				extend = this.extend || extend;
			}
			var proto = {toSource: null};
			// do the "toString" and other methods manually
			var hidden = ["constructor", "toString", "valueOf"];
			// if we are prototyping then include the constructor
			var i = Base._prototyping ? 0 : 1;
			while (key = hidden[i++]) {
				if (source[key] != proto[key]) {
					extend.call(this, key, source[key]);

				}
			}
			// copy each of the source object's properties to this object
			for (var key in source) {
				if (!proto[key]) extend.call(this, key, source[key]);
			}
		}
		return this;
	}
};

// initialise
Base = Base.extend({
	constructor: function() {
		this.extend(arguments[0]);
	}
}, {
	ancestor: Object,
	version: "1.1",
	
	forEach: function(object, block, context) {
		for (var key in object) {
			if (this.prototype[key] === undefined) {
				block.call(context, object[key], key, object);
			}
		}
	},
		
	implement: function() {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "function") {
				// if it's a function, call it
				arguments[i](this.prototype);
			} else {
				// add the interface using the extend method
				this.prototype.extend(arguments[i]);
			}
		}
		return this;
	},
	
	toString: function() {
		return String(this.valueOf());
	}
});
/*
    http://www.JSON.org/json2.js
    2010-08-25

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
/*
 * jQuery history plugin
 *
 * The MIT License
 *
 * Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
 * Copyright (c) 2010 Takayuki Miwa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($) {
    var locationWrapper = {
        put: function(hash, win) {
            (win || window).location.hash = this.encoder(hash);
        },
        get: function(win) {
            var hash = ((win || window).location.hash).replace(/^#/, '');
            try {
                return $.browser.mozilla ? hash : decodeURIComponent(hash);
            }
            catch (error) {
                return hash;
            }
        },
        encoder: encodeURIComponent
    };

    var iframeWrapper = {
        id: "__jQuery_history",
        init: function() {
            var html = '<iframe id="'+ this.id +'" style="display:none" src="javascript:false;" />';
            $("body").prepend(html);
            return this;
        },
        _document: function() {
            return $("#"+ this.id)[0].contentWindow.document;
        },
        put: function(hash) {
            var doc = this._document();
            doc.open();
            doc.close();
            locationWrapper.put(hash, doc);
        },
        get: function() {
            return locationWrapper.get(this._document());
        }
    };

    function initObjects(options) {
        options = $.extend({
                unescape: false
            }, options || {});

        locationWrapper.encoder = encoder(options.unescape);

        function encoder(unescape_) {
            if(unescape_ === true) {
                return function(hash){ return hash; };
            }
            if(typeof unescape_ == "string" &&
               (unescape_ = partialDecoder(unescape_.split("")))
               || typeof unescape_ == "function") {
                return function(hash) { return unescape_(encodeURIComponent(hash)); };
            }
            return encodeURIComponent;
        }

        function partialDecoder(chars) {
            var re = new RegExp($.map(chars, encodeURIComponent).join("|"), "ig");
            return function(enc) { return enc.replace(re, decodeURIComponent); };
        }
    }

    var implementations = {};

    implementations.base = {
        callback: undefined,
        type: undefined,

        check: function() {},
        load:  function(hash) {},
        init:  function(callback, options) {
            initObjects(options);
            self.callback = callback;
            self._options = options;
            self._init();
        },

        _init: function() {},
        _options: {}
    };

    implementations.timer = {
        _appState: undefined,
        _init: function() {
            var current_hash = locationWrapper.get();
            self._appState = current_hash;
            self.callback(current_hash);
            setInterval(self.check, 100);
        },
        check: function() {
            var current_hash = locationWrapper.get();
            if(current_hash != self._appState) {
                self._appState = current_hash;
                self.callback(current_hash);
            }
        },
        load: function(hash) {
            if(hash != self._appState) {
                locationWrapper.put(hash);
                self._appState = hash;
                self.callback(hash);
            }
        }
    };

    implementations.iframeTimer = {
        _appState: undefined,
        _init: function() {
            var current_hash = locationWrapper.get();
            self._appState = current_hash;
            iframeWrapper.init().put(current_hash);
            self.callback(current_hash);
            setInterval(self.check, 100);
        },
        check: function() {
            var iframe_hash = iframeWrapper.get(),
                location_hash = locationWrapper.get();

            if (location_hash != iframe_hash) {
                if (location_hash == self._appState) {    // user used Back or Forward button
                    self._appState = iframe_hash;
                    locationWrapper.put(iframe_hash);
                    self.callback(iframe_hash);
                } else {                              // user loaded new bookmark
                    self._appState = location_hash;
                    iframeWrapper.put(location_hash);
                    self.callback(location_hash);
                }
            }
        },
        load: function(hash) {
            if(hash != self._appState) {
                locationWrapper.put(hash);
                iframeWrapper.put(hash);
                self._appState = hash;
                self.callback(hash);
            }
        }
    };

    implementations.hashchangeEvent = {
        _init: function() {
            self.callback(locationWrapper.get());
            $(window).bind('hashchange', self.check);
        },
        check: function() {
            self.callback(locationWrapper.get());
        },
        load: function(hash) {
            locationWrapper.put(hash);
        }
    };

    var self = $.extend({}, implementations.base);

    if($.browser.msie && ($.browser.version < 8 || document.documentMode < 8)) {
        self.type = 'iframeTimer';
    } else if("onhashchange" in window) {
        self.type = 'hashchangeEvent';
    } else {
        self.type = 'timer';
    }

    $.extend(self, implementations[self.type]);
    $.history = self;
})(jQuery);
/**
 * Copyright (c) 2010 Maxim Vasiliev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author Maxim Vasiliev
 * Date: 09.09.2010
 * Time: 19:02:33
 */

(function()
{
	/**
	 * Returns form values represented as Javascript object
	 * "name" attribute defines structure of resulting object
	 *
	 * @param rootNode {Element|String} root form element (or it's id)
	 * @param delimiter {String} structure parts delimiter defaults to '.'
	 */
	window.form2object = function(rootNode, delimiter)
	{
		rootNode = typeof rootNode == 'string' ? document.getElementById(rootNode) : rootNode;
		delimiter = delimiter || '.';
		var formValues = getFormValues(rootNode);
		var result = {};
		var arrays = {};

		for (var i = 0; i < formValues.length; i++)
		{
			var value = formValues[i].value;
			if (value === '') continue;

			var name = formValues[i].name;
			var nameParts = name.split(delimiter);

			var currResult = result;

			for (var j = 0; j < nameParts.length; j++)
			{
				var namePart = nameParts[j];

				var arrName;

				if (namePart.indexOf('[]') > -1 && j == nameParts.length - 1)
				{
					arrName = namePart.substr(0, namePart.indexOf('['));

					if (!currResult[arrName]) currResult[arrName] = [];
					currResult[arrName].push(value);
				}
				else
				{
					if (namePart.indexOf('[') > -1)
					{
						arrName = namePart.substr(0, namePart.indexOf('['));
						var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, '');

						/*
						 * Because arrIdx in field name can be not zero-based and step can be
						 * other than 1, we can't use them in target array directly.
						 * Instead we're making a hash where key is arrIdx and value is a reference to
						 * added array element
						 */

						if (!arrays[arrName]) arrays[arrName] = {};
						if (!currResult[arrName]) currResult[arrName] = [];

						if (j == nameParts.length - 1)
						{
							currResult[arrName].push(value);
						}
						else
						{
							if (!arrays[arrName][arrIdx])
							{
								currResult[arrName].push({});
								arrays[arrName][arrIdx] = currResult[arrName][currResult[arrName].length - 1];
							}
						}

						currResult = arrays[arrName][arrIdx];
					}
					else
					{
						if (j < nameParts.length - 1) /* Not the last part of name - means object */
						{
							if (!currResult[namePart]) currResult[namePart] = {};
							currResult = currResult[namePart];
						}
						else
						{
							currResult[namePart] = value;
						}
					}
				}
			}
		}

		return result;
	};

	function getFormValues(rootNode)
	{
		var result = [];
		var currentNode = rootNode.firstChild;

		while (currentNode)
		{
			if (currentNode.nodeName.match(/INPUT|SELECT|TEXTAREA/i))
			{
				result.push({ name: currentNode.name, value: getFieldValue(currentNode)});
			}
			else
			{
				var subresult = getFormValues(currentNode);
				result = result.concat(subresult);
			}

			currentNode = currentNode.nextSibling;
		}

		return result;
	}

	function getFieldValue(fieldNode)
	{
		if (fieldNode.nodeName == 'INPUT')
		{
			if (fieldNode.type.toLowerCase() == 'radio' || fieldNode.type.toLowerCase() == 'checkbox')
			{
				if (fieldNode.checked)
				{
					return fieldNode.value;
				}
			}
			else
			{
				if (!fieldNode.type.toLowerCase().match(/button|reset|submit|image/i))
				{
					return fieldNode.value;
				}
			}
		}
		else
		{
			if (fieldNode.nodeName == 'TEXTAREA')
			{
				return fieldNode.innerHTML;
			}
			else
			{
				if (fieldNode.nodeName == 'SELECT')
				{
					return getSelectedOptionValue(fieldNode);
				}
			}
		}

		return '';
	}

	function getSelectedOptionValue(selectNode)
	{
		var multiple = selectNode.multiple;
		if (!multiple) return selectNode.value;

		var result = [];
		for (var options = selectNode.getElementsByTagName("option"), i = 0, l = options.length; i < l; i++)
		{
			if (options[i].selected) result.push(options[i].value);
		}

		return result;
	}

	/**
	 * @deprecated Use form2object() instead
	 * @param rootNode
	 * @param delimiter
	 */
	window.form2json = window.form2object;

})();(function($)
{
    Ratchet = Base.extend(
    {
        /**
         * The default URI that gets dispatched on an initial empty run() call.
         */
        DEFAULT_URI: "/",

        /**
         * Instantiates a ratchet.
         *
         * The ratchet will render into the given dom element.  If no dom element is provided, the document body
         * will be assumed.
         *
         * If a function is provided, it will be invoked post-constructor to allow for any setup or configuration
         * of the ratchet.
         *
         * @param [DOMElement|String] container either a dom element or selector into which we will render
         * @param [Object] parent the parent ratchet if any
         * @param [Function] setupFunction setup function
         */
        constructor: function()
        {
            this.base();

            var _this = this;

            // figure out arguments
            var args = Ratchet.makeArray(arguments);

            do
            {
                var arg = args.shift();
                if (arg)
                {
                    if (Ratchet.isArray(arg) && (Ratchet.isNode(arg[0]) || Ratchet.isElement(arg[0])))
                    {
                        this.el = arg[0];
                    }
                    else if (Ratchet.isNode(arg) || Ratchet.isElement(arg))
                    {
                        this.el = arg;
                    }
                    else if (Ratchet.isFunction(arg))
                    {
                        this.setupFunction = arg;
                    }
                    else
                    {
                        this.parent = arg;
                    }
                }

            } while (arg);

            // if no container, assume document body
            if (!this.el)
            {
                this.el = document.body;
            }

            // child ratchets
            this.childRatchets = {};

            // authentication filters
            this.authRequiredPatterns = [];

            // routes
            this.routes = {};

            // ratchet id
            this.id = Ratchet.generateId();

            // gadget bindings: instance, type and strategy
            this.gadgetInstances = [];
            this.gadgetType = null;
            this.gadgetStrategy = null;

            // subscriptions
            this.subscriptions = {};

            // claim the element by marking it with the ratchet id
            $(this.el).attr("ratchet", this.id);

            if (!this.parent)
            {
                this.dispatchCount = 0;
                this.dispatchCompletionCount = 0;
            }

            this.incrementDispatchCount = function() {
                _this.topRatchet().dispatchCount++;
            };
            this.incrementDispatchCompletionCount = function() {
                _this.topRatchet().dispatchCompletionCount++;
            };
            this.isDispatchCompleted = function() {
                return (_this.topRatchet().dispatchCompletionCount == _this.topRatchet().dispatchCount);
            };


            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////


            /**
             * Called with a matcher like: /pages/{page}/components/{component}
             * and text like: /pages/page1/components/component2
             *
             * If there is a match, the collected tokens are populated into the tokens map.
             * It looks like this:
             *
             *   {
             *      "page": "page1",
             *      "component": "component2"
             *   }
             *
             * If there isn't a match, null is returned.
             *
             * @param matcher
             * @param text
             */
            this.executeMatch = function(matcher, text)
            {
                var tokens = {};

                var printDebug = function()
                {
                    //console.log("Matched - pattern: " + matcher + ", text: " + text + ", tokens: " + JSON.stringify(tokens));
                };

                // short cut - **
                if (matcher == "**")
                {
                    // it's a match, pull out wildcard token
                    tokens["**"] = text;
                    printDebug();
                    return tokens;
                }

                // if matcher has no wildcards or tokens...
                if ((matcher.indexOf("{") == -1) && (matcher.indexOf("*") == -1))
                {
                    // if they're equal...
                    if (matcher == text)
                    {
                        // it's a match, no tokens
                        printDebug();
                        return tokens;
                    }
                }

                var array1 = matcher.split("/");
                var array2 = text.split("/");

                // short cut - zero length matches
                if ((array1.length == 0) && (array2.length == 0))
                {
                    printDebug();
                    return tokens;
                }

                do
                {
                    var pattern = array1.shift();
                    var value = array2.shift();

                    var patternEmpty = (Ratchet.isEmpty(pattern) || pattern === "");
                    var valueEmpty = (Ratchet.isEmpty(value) || value === "");

                    // if there are remaining pattern and value elements
                    if (!patternEmpty && !valueEmpty)
                    {
                        if (pattern == "*")
                        {
                            // wildcard - element matches
                        }
                        else if (pattern == "**")
                        {
                            // wildcard - match everything else, so break out
                            tokens["**"] = "/" + [].concat(value, array2).join("/");
                            break;
                        }
                        else if (Ratchet.startsWith(pattern, "{"))
                        {
                            // token, assume match, pull into token map
                            var key = pattern.substring(1, pattern.length - 1);
                            tokens[key] = value;
                        }
                        else
                        {
                            // check for exact match
                            if (pattern == value)
                            {
                                // exact match
                            }
                            else
                            {
                                // not a match, thus fail
                                return null;
                            }
                        }
                    }
                    else
                    {
                        // if we expected a pattern but empty value or we have a value but no pattern
                        // then it is a mismatch
                        if ((pattern && valueEmpty) || (patternEmpty && value))
                        {
                            return null;
                        }
                    }
                }
                while (!Ratchet.isEmpty(pattern) && !Ratchet.isEmpty(value));

                printDebug();
                return tokens;
            };

            /**
             * Finds a matching handler method for a given dispatch context
             *
             * @param context
             */
            this.findHandler = function(context)
            {
                var handler = null;

                // walk through the routes and find one that matches this URI and method
                var tokens = null;
                var discoveredHandler = null;
                for (var routeId in _this.routes)
                {
                    var route = _this.routes[routeId];
                    if (route.method == context.route.method)
                    {
                        tokens = _this.executeMatch(route.uri, context.route.uri);
                        if (tokens)
                        {
                            discoveredHandler = route.handler;
                            break;
                        }
                    }
                }

                // find a matching handler method
                if (discoveredHandler)
                {
                    // create an invocation context
                    // this is a copy of the original context which will be used by the handler
                    //var invocationContext = new Ratchet.RenderContext(this, context.route, null, context.params);
                    var invocationContext = new Ratchet.RenderContext(this, context.route, null, context.params);
                    Ratchet.copyInto(invocationContext.model, context.model);
                    invocationContext.tokens = tokens;

                    // wrap the handler into a closure (convenience function)
                    handler = function(invocationContext)
                    {
                        return function()
                        {
                            discoveredHandler.call(discoveredHandler, invocationContext, invocationContext.route.data);
                        };
                    }(invocationContext);
                }
                else
                {
                    // no matching route found
                    // fire no-match custom event
                    $('body').trigger('no-match', [context]);
                    //console.log('Trigger event for ' + context.route.uri);

                    // create an invocation context that assumes the current dom is just fine
                    var invocationContext = new Ratchet.RenderContext(this, context.route, this.el);
                    Ratchet.copyInto(invocationContext.model, context.model);

                    // manually swap
                    // NOTE: this calls "processGadgets" for us
                    invocationContext.swap();
                }

                return handler;
            };

            /**
             * @return the top most ratchet instance in the parent chain
             */
            this.topRatchet = function()
            {
                var ratchet = this;
                while (ratchet.parent)
                {
                    ratchet = ratchet.parent;
                }

                return ratchet;
            };

            // init
            this.init();
        },

        /**
         * The init method is called once when the dispatcher is started up.
         */
        init: function()
        {
            var _this = this;

            // history support
            // NOTE: only for the top-most dispatcher
            if (!this.parent)
            {
                $.history.init(function(hash) {

                    if(hash == "")
                    {
                        // TODO: assume any default dispatching?
                        // i.e.
                        // hash = "/";
                    }

                    if (hash != "")
                    {
                        // restore the state from hash
                        _this.dispatch({
                            "method": "GET",
                            "uri": "#" + hash
                        });
                    }
                },{
                    unescape: ",/#"
                });
            }
        },

        /**
         * The setup function is called prior to the dispatch() method being invoked.
         * It is the inverse of the teardown method.
         */
        setup: function()
        {
            // invoke setup function
            if (this.setupFunction)
            {
                this.setupFunction.call(this);
            }


            // if the current element being set up is a "<region>" tag, then we instantly convert it to a proper DOM tag
            if ($(this.el)[0].nodeName.toLowerCase() == "region")
            {
                this.el = Ratchet.convertRegionTag(this.el);
            }

            // if the current element being set up is a "<gadget>" tag, then we instantly convert it to a proper DOM tag
            if ($(this.el)[0].nodeName.toLowerCase() == "gadget")
            {
                this.el = Ratchet.convertGadgetTag(this.el);
            }

            // if we don't have a gadget type, we should check the DOM to see if one is configured on the DOM element
            // to which we are bound
            if (!this.gadgetType)
            {
                this.gadgetType = $(this.el).attr("gadget");
                this.gadgetId = $(this.el).attr("id");
                this.gadgetStrategy = null;
            }

            // if there is a gadget configured for this dom element, boot it up
            if (this.gadgetType)
            {
                this.gadgetInstances = Ratchet.GadgetRegistry.instantiate(this.gadgetType, this.gadgetId, this);
                $.each(this.gadgetInstances, function(x, y) {
                    y.setup.call(y);
                });
            }
        },

        /**
         * Dismantles this ratchet.  Destroys any containers, gadget instances or mappings set up during init.
         */
        teardown: function()
        {
            var _this = this;

            // iterate to tear down any child ratchets
            // destroy all child ratchets
            $.each(this.childRatchets, function(_gadgetId, childRatchet) {
                childRatchet.teardown();
            });

            // delete child ratchets
            $.each(this.childRatchets, function(_gadgetId, childRatchet) {
                delete childRatchet;
            });
            this.childRatchets = {};

            // remove the ratchet id from our dom element
            //$(this.el).removeAttr("ratchet");

            // releases any subscribed observables
            $.each(this.subscriptions, function(callbackKey, observable) {
                observable.unsubscribe(callbackKey);
            });

            // tear down any gadget instances
            $.each(this.gadgetInstances, function(i, gadgetInstance) {
                gadgetInstance.teardown();
            });
            this.gadgetInstances = [];

            // releases any routes
            $.each(this.routes, function(i, route) {
                delete _this.routes[i];
            });
            this.routes = {};
        },

        /**
         * Processes any downstream regions.
         */
        processRegions: function(context, callback)
        {
            var resolver = Ratchet.regionResolver;
            if (!resolver)
            {
                if (Ratchet.isUndefined(Ratchet.DefaultRegionResolver))
                {
                    Ratchet.error("No default region resolver available");
                    return;
                }
                else
                {
                    resolver = new Ratchet.DefaultRegionResolver("default");
                    Ratchet.regionResolver = resolver;
                }

            }

            //
            // find any sub-gadgets defined by tag
            //
            // these are:
            //
            //  <region id="<regionId>"></region>
            //
            $(context.closestDescendants('region')).each(function() {
                Ratchet.convertRegionTag(this);
            });




            //
            // deal with an tagged sub-regions
            //
            // these are:
            //
            //  <div region="<regionId>"></div>
            //
            var regions = {};
            $(context.closestDescendants("[region]")).each(function()
            {
                var regionId = $(this).attr("region");
                regions[regionId] = this;
            });

            // resolve all of these regions
            resolver.resolve.call(resolver, this, regions, function(resolutions) {

                for (var regionId in resolutions)
                {
                    var resolutionArray = resolutions[regionId];
                    for (var z = 0; z < resolutionArray.length; z++)
                    {
                        var resolution = resolutionArray[z];

                        var gadgetType = resolution["type"];
                        var gadgetId = resolution["id"];
                        var attrs = resolution["attrs"];

                        var tag = $("<div gadget='" + gadgetType + "'></div>");
                        $.each(attrs, function(k, v) {
                            tag.attr(k, v);
                        });
                        if (gadgetId)
                        {
                            tag.attr("id", gadgetId);
                        }
                        tag.attr("gadget-strategy", "replace");

                        $(context.closestDescendants("[region=" + regionId + "]")[0]).replaceWith(tag);
                    }
                }

                // fire the callback
                if (callback)
                {
                    callback.call(this);
                }
            })

        },

        /**
         * Processes any downstream gadgets.
         */
        processGadgets: function(context, callback)
        {
            var _this = this;

            //
            // find any sub-gadgets defined by tag
            //
            // these are:
            //
            //  <gadget type="<gadgetType>" [strategy="<strategy>"]></gadget>
            //
            $(context.closestDescendants('gadget')).each(function() {
                Ratchet.convertGadgetTag(this);
            });



            //
            // deal with an tagged sub-gadgets
            //
            // these are:
            //
            //  <div gadget="<gadgetType>"></div>
            //
            var params = {};
            $(context.closestDescendants("[gadget]")).each(function()
            {
                var subGadgetType = $(this).attr("gadget");
                var subGadgetId = $(this).attr("id");
                var subGadgetStrategy = $(this).attr("gadget-strategy");

                // check if we already have a child ratchet for this gadget
                var ratcheted = false;
                var subRatchetId = $(this).attr("ratchet");
                if (subRatchetId)
                {
                    var childRatchet = _this.childRatchets[subRatchetId];
                    if (childRatchet)
                    {
                        // make sure the child ratchet is pointing to our dom element
                        childRatchet.el = this;

                        // make sure our new dom element has the updated ratchet id
                        $(childRatchet.el).attr("ratchet", subRatchetId);

                        ratcheted = true;
                    }
                }

                if (!ratcheted)
                {
                    // instantiate a child ratchet on top of this element
                    childRatchet = new Ratchet($(this), _this, function() {
                        this.gadgetType = subGadgetType;
                        this.gadgetId = subGadgetId;
                        this.gadgetStrategy = subGadgetStrategy;
                    });

                    _this.childRatchets[childRatchet.id] = childRatchet;
                    subRatchetId = childRatchet.id;
                }

                // prepare any params
                params[subRatchetId] = {};
                $.each($(this)[0].attributes, function(i, attrib)
                {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (value)
                    {
                        params[subRatchetId][name] = value;
                    }
                });
            });

            // dispatch the child ratchets
            $.each(_this.childRatchets, function(childRatchetId, childRatchet) {
                //Ratchet.debug("Dispatching child ratchet: " + subGadgetId + " (" + context.route.method + " " + context.route.uri + ")");

                var subParams = params[childRatchetId];

                childRatchet.dispatch(context.route, subParams);
            });

            // fire the callback
            if (callback)
            {
                callback.call(this);
            }
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // ROUTE CREATION METHODS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Registers a GET route.
         *
         * @param [String] uri
         * @param {Function} handler
         * @param [Object] that
         */
        get: function()
        {
            var args = Ratchet.makeArray(arguments);
            if (Ratchet.isFunction(args[0]))
            {
                args.unshift("**");
            }
            args.unshift("GET");

            this.route.apply(this, args);
        },

        /**
         * Registers a POST route.
         *
         * @param [String] uri
         * @param {Function} handler
         * @param [Object] that
         */
        post: function()
        {
            var args = Ratchet.makeArray(arguments);
            if (Ratchet.isFunction(args[0]))
            {
                args.unshift("**");
            }
            args.unshift("POST");

            this.route.apply(this, args);
        },

        /**
         * Registers a PUT route.
         *
         * @param [String] uri
         * @param {Function} handler
         * @param [Object] that
         */
        put: function(uri, handler)
        {
            var args = Ratchet.makeArray(arguments);
            if (Ratchet.isFunction(args[0]))
            {
                args.unshift("**");
            }
            args.unshift("PUT");

            this.route.apply(this, args);
        },

        /**
         * Registers a DELETE route.
         *
         * @param [String] uri
         * @param {Function} handler
         * @param [Object] that
         */
        del: function(uri, handler)
        {
            var args = Ratchet.makeArray(arguments);
            if (Ratchet.isFunction(args[0]))
            {
                args.unshift("**");
            }
            args.unshift("DELETE");

            this.route.apply(this, args);
        },

        /**
         * Registers a route for a gadget.
         *
         * @param {String} method the method to bind to
         * @param [String] uri the uri to bind to (if none, will use "**")
         * @param {Function} handler
         * @param [Object] that
         */
        route: function()
        {
            var method = null;
            var uri = null;
            var handler = null;
            var that = null;

            var args = Ratchet.makeArray(arguments);

            if (args.length == 2)
            {
                method = args.shift();
                uri = "**";
                handler = args.shift();
            }
            else if (args.length == 3)
            {
                method = args.shift();
                uri = args.shift();
                handler = args.shift();
            }
            else if (args.length == 4)
            {
                method = args.shift();
                uri = args.shift();
                handler = args.shift();
                that = args.shift();
            }
            else
            {
                Ratchet.error("Wrong number of arguments");
                return;
            }

            if (!that)
            {
                that = handler;
            }

            // wrap handler in closure
            var func = function(that, handler) {
                return function(el, data) {
                    handler.call(that, el, data);
                };
            }(that, handler);

            var routeId = method + "-" + uri;

            this.routes[routeId] = {
                "uri": uri,
                "method": method,
                "handler": func
            };

            //Ratchet.debug("Mapped gadget handler: " + method + " " + uri);
        },


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DISPATCH SHORTCUT METHODS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Performs a generalized dispatch.
         *
         * Configuration object:
         * {
         *   "uri": <uri>,
         *   "method": <method>,
         *   "data": <any data>
         * }
         *
         * @param config
         */
        dispatch: function(config, params)
        {
            var _this = this;

            // teardown: clean up old observers, routes, gadget instances and the like
            this.teardown();

            // setup: new observers, routes and gadget instances
            this.setup();

            // clean up URI
            if (Ratchet.startsWith(config.uri, "#"))
            {
                config.uri = config.uri.substring(1);
            }

            var context = new Ratchet.RenderContext(this, config, null, params);

            // increment dispatch count
            this.incrementDispatchCount();

            // ensure authentication filter passes
            this.ensureAuthentication.call(this, context, function() {

                // find the controller handler method that matches this uri
                var wrappedHandler = _this.findHandler(context);
                if (wrappedHandler)
                {
                    // invoke the handler
                    wrappedHandler();
                }

            }, function() {

                alert("Authentication failed - not authenticated");

            });
        },

        /**
         * Runs a route.
         *
         * @param [String] method assumes GET
         * @param {String} uri
         * @param [Object] data
         */
        run: function()
        {
            var config = {
                "method": "GET",
                "data": {}
            };

            var args = Ratchet.makeArray(arguments);
            if (args.length == 0)
            {
                uri = window.location.href;
                if (uri.indexOf("#") > -1)
                {
                    uri = uri.substring(uri.indexOf("#") + 1);
                }
                else
                {
                    uri = Ratchet.DEFAULT_URI;
                }
                config.uri = uri;
            }
            else if (args.length == 1)
            {
                config.uri = args.shift();
            }
            else if (args.length == 2)
            {
                var a1 = args.shift();
                var a2 = args.shift();

                if (Ratchet.isString(a2))
                {
                    config.method = a1;
                    config.uri = a2;
                }
                else
                {
                    config.uri = a1;
                    config.data = a2;
                }
            }
            else if (args.length == 3)
            {
                config.method = args.shift();
                config.uri = args.shift();
                config.data = args.shift();
            }

            // if we're the top dispatcher (app scope) and we're doing a get, store onto history
            // this lets the history callback make the dispatch for us
            if (config.method == "GET" && !this.parent)
            {
                $.history.load(config.uri);
            }
            else
            {
                this.dispatch(config);
            }
        },


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // OBSERVABLES HELPER FUNCTIONS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Declares and gets an observable in a given scope.
         * Optionally registers a callback function.
         *
         * @param [String] scope optional scope
         * @param {String} id the variable id
         * @param [String] callbackKey callback key
         * @param [Function] callbackFunction a callback function to fire when the value of this observable changes
         */
        observable: function()
        {
            var scope;
            var id;
            var callbackKey;
            var callbackFunction;

            var args = Ratchet.makeArray(arguments);
            if (args.length == 1)
            {
                scope = "global";
                id = args.shift();
            }
            else if (args.length == 2)
            {
                scope = args.shift();
                id = args.shift();
            }
            else if (args.length == 3)
            {
                scope = "global";
                id = args.shift();
                callbackKey = args.shift();
                callbackFunction = args.shift();
            }
            else if (args.length == 4)
            {
                scope = args.shift();
                id = args.shift();
                callbackKey = args.shift();
                callbackFunction = args.shift();
            }

            var observables = Ratchet.ScopedObservables.get(scope);
            var observable = observables.observable(id);

            // binding a function handler
            if (callbackKey && callbackFunction)
            {
                // subscribe
                observable.subscribe(callbackKey, callbackFunction);

                // remember we subscribed
                this.subscriptions[callbackKey] = observable;
            }

            return observable;
        },

        /**
         * Declares and gets a dependent observable in a given scope
         *
         * @param scope
         * @param id
         * @param func
         */
        dependentObservable: function()
        {
            var scope = null;
            var id = null;
            var func = null;

            var args = Ratchet.makeArray(arguments);
            if (args.length == 2)
            {
                scope = "global";
                id = args.shift();
                func = args.shift();
            }
            else if (args.length == 3)
            {
                scope = args.shift();
                id = args.shift();
                func = args.shift();
            }
            else
            {
                Ratchet.error("Wrong number of arguments");
                return;
            }

            var observables = Ratchet.ScopedObservables.get(scope);

            return observables.dependentObservable(id, func);
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // AUTHENTICATION
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Marks a URI patterns as requiring authentication.  Supports wildcards.
         *
         * @param pattern
         */
        requireAuthentication: function(pattern)
        {
            this.authRequiredPatterns.push(pattern);
        },

        /**
         * @extension_point
         *
         * Plug in authentication modal, fire callback when done.
         *
         * @param context
         * @param successCallback
         * @param failureCallback
         */
        ensureAuthentication: function(context, successCallback, failureCallback)
        {
            var _this = this;

            // short cut
            if (this.authRequiredPatterns.length == 0)
            {
                successCallback();
            }
            else
            {
                // walk the patterns and see if any trip
                var tripped = false;
                for (var i = 0; i < this.authRequiredPatterns.length; i++)
                {
                    var pattern = this.authRequiredPatterns[i];

                    var tokens = this.executeMatch(pattern, context.route.uri);
                    if (tokens)
                    {
                        tripped = true;
                    }
                }

                if (tripped)
                {
                    // we require authentication

                    // if an authenticator instance has been provided, then call it's authenticate() method
                    if (this.authenticator && this.authenticator.authenticate)
                    {
                        this.authenticator.authenticate(context, function() {

                            successCallback();

                        }, function() {

                            failureCallback();

                        });
                    }
                    else
                    {
                        // if an authenticate() method has been provided directly, we can use that
                        this.authenticate.call(_this, context, function() {

                            successCallback();

                        }, function() {

                            failureCallback();

                        });
                    }
                }
                else
                {
                    successCallback();
                }
            }
        },

        /**
         * @extension_point
         *
         * This gets called when a decision is made to challenge the user for authentication.
         * This method should first check whether authentication already exists and if so, just fire the callback.
         *
         * @param context
         * @param successCallback
         * @param failureCallback
         */
        authenticate: function(context, successCallback, failureCallback)
        {
            // default logic, just fire back
            successCallback();
        },


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // SELECTORS AND DOM MANIPULATION
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Selects a subratchet.
         *
         * @param selector
         * @return {*}
         */
        select: function(selector)
        {
            var ratchet = null;

            var parent = this.topRatchet();

            for (var childRatchetId in parent.childRatchets)
            {
                var childRatchet = parent.childRatchets[childRatchetId];
                if (childRatchet.gadgetType == selector)
                {
                    ratchet = childRatchet;
                    break;
                }
            }

            return ratchet;
        },

        hide: function()
        {
            $(this.el).css("display", "none");
        },

        show: function()
        {
            $(this.el).css("display", "block");
        },

        findGadget: function(type, id)
        {
            var instance = null;

            for (var i = 0; i < this.gadgetInstances.length; i++)
            {
                var gi = this.gadgetInstances[i];

                if (gi.type == type && gi.id == id)
                {
                    instance = gi;
                    break;
                }
            }

            return instance;
        }


    });

    /**
     * Converts the current "gadget" tag to a tag-represented version (i.e. <div gadget="<gadget>"/>
     */
    Ratchet.convertGadgetTag = function(domEl)
    {
        var tag = $(domEl).attr("tag");
        if (!tag)
        {
            tag = "div";
        }

        var type = $(domEl).attr("type");

        // build the replacement tag
        var tag = $("<" + tag +" gadget='" + type + "'></" + tag + ">");

        // copy attributes
        $.each($(domEl)[0].attributes, function(index, attr) {
            var name = attr.nodeName;
            var value = attr.nodeValue;

            if (name == "strategy") {
                name = "gadget-strategy";
            }

            if (name == "tag" || name == "type")
            {
                // these don't get copied
            }
            else
            {
                $(tag).attr(name, value);
            }
        });

        // assign temp key
        var tempKey = "temp-" + new Date().getTime();
        $(tag).attr("tempkey", tempKey);

        // copy inner html
        $(tag).html($(domEl).html());

        var parent = $(domEl).parent();

        $(domEl).replaceWith(tag);

        tag = $(parent).children("[tempkey=" + tempKey + "]")[0];
        $(tag).removeAttr("tempkey");

        return tag;
    };

    /**
     * Converts the current "region" tag to a tag-represented version (i.e. <div region="<region>"/>
     */
    Ratchet.convertRegionTag = function(domEl)
    {
        var tag = $(domEl).attr("tag");
        if (!tag)
        {
            tag = "div";
        }

        // convert some region tags to gadgets
        var regionId = $(domEl).attr("id");

        // build the replacement tag
        var tag = $("<" + tag +" region='" + regionId + "'></" + tag + ">");

        // assign temp key
        var tempKey = "temp-" + new Date().getTime();
        $(tag).attr("tempkey", tempKey);

        $.each($(domEl)[0].attributes, function(index, attr) {
            var name = attr.nodeName;
            var value = attr.nodeValue;

            if (name == "tag" || name == "region")
            {
                // these don't get copied
            }
            else
            {
                $(tag).attr(name, value);
            }
        });

        var parent = $(domEl).parent();

        $(domEl).replaceWith(tag);

        tag = $(parent).children("[tempkey=" + tempKey +"]")[0];
        $(tag).removeAttr("tempkey");

        return tag;
    };



    ///////////////////////////////////////////////////////////////////////////////////////////
    //
    // ADDITIONAL NAMESPACES FOR CUSTOM EXTENSIONS
    //
    ///////////////////////////////////////////////////////////////////////////////////////////

    if (typeof Ratchet.Gadgets === "undefined") {
        Ratchet.Gadgets = {};
    }

    if (typeof Ratchet.Pages === "undefined") {
        Ratchet.Pages = {};
    }

    if (typeof Ratchet.Utils === "undefined") {
        Ratchet.Utils = {};
    }

    if (typeof Ratchet.Authenticators === "undefined") {
        Ratchet.Authenticators = {};
    }


})(jQuery);(function()
{
    Ratchet.uniqueIdCounter = 0;

    /**
     * Builds an array from javascript method arguments.
     *
     * @inner
     *
     * @param {arguments} arguments
     *
     * @returns {Array} an array
     */
    Ratchet.makeArray = function(args) {
        return Array.prototype.slice.call(args);
    };

    /**
     * Serializes a object into a JSON string and optionally makes it pretty by indenting.
     *
     * @inner
     *
     * @param {Object} object The javascript object.
     * @param {Boolean} pretty Whether the resulting string should have indentation.
     *
     * @returns {String} string
     */
    Ratchet.stringify = function(object, pretty) {

        var val = null;
        if (pretty)
        {
            val = JSON.stringify(object, null, "  ");
        }
        else
        {
            val = JSON.stringify(object);
        }

        return val;
    };

    /**
     * Determines whether the given argument is a String.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a String
     */
    Ratchet.isString = function( arg ) {
        return (typeof arg == "string");
    };

    /**
     * Determines whether the given argument is a Function.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a Function
     */
    Ratchet.isFunction = function(arg) {
        return Object.prototype.toString.call(arg) === "[object Function]";
    };

    /**
     * Determines whether a bit of text starts with a given prefix.
     *
     * @inner
     *
     * @param {String} text A bit of text.
     * @param {String} prefix The prefix.
     *
     * @returns {Boolean} whether the text starts with the prefix.
     */
    Ratchet.startsWith = function(text, prefix) {
        return text.substr(0, prefix.length) === prefix;
    };

    /**
     * Copies the members of the source object into the target object.
     * This includes both properties and functions from the source object.
     *
     * @inner
     *
     * @param {Object} target Target object.
     * @param {Object} source Source object.
     */
    Ratchet.copyInto = function(target, source) {
        for (var i in source) {
            if (source.hasOwnProperty(i) && !this.isFunction(this[i])) {
                target[i] = source[i];
            }
        }
    };

    Ratchet.isArray = function(obj)
    {
        return obj.push && obj.slice;
    };

    Ratchet.isUndefined = function(obj)
    {
        return (typeof obj == "undefined");
    };

    Ratchet.isEmpty = function(obj)
    {
        return this.isUndefined(obj) || obj == null;
    };

    Ratchet.generateId = function()
    {
        Ratchet.uniqueIdCounter++;
        return "ratchet-" + Ratchet.uniqueIdCounter;
    };

    Ratchet.isNode = function(o)
    {
        return (
                typeof Node === "object" ? o instanceof Node :
                        typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string");
    };

    Ratchet.isElement = function(o)
    {
        return (
                typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                        typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string");
    };

    Ratchet.debug = function(str)
    {
        if (!this.isUndefined(console))
        {
            console.log(str);
        }
    };

    Ratchet.error = function(str)
    {
        if (!this.isUndefined(console))
        {
            console.error(str);
        }
    };

    Ratchet.copyAttributes = function(sourceEl, targetEl)
    {
        for (var a = 0; a < $(sourceEl)[0].attributes.length; a++)
        {
            var key = $(sourceEl)[0].attributes[a].name;
            var value = $(sourceEl)[0].attributes[a].value;

            $(targetEl).attr(key, value);
        }
    };

    Ratchet.params = function()
    {
        var urlParams = {};

        if (window.location.href.indexOf('?') == -1) {
            return urlParams;
        }

        var params = window.location.href.split('?')[1].split("&"), length = params.length, current;

        if (params[ 0 ]) {
            for (var i = 0; i < length; i++) {
                current = params[ i ].split("=");
                current[ 0 ] = decodeURIComponent(current[ 0 ]);
                // allow just a key to turn on a flag, e.g., test.html?noglobals
                current[ 1 ] = current[ 1 ] ? decodeURIComponent(current[ 1 ]) : true;
                urlParams[ current[ 0 ] ] = current[ 1 ];
            }
        }

        return urlParams;
    };

    Ratchet.hashParam = function(paramName)
    {
        var searchString = window.location.href.substring(window.location.href.indexOf("#") + 1);
        var params = searchString.split("&");

        for (i = 0; i < params.length; i++)
        {
            val = params[i].split("=");

            if (val[0] == paramName)
            {
                return unescape(val[1]);
            }
        }

        return null;
    };


})(window);(function($)
{
    Ratchet.Observable = Base.extend(
    {
        constructor: function(scope, id)
        {
            var _this = this;

            this.base();

            this.id = scope + "-" + id;

            //Ratchet.debug("created: " + this.id);

            this.value = null;
            this.subscribers = {};

            // array that contains observable whose value is dependent on our value
            this.dependentOnUs = {};


            // privileged functions

            this.notifySubscribers = function()
            {
                var _this = this;

                $.each(this.subscribers, function(id, handler) {
                    //Ratchet.debug("Notifying subscriber: " + id + " of update to: " + _this.id);
                    handler(_this.value);
                })
            };

            this.notifyDependents = function()
            {
                $.each(this.dependentOnUs, function(key, observer) {
                    //Ratchet.debug("Notifying dependent:  " + key + " of update to: " + _this.id);
                    observer.onDependencyChange();
                });
            };

            // assume null value function
            this.valueFunction = null;
        },

        setValueFunction: function(valueFunction)
        {
            this.valueFunction = valueFunction;
            this.onDependencyChange();
        },

        /**
         * Registers a handler which acts as a subscriber.  When this observable value changes,
         * the handler method is raised.
         *
         * @param f
         */
        subscribe: function(id, handler)
        {
            if (!this.isSubscribed(id))
            {
                this.subscribers[id] = handler;
            }
        },

        unsubscribe: function(id)
        {
            delete this.subscribers[id];
        },

        isSubscribed: function(id)
        {
            return this.subscribers[id];
        },

        markDependentOnUs: function(observable)
        {
            this.dependentOnUs[observable.id] = observable;
        },

        /**
         * Fired when one of our dependents has changed its value.
         */
        onDependencyChange: function()
        {
            var prior = this.get();

            // if we have a value calculation function, fire it
            if (this.valueFunction)
            {
                var current = this.valueFunction();

                // if the value changed, notify
                if (prior != current)
                {
                    this.set(current);
                }
            }
        },

        set: function(value)
        {
            this.value = value;

            // notify all dependents (observers that depend on our value)
            this.notifyDependents();

            // notify all subscribers of the updated value
            this.notifySubscribers();
        },

        get: function(_default)
        {
            var v = this.value;
            if (!v)
            {
                v = _default;
            }
            return v;
        },

        clear: function()
        {
            delete this.value;

            // notify all dependents (observers that depend on our value)
            this.notifyDependents();

            // notify all subscribers of the updated value
            this.notifySubscribers();
        }

    });

})(jQuery);(function($)
{
    /**
     * Collection of observables.
     */
    Ratchet.Observables = Base.extend(
    {
        constructor: function(scope)
        {
            this.base();

            this.scope = scope;

            this.observables = {};
        },

        observable: function(id, initialValue)
        {
            if (!this.observables[id])
            {
                var observable = new Ratchet.Observable(this.scope, id);

                if (initialValue)
                {
                    observable.set(initialValue);
                }

                this.observables[id] = observable;
            }

            // hand back from map
            return this.observables[id];
        },

        dependentObservable: function(id, func)
        {
            var _this = this;

            if (!this.observables[id])
            {
                var observable = this.observable(id);

                // wrap the model
                var m = new Ratchet.Observables(this.scope);
                m.observable = function(x, y)
                {
                    //Ratchet.debug("Observable: " + observable.id + " depends on observable: " + x);
                    var o = _this.observable(x, y);
                    o.markDependentOnUs(observable);

                    return o;
                };

                // create the value function (where "this" = the model)
                var valueFunction = function() {
                    return func.call(m);
                };

                observable.setValueFunction(valueFunction);
            }

            return this.observables[id];
        },

        observables: function()
        {
            return this.observables;
        }

    });

})(jQuery);(function($)
{
    Ratchet.ScopedObservables = {};
    Ratchet.ScopedObservables.map = {};

    Ratchet.ScopedObservables.get = function(scope)
    {
        if (!Ratchet.ScopedObservables.map[scope])
        {
            Ratchet.ScopedObservables.map[scope] = new Ratchet.Observables(scope);
        }

        return Ratchet.ScopedObservables.map[scope];
    };

})(jQuery);
(function($)
{
    Ratchet.RenderContext = Base.extend(
    {
        constructor: function(ratchet, routeContext, domEl, params)
        {
            this.base();

            var container = $("<div></div>");
            if (domEl)
            {
                container.html($(domEl).html());
            }

            // copy container properties into this
            jQuery.extend(this, container, { "route" : routeContext });


            // privileged methods

            this.ratchet = function()
            {
                return ratchet;
            };

            this.topRatchet = function()
            {
                return this.ratchet().topRatchet();
            };

            this._getContainer = function()
            {
                return container;
            };

            // Fix for IE 8
            this.children = function()
            {
                return container.children();
            };

            this.model = {};
            this.params = (params ? params : {});
        },

        swap: function(callback)
        {
            var self = this;

            // process any regions
            self.ratchet().processRegions.call(self.ratchet(), self, function() {

                // process any gadgets

                // dispatcher post-render
                self.ratchet().processGadgets.call(self.ratchet(), self, function () {

                    /*
                    // determine the appropriate merge point
                    // this is either all of the child nodes that we rendered out or if we rendered a single
                    // node with lots of children under it, then we'll use that single node
                    var mergePoint = null;
                    if (self.children().size() == 0)
                    {
                        // there are no dom node children
                        // we assume that there is valid text somewhere in there
                        // use ourselves as a mergepoint so that children get collected in
                        mergePoint = self; //
                    }
                    else
                    {
                        // there is at least one dom element in here...

                        // if multiple, then use self as merge point
                        if (self.children().size() > 1)
                        {
                            mergePoint = self;
                        }
                        else
                        {
                            // otherwise, there is either
                            //   a) stray whitespace text + a dom element
                            //   b) text we want to keep + dom element

                            // get rid of any white space nodes
                            var index = 0;
                            while (index < self[0].childNodes.length)
                            {
                                var current = self[0].childNodes[index];
                                if (current.nodeName == "#text")
                                {
                                    if (current.textContent.trim() == 0)
                                    {
                                        self[0].removeChild(current);
                                    }
                                    else
                                    {
                                        index++;
                                    }
                                }
                                else
                                {
                                    index++;
                                }
                            }


                            // if the DOM element is now FIRST, then use it as merge point
                            if (self[0].childNodes[0].nodeName.toLowerCase() == self.children()[0].nodeName)
                            {
                                // just one child node (which is a dom node), so use it as a merge point
                                mergePoint = self.children()[0];
                            }
                            else
                            {
                                // what remains is text + dom mixture, so add all children
                                mergePoint = self;
                            }

                        }
                    }
                    */

                    var postSwap = function()
                    {
                        // fire post-swap custom event
                        $('body').trigger('swap', [self.ratchet()]);

                        // increment dispatch completion count
                        self.ratchet().incrementDispatchCompletionCount();

                        // fire post-dispatch custom event
                        $('body').trigger('dispatch', [self.ratchet(), self.ratchet().isDispatchCompleted()]);

                        // custom callback
                        if (callback)
                        {
                            callback.call(self);
                        }
                    };


                    //
                    // we support three strategies:
                    //
                    //   "insert" - the rendered nodes become children of the ratchet el
                    //   "replace" - the ratchet el is removed and replaced entirely by rendered nodes
                    //               if there is only one top-child, then it is merged with attributes of the ratchet el
                    //

                    // assume we are going to insert
                    var strategy = this.gadgetStrategy;
                    if (!strategy) {
                        strategy = "insert";
                    }

                    if (strategy == "replace")
                    {
                        // look through the rendered children to see if we can find a merge point
                        // a merge point means that there is just one top-most rendered child
                        // if we find one, then we'll merge attributes from ratchet el to merge point

                        var mergePoint = null;

                        // we must have some DOM children in order for there to be a merge point
                        if (self.children().size() > 0)
                        {
                            // get rid of any white space nodes
                            var index = 0;
                            while (index < self[0].childNodes.length)
                            {
                                var current = self[0].childNodes[index];
                                if (current.nodeName == "#text")
                                {
                                    if (current.textContent.trim() == 0)
                                    {
                                        self[0].removeChild(current);
                                    }
                                    else
                                    {
                                        index++;
                                    }
                                }
                                else
                                {
                                    index++;
                                }
                            }

                            // if the DOM element is now FIRST, then use it as merge point
                            if (self[0].childNodes[0].nodeName.toLowerCase() == self.children()[0].nodeName.toLowerCase())
                            {
                                // just one child node (which is a dom node), so use it as a merge point
                                mergePoint = self.children()[0];
                            }
                        }

                        // if we have a merge point, then we'll remove the ratchet el and fully recreate
                        if (mergePoint)
                        {
                            // use dom type of the mergepoint
                            // but if original is BODY, then we preserve
                            var name = $(mergePoint)[0].nodeName;
                            if ($(self.ratchet().el)[0].nodeName.toLowerCase() == "body")
                            {
                                name = "body";
                            }

                            // target element
                            var newEl = $("<" + name + "></" + name + ">");

                            // copy original attributes to target (such as class and id)
                            var attributes = $(self.ratchet().el).prop("attributes");
                            $.each(attributes, function() {
                                if (this.name == "gadget" || this.name == "gadget-strategy")
                                {
                                    // skip these
                                }
                                else
                                {
                                    $(newEl).attr(this.name, this.value);
                                }
                            });

                            // copy mergepoint attributes to target
                            var attributes = $(mergePoint).prop("attributes");
                            $.each(attributes, function() {
                                $(newEl).attr(this.name, this.value);
                            });

                            // copy mergepoint html to target
                            //$(newEl).html($(mergePoint).html());

                            // copy mergepoint children to target
                            $(newEl).append($(mergePoint)[0].childNodes);

                            // set a temp key so we can look up after replace
                            var tempKey = "tempkey-" + new Date().getTime();
                            $(newEl).attr("tempkey", tempKey);

                            // replace in DOM
                            var parent = $(self.ratchet().el).parent();
                            $(self.ratchet().el).replaceWith(newEl);
                            // now find what we replaced and clean up
                            newEl = $(parent).find("[tempkey=" + tempKey + "]");
                            $(newEl).removeAttr("tempkey");

                            // now update the ratchet "el" reference
                            self.ratchet().el = $(newEl)[0];

                            // all done
                            postSwap();
                            return;
                        }

                        // otherwise, we simply replace the ratchet el with all children
                        // i.e. no merge

                        // replace in DOM
                        $(self.ratchet().el).replaceWith($(self)[0].childNodes);

                        // now update the ratchet "el" reference
                        self.ratchet().el = null;

                        postSwap();
                        return;
                    }


                    // default behavior (insert)

                    // clear the live element
                    $(self.ratchet().el).html("");

                    // append the children from the in-memory swap copy
                    $(self.ratchet().el).append($(self)[0].childNodes);

                    // all done
                    postSwap();
                });
            });
        },

        /**
         * Fetches JSON data from a URL.
         *
         * @param {String} url the url
         * @param [Object] options ajax options
         * @param {Function} successCallback
         * @param [Function] failureCallback
         */
        fetch: function()
        {
            var _this = this;

            var args = Ratchet.makeArray(arguments);

            var url = args.shift();
            var options = null;
            var successCallback = null;
            var failureCallback = null;

            var a1 = args.shift();
            if (Ratchet.isFunction(a1))
            {
                successCallback = a1;
                failureCallback = args.shift();
            }
            else
            {
                options = a1;
                successCallback = args.shift();
                failureCallback = args.shift();
            }

            if (!options)
            {
                options = {};
            }

            var isJson = (url.match(/\.json$/) || options.json);

            $.ajax($.extend({
                "url": url,
                "data": {},
                "dataType": (isJson ? "json" : null),
                "type": "get",
                "success": function(data)
                {
                    if (successCallback)
                    {
                        successCallback.call(successCallback, _this, data);
                    }
                },
                "failure": function(http)
                {
                    if (failureCallback)
                    {
                        failureCallback.call(failureCallback, _this, http);
                    }
                }
            }, options));
        },

        /**
         * Transforms a template at a given URI with the provided model.
         *
         * @param {String} templateIdentifier template (either HTML fragment, URI or a #dom id selector)
         * @param [Object] model data model
         * @param {Function} successCallback
         * @param [Function] failureCallback
         */
        transform: function(templateIdentifier, data, successCallback, failureCallback)
        {
            var _this = this;

            var args = Ratchet.makeArray(arguments);

            var templateIdentifier = args.shift();
            var model = this.model;
            var successCallback = null;
            var failureCallback = null;

            var a1 = args.shift();
            if (Ratchet.isFunction(a1))
            {
                successCallback = a1;
                failureCallback = args.shift();
            }
            else
            {
                data = a1;
                Ratchet.copyInto(model, data);
                successCallback = args.shift();
                failureCallback = args.shift();
            }

            // NOTE: this requires a template engine
            var engine = null;
            if (Ratchet.renditionEngineId)
            {
                engine = Ratchet.TemplateEngineRegistry.find(Ratchet.renditionEngineId);
                if (!engine)
                {
                    Ratchet.error("Unable to find desired rendition engine (Ratchet.renditionEngineId): " + Ratchet.renditionEngineId);
                    return;
                }
            }
            else
            {
                // pick the first thing we find from the registered engines
                var ids = Ratchet.TemplateEngineRegistry.getIds();
                for (var i = 0; i < ids.length; i++)
                {
                    engine = Ratchet.TemplateEngineRegistry.find(ids[i]);
                }

                if (!engine)
                {
                    Ratchet.error("Unable to find a default rendition engine as none are configured");
                    return;
                }
            }

            // determine whether this is HTML, a template URI or a dom element selector (#)
            var renderType = "url"; // assume url
            var renderValue = templateIdentifier;
            var renderCacheKey = null;
            if (templateIdentifier.indexOf("#") == 0) {
                renderType = "selector";
            }
            else if (templateIdentifier.indexOf("<") > -1 || templateIdentifier.indexOf(" ") > -1) {
                renderType = "html";
            }

            // render
            engine.render(_this, renderType, renderValue, renderCacheKey, model, function(el) {

                if (successCallback)
                {
                    successCallback(el);
                }

            }, function(el, http) {

                if (failureCallback)
                {
                    failureCallback(el, http);
                }

            });
        },

        /**
         * Interceptor method that auto-determines the callback key to use in registering the observable
         * based on the gadget id.
         *
         * @param [String] scope optional scope
         * @param {String} id the variable id
         * @param [Function] callbackFunction a callback function to fire when the value of this observable changes
         */
        observable: function()
        {
            var scope;
            var id;
            var callbackFunction;

            var args = Ratchet.makeArray(arguments);
            if (args.length == 1)
            {
                scope = "global";
                id = args.shift();
            }
            else if (args.length == 2)
            {
                var a1 = args.shift();
                var a2 = args.shift();

                if (Ratchet.isFunction(a2))
                {
                    scope = "global";
                    id = a1;
                    callbackFunction = a2;
                }
                else
                {
                    scope = a1;
                    id = a2;
                }
            }
            else if (args.length == 3)
            {
                scope = args.shift();
                id = args.shift();
                callbackFunction = args.shift();
            }

            var callbackKey = this.id;

            return this.ratchet().observable(scope, id, callbackKey, callbackFunction);
        },

        /**
         * Interceptor method that just does a pass thru
         */
        dependentObservable: function()
        {
            return this.ratchet().dependentObservable.apply(this.ratchet(), arguments);
        },

        /**
         * Subscribes to an observable, attaching a handler.
         *
         * @param [String] scope
         * @param {String} id
         * @param {Function} handler
         */
        subscribe: function()
        {
            var args = Ratchet.makeArray(arguments);

            var scope = null;
            var id = null;
            var handler = null;

            if (args.length == 2)
            {
                scope = "global";
                id = args.shift();
                handler = args.shift();
            }
            else
            {
                scope = args.shift();
                id = args.shift();
                handler = args.shift();
            }

            // wrap function in a closure
            var func = function(that) {
                return function() {
                    handler.call(that);
                };
            }(this);

            // register
            this.ratchet().observable(scope, id, func);
        },

        /**
         * Run
         *
         * @param [String] method assumes GET
         * @param {String} uri
         * @param [Object] data
         */
        run: function()
        {
            this.ratchet().run.apply(this.ratchet(), arguments);
        }

    });

})(jQuery);(function($)
{
    Ratchet.Gadget = Base.extend(
    {
        // either (type, _ratchet)
        // or (type, _ratchet, id)
        constructor: function(type, _ratchet, id)
        {
            this.base();

            var _this = this;

            this.type = type;
            this.id = id;

            // if no id, then assume type as id
            if (!this.id)
            {
                this.id = this.type;
            }

            // privileged methods

            this.route = function(uri, method, viewHandler, controllerHandler)
            {
                // special case - "viewHandler" can be a String which identifies a template to execute!
                if (Ratchet.isString(viewHandler))
                {
                    var view = viewHandler;
                    viewHandler = function(context, model)
                    {
                        _this.renderTemplate.call(_this, context, model, view);
                    };
                }
                _ratchet.route(this, uri, method, viewHandler, controllerHandler);
            };

            this.ratchet = function()
            {
                return _ratchet;
            };

            this.topRatchet = function()
            {
                var ratchet = this.ratchet();
                while (ratchet.parent)
                {
                    ratchet = ratchet.parent;
                }

                return ratchet;
            };

            this.getGadgetId = function()
            {
                return this.id;
            };

            this.getGadgetType = function()
            {
                return this.type;
            };

        },

        app: function()
        {
            return this.topRatchet();
        },

        /**
         * @extension_point
         *
         * This method should be overridden and used to register routes and observables and the like.
         */
        setup: function()
        {
        },

        teardown: function()
        {
            // TODO: anything?
        },


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // OBSERVABLES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////


        /**
         * Subscribes to an observable, attaching a handler.
         *
         * @param [String] scope
         * @param {String} id
         * @param {Function} handler
         */
        subscribe: function()
        {
            var args = Ratchet.makeArray(arguments);

            var scope = null;
            var id = null;
            var handler = null;

            if (args.length == 2)
            {
                scope = "global";
                id = args.shift();
                handler = args.shift();
            }
            else
            {
                scope = args.shift();
                id = args.shift();
                handler = args.shift();
            }

            // wrap function in a closure
            var func = function(that) {
                return function() {
                    handler.call(that);
                };
            }(this);

            // register
            this.observable(scope, id, func);
        },

        /**
         * Interceptor method that auto-determines the callback key to use in registering the observable
         * based on the gadget id.
         *
         * @param [String] scope optional scope
         * @param {String} id the variable id
         * @param [Function] callbackFunction a callback function to fire when the value of this observable changes
         */
        observable: function()
        {
            var scope;
            var id;
            var callbackFunction;

            var args = Ratchet.makeArray(arguments);
            if (args.length == 1)
            {
                scope = "global";
                id = args.shift();
            }
            else if (args.length == 2)
            {
                var a1 = args.shift();
                var a2 = args.shift();

                if (Ratchet.isFunction(a2))
                {
                    scope = "global";
                    id = a1;
                    callbackFunction = a2;
                }
                else
                {
                    scope = a1;
                    id = a2;
                }
            }
            else if (args.length == 3)
            {
                scope = args.shift();
                id = args.shift();
                callbackFunction = args.shift();
            }

            var callbackKey = this.ratchet().id + "-" + this.getGadgetId();

            return this.ratchet().observable(scope, id, callbackKey, callbackFunction);
        },

        /**
         * Interceptor method that just does a pass thru
         */
        dependentObservable: function()
        {
            return this.ratchet().dependentObservable.apply(this.ratchet(), arguments);
        },




        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // EVENT HANDLERS - manufacturing methods (produce handlers)
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////


        /**
         * Produces a refresh handler that reloads this gadget with the last
         * dispatched method, uri and data.
         *
         * @param gadget
         * @param route
         */
        refreshHandler: function(el)
        {
            return function(el)
            {
                return function()
                {
                    /**
                     * PROBLEM: the issue is that gadgets are bound to ratchets when they instantiate
                     * They hold this reference to the ratchet and the reference is further passed into the
                     * RenderContext object.
                     *
                     * Thus, when you do something like shown below, this dispatches against the original ratchet().
                     *
                     * However, if someone runs a route() such as when a page runs route "/security" from "/", this
                     * causes the top most ratchet to reload all of its child ratchets and do its whole
                     * process subgadgets thing.
                     *
                     * When it does this, it first tears down any existing ratchets and destroys and gadget instances.
                     * And then it rebuilds everything by walking the [gadget] tags and reinstantiating any gadgets.
                     *
                     * The original reference (hit from below) is bound to the wrong div element.
                     *
                     * Should there be any notion of gadgets not being destroyed until they go off-page?
                     *
                     * --
                     *
                     * the toolbar is originally ratchet-6
                     *
                     * by the time we click through a few pages, the toolbar ratchet has been updated to toolbar-24 or something
                     * however, the el used by the observer is still bound to ratchet-6!
                     *
                     * if things are working correctly, the subscriber should be shut down and re-created against the new
                     * ratchet each time.
                     *
                     * q: is this happening and if so, is it somehow using the old ratchet?  why?
                     *
                     * problem: the old ratchet has an old DOM element that isn't applicable anymore!
                     * so things get written into nowhere/nothingness
                     *
                     *
                     *
                     */
                    el.run(el.route.method, el.route.uri, el.route.data);
                };

            }(el);
        },




        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DISPATCH METHODS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * @param [String] method assumes GET
         * @param {String} uri
         * @param [Object] data
         */
        run: function()
        {
            this.ratchet().run.apply(this.ratchet(), arguments);
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // ROUTE CREATION METHODS
        //
        // NOTE: routes always register with the gadget's ratchet
        // this means that URI routing is always gadget-relative
        //
        //    /a/b/c may mean one thing to gadget #1 and something else to gadget #2
        //
        // NOTE: these methods make sure to wrap the handler in a closure so that "this" is the gadget
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        get: function()
        {
            var array = Ratchet.makeArray(arguments);
            array.push(this);

            this.ratchet().get.apply(this.ratchet(), array);
        },

        post: function()
        {
            var array = Ratchet.makeArray(arguments);
            array.push(this);

            this.ratchet().post.apply(this.ratchet(), array);
        },

        put: function(uri, handler)
        {
            var array = Ratchet.makeArray(arguments);
            array.push(this);

            this.ratchet().put.apply(this.ratchet(), array);
        },

        del: function(uri, handler)
        {
            var array = Ratchet.makeArray(arguments);
            array.push(this);

            this.ratchet().del.apply(this.ratchet(), array);
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // SELECTORS AND DOM MANIPULATION
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        select: function(selector)
        {
            return this.ratchet().select(selector);
        }

    });

})(jQuery);(function($)
{
    Ratchet.GadgetRegistry = {};
    Ratchet.GadgetRegistry.registry = {};

    /**
     * Classifies a gadget implementation class as being of a particular type (i.e. "sidebar").
     *
     * @param type
     * @param classObject
     */
    Ratchet.GadgetRegistry.register = function(type, classObject)
    {
        if(!Ratchet.GadgetRegistry.registry[type])
        {
            Ratchet.GadgetRegistry.registry[type] = [];
        }

        Ratchet.GadgetRegistry.registry[type].push(classObject);

        return classObject;
    };

    /**
     * Instantiates any gadgets for the given gadget type.
     *
     * @param type
     * @param id
     * @param ratchet
     */
    Ratchet.GadgetRegistry.instantiate = function(type, id, ratchet)
    {
        var instances = [];

        var classObjects = Ratchet.GadgetRegistry.registry[type];
        if (classObjects)
        {
            $.each(classObjects, function(index, classObject) {

                var instance = new classObject(type, ratchet, id);
                instances.push(instance);
            });
        }

        // we reverse the list so that defaults appear at the end
        // that way, we can override by URI
        return instances.reverse();
    };

})(jQuery);
(function()
{
    Ratchet.TemplateEngineRegistry = {};
    Ratchet.TemplateEngineRegistry.registry = {};

    /**
     * Registers a template engine.
     *
     * @param id
     * @param engine
     */
    Ratchet.TemplateEngineRegistry.register = function(id, engine)
    {
        Ratchet.TemplateEngineRegistry.registry[id] = engine;
    };

    /**
     * Retrieves a template engine by its id.
     *
     * @param id
     */
    Ratchet.TemplateEngineRegistry.find = function(id)
    {
        return Ratchet.TemplateEngineRegistry.registry[id];
    };

    /**
     * @return array of ids of all of the registered template engines
     */
    Ratchet.TemplateEngineRegistry.getIds = function()
    {
        var ids = [];

        for (var id in Ratchet.TemplateEngineRegistry.registry)
        {
            ids.push(id);
        }

        return ids;
    }

})();
(function($)
{
    // template cache
    if (typeof(Ratchet.TemplateCache) == "undefined") {
        Ratchet.TemplateCache = {};
    }

    Ratchet.BaseTemplateEngine = Base.extend(
    {
        constructor: function(id)
        {
            this.base();

            this.id = id;

            this.cleanMarkup = function(el, html)
            {
                // convert to a dom briefly
                var dom = $(html);

                // if if starts with a script tag, then we strip that out
                if ($(dom).length == 1)
                {
                    if ($(dom)[0].nodeName.toLowerCase() == "script")
                    {
                        html = $(dom).html();
                    }
                }

                return html;
            }
        },

        renderUri: function(el, uri, model, successCallback, failureCallback)
        {
            return this.render(el, "uri", uri, uri, model, successCallback, failureCallback);
        },

        /**
         * Renders a template.
         *
         * @param el
         * @param type either "url", "selector", "html"
         * @param value either the URL, selector string or HTML body
         * @param cacheKey
         * @param model
         * @param successCallback
         * @param failureCallback
         */
        render: function(el, type, value, cacheKey, model, successCallback, failureCallback)
        {
            var self = this;

            var renderCallback = function(err, html)
            {
                if (err) {
                    failureCallback.call(failureCallback, err);
                    return;
                }

                $(el).html("");
                $(el).append(html);

                if (successCallback)
                {
                    successCallback.call(successCallback, el)
                }
            };

            // if they're using a selector, we can pick out the html right here and pass forward
            if (type == "selector" || type == "html")
            {
                var html = value;
                if (type == "selector") {
                    html = $(el).select(value).html();
                }

                this.doRender(el, cacheKey, html, model, renderCallback);
            }
            else if (type == "url" || type == "uri")
            {
                var fileExtension = self.fileExtension();

                var url = value;
                if (url.indexOf("." + fileExtension) == -1) {
                    url += "." + fileExtension;
                }

                $.ajax({
                    "url": url,
                    "dataType": "html",
                    "success": function(html)
                    {
                        // cleanup html
                        html = self.cleanMarkup(el, html);

                        self.doRender(el, cacheKey, html, model, renderCallback);
                    },
                    "failure": function(http)
                    {
                        if (failureCallback)
                        {
                            failureCallback.call(failureCallback, el, http);
                        }
                    }
                });
            }
            else
            {
                failureCallback.call(failureCallback, new Error("Unknown render type: " + type));
            }

        },

        fileExtension: function() {
            return "html";
        },

        /**
         * EXTENSION POINT
         *
         * @param el
         * @param name (used for caching)
         * @param html
         * @param model
         * @param callback
         */
        doRender: function(el, name, html, model, callback)
        {

        }

    });

})(jQuery);(function($) {
    Ratchet.AbstractAuthenticator = Base.extend({

        constructor: function(config)
        {
            this.config = config;
        },

        /**
         * EXTENSION POINT
         */
        init: function()
        {
        },

        /**
         * EXTENSION POINT
         *
         * @param context
         * @param successCallback
         * @param failureCallback
         */
        authenticate: function(context, successCallback, failureCallback)
        {
        },

        /**
         * EXTENSION POINT
         *
         * @param context
         * @param callback
         */
        logout: function(context,callback)
        {
        }
    });

})(jQuery);(function($)
{
    $.ratchet = Ratchet;

    $.fn.ratchet = function(func) {

        // instantate the console on top of the "this" jQuery element
        return new Ratchet(this[0], func);
    };

    /**
     * Used to convert a form into json
     */
    $.fn.serializeObject = function() {
        return window.form2object(this[0]);
    };

    /**
     * Finds the closest child that matches the given selector using a breadth first lookup.
     *
     * @param selector
     */
    /*
    $.fn.closestChild = function(selector) {

		// breadth first search for the first matched node
		if (selector && selector != '')
        {
			var queue = [];
			queue.push(this);
			while(queue.length > 0)
            {
				var node = queue.shift();
				var children = node.children();
				for(var i = 0; i < children.length; ++i)
                {
					var child = $(children[i]);
					if (child.is(selector))
                    {
						return child;
					}

                    queue.push(child);
				}
			}
		}

        // nothing was found
		return $();
	};
	*/

    /**
     * Uses a recursive, breadth first approach to walk the descendants of the current DOM element and
     * find any nodes that are first matches to the given selector.  This produces an array of objects which
     * constitute the first matches on their branches of the dom tree.
     *
     * This method is used to find the "first" [gadget] tags seen by a parent ancestor without traversing down
     * into any child [gadget]s.
     *
     * @param selector
     */
    $.fn.closestDescendants = function(selector) {

        // short cut
        if (!selector || selector == '')
        {
            return $();
        }

        var descendants = [];

        var drill = function(node)
        {
            if (node.is(selector))
            {
                descendants.push(node);
                return;
            }

            // children
            var children = node.children();
            for (var i = 0; i < children.length; i++)
            {
                drill($(children[i]));
            }
        };

        drill(this);

        return $(descendants);
    }


})(jQuery);(function($)
{
    Ratchet.DefaultRegionResolver = Base.extend(
    {
        constructor: function(id)
        {
            this.base();

            this.id = id;
        },

        /**
         * Resolves a region to a gadget.
         *
         * @param context
         * @param regions
         * @param callback
         */
        resolve: function(context, regions, callback)
        {
            var self = this;

            var mappings = Ratchet.regionMappings;
            if (!mappings)
            {
                mappings = {};
            }

            var resolutions = {};

            for (var regionName in regions)
            {
                var gadgetType = mappings[regionName];
                if (gadgetType)
                {
                    var array = [];

                    var resolution = {
                        "type": gadgetType,
                        "attrs": {}
                    };

                    array.push(resolution);

                    resolutions[regionName] = array;
                }
            }

            callback.call(self, resolutions);
        }
    });

})(jQuery);