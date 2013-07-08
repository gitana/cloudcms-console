/*
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


/**
 * UMD wrapper for compatibility with browser, Node and AMD.
 *
 * Based on:
 *   https://github.com/umdjs/umd/blob/master/returnExports.js
 */
(function (root, factory)
{
    if (typeof exports === 'object')
    {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define( ['ratchet/ratchet', 'ratchet/config'], factory);
    }
    else
    {
        // Browser globals
        root["Ratchet.Actions"] = factory();
    }

}(this, function () {

    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    //return {};

    /*!
Ratchet Version 1.0.2

Copyright 2013 Gitana Software, Inc.

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
 Based on Base.js 1.1a (c) 2006-2010, Dean Edwards
 Updated to pass JSHint and converted into a module by Kenneth Powers
 License: http://www.opensource.org/licenses/mit-license.php

 GitHub: https://github.com/KenPowers/Base.js-Module
 */
/*global define:true module:true*/
/*jshint eqeqeq:true*/
(function (name, global, definition) {
//    if (typeof module !== 'undefined') {
//        module.exports = definition();
//    } else if (typeof define !== 'undefined' && typeof define.amd === 'object') {
//        define(definition);
//    } else {
        global[name] = definition();
//    }
})('Base', this, function () {
    // Base Object
    var Base = function () {};

    // Implementation
    Base.extend = function (_instance, _static) { // subclass
        var extend = Base.prototype.extend;
        // build the prototype
        Base._prototyping = true;
        var proto = new this();
        extend.call(proto, _instance);
        proto.base = function () {
            // call this method from any other method to invoke that method's ancestor
        };
        delete Base._prototyping;
        // create the wrapper for the constructor function
        //var constructor = proto.constructor.valueOf(); //-dean
        var constructor = proto.constructor;
        var klass = proto.constructor = function () {
            if (!Base._prototyping) {
                if (this._constructing || this.constructor === klass) { // instantiation
                    this._constructing = true;
                    constructor.apply(this, arguments);
                    delete this._constructing;
                } else if (arguments[0] !== null) { // casting
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
        klass.valueOf = function (type) {
            return (type === 'object') ? klass : constructor.valueOf();
        };
        extend.call(klass, _static);
        // class initialization
        if (typeof klass.init === 'function') klass.init();
        return klass;
    };

    Base.prototype = {
        extend: function (source, value) {
            if (arguments.length > 1) { // extending with a name/value pair
                var ancestor = this[source];
                if (ancestor && (typeof value === 'function') && // overriding a method?
                    // the valueOf() comparison is to avoid circular references
                    (!ancestor.valueOf || ancestor.valueOf() !== value.valueOf()) && /\bbase\b/.test(value)) {
                    // get the underlying method
                    var method = value.valueOf();
                    // override
                    value = function () {
                        var previous = this.base || Base.prototype.base;
                        this.base = ancestor;
                        var returnValue = method.apply(this, arguments);
                        this.base = previous;
                        return returnValue;
                    };
                    // point to the underlying method
                    value.valueOf = function (type) {
                        return (type === 'object') ? value : method;
                    };
                    value.toString = Base.toString;
                }
                this[source] = value;
            } else if (source) { // extending with an object literal
                var extend = Base.prototype.extend;
                // if this object has a customized extend method then use it
                if (!Base._prototyping && typeof this !== 'function') {
                    extend = this.extend || extend;
                }
                var proto = {
                    toSource: null
                };
                // do the "toString" and other methods manually
                var hidden = ['constructor', 'toString', 'valueOf'];
                // if we are prototyping then include the constructor
                for (var i = Base._prototyping ? 0 : 1; i < hidden.length; i++) {
                    var h = hidden[i];
                    if (source[h] !== proto[h])
                        extend.call(this, h, source[h]);
                }
                // copy each of the source object's properties to this object
                for (var key in source) {
                    if (!proto[key]) extend.call(this, key, source[key]);
                }
            }
            return this;
        }
    };

    // initialize
    Base = Base.extend({
        constructor: function () {
            this.extend(arguments[0]);
        }
    }, {
        ancestor: Object,
        version: '1.1',
        forEach: function (object, block, context) {
            for (var key in object) {
                if (this.prototype[key] === undefined) {
                    block.call(context, object[key], key, object);
                }
            }
        },
        implement: function () {
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === 'function') {
                    // if it's a function, call it
                    arguments[i](this.prototype);
                } else {
                    // add the interface using the extend method
                    this.prototype.extend(arguments[i]);
                }
            }
            return this;
        },
        toString: function () {
            return String(this.valueOf());
        }
    });

    // Return Base implementation
    return Base;
});(function() {

    var instances = {};
    var types = {};

    var actionsClass = Base.extend({

        constructor: function()
        {
            this.base();
        },

        /**
         * Registers an action class.
         *
         * @param actionId
         * @param action
         * @param configService optional config service to register against
         */
        register: function(actionId, actionClass, configService)
        {
            types[actionId] = actionClass;
            instances[actionId] = new actionClass(actionId);

            if (!configService)
            {
                configService = Ratchet.Configuration;
            }

            // see if the action has any default config that it'd like to provide
            var actionConfig = instances[actionId].defaultConfiguration();
            if (!actionConfig) {
                actionConfig = {};
            }

            if (!actionConfig.title) {
                actionConfig.title = actionId;
            }
            if (!actionConfig.iconClass) {
                actionConfig.iconClass = "icon-" + actionId;
            }

            // register default config
            var c = {
                "config": {
                    "actions": {}
                }
            };
            c.config.actions[actionId] = actionConfig;
            configService.add(c);

            return types[actionId];
        },

        /**
         * Unregisters an action.
         *
         * @param actionId
         */
        unregister: function(actionId)
        {
            delete types[actionId];
            delete instances[actionId];
        },

        /**
         * Find a single action instance by action id.
         *
         * @param actionId
         */
        findInstance: function(actionId)
        {
            return instances[actionId];
        },

        /**
         * Find a single action class by action id.
         *
         * @param actionId
         * @return {*}
         */
        findType: function(actionId)
        {
            return types[actionId];
        },

        /**
         * Executes the given action.
         *
         * @param actionId
         * @param actionConfig
         * @param actionContext
         * @param callback
         */
        execute: function(actionId, actionConfig, actionContext, callback)
        {
            var action = instances[actionId];
            if (!action)
            {
                Ratchet.logError("Cannot find action for action id: " + actionId);
                throw new Error("Cannot find action for action id: " + actionId);
            }

            action.execute(actionConfig, actionContext, callback);
        },

        /**
         * Retrieves all of the action configurations OR a subset (either a single or an array of action ids).
         *
         * @param actionId
         * @param configService (optional)
         */
        config: function(actionId, configService)
        {
            if (!configService)
            {
                configService = Ratchet.Configuration;
            }

            return configService.evaluate({
                "evaluator": "action",
                "condition": actionId
            });
        }

    });

    Ratchet.Actions = new actionsClass();

    return Ratchet.Actions;

})();
(function() {

    Ratchet.AbstractAction = Base.extend({

        constructor: function(actionId)
        {
            this.base();

            this.id = actionId;

            /**
             * Converts a single item to an array (i.e. item -> [item])
             * If already an array, simple hands back the array.
             *
             * @param data
             */
            this.toArray = function(data)
            {
                var array = [];
                if (Ratchet.isArray(data)) {
                    array = data;
                } else {
                    array.push(data);
                }

                return array;
            };
        },

        /**
         * EXTENSION POINT
         *
         * @return {Object}
         */
        defaultConfiguration: function()
        {
            return {};
        },

        /**
         * EXTENSION POINT
         *
         * @param config
         * @param actionContext
         * @param callback signature is (err, data)
         * @return {Boolean}
         */
        execute: function(config, actionContext, callback)
        {
            callback();
        }

    });

})();(function() {

    Ratchet.AbstractUIAction = Ratchet.AbstractAction.extend({

        constructor: function(actionId)
        {
            this.base(actionId);

            this.modalDiv = null;
            this.okayButtonTitle = "OK";

            this.showMessage = function(title, message, callback)
            {
                if (typeof(message) === "function")
                {
                    callback = message;
                    message = title;
                    title = null;
                }

                Ratchet.startModalConfirm(title, message, this.okayButtonTitle, null, function() {
                    callback();
                }, {
                    "cancel": false
                });
            };

            this.showModal = function(config, callback)
            {
                var self = this;

                if (typeof(config) === "function") {
                    callback = config;
                    config = {};
                }

                if (typeof(config) === "string") {
                    config = {
                        "title": config
                    };
                }

                this.hideModal(function() {

                    if (typeof(config.cancel) === "undefined")
                    {
                        config.cancel = false;
                    }

                    Ratchet.fadeModal(config, function(div, renderCallback) {

                        self.modalDiv = div;

                        callback(div, renderCallback);
                    });
                });
            };

            this.hideModal = function(callback)
            {
                if (!this.modalDiv)
                {
                    callback();
                    return;
                }

                $(this.modalDiv).modal('hide');
                $(this.modalDiv).on('hidden', function() {

                    this.modalDiv = null;

                    callback();
                });
            };

            this.block = function(title, message, callback)
            {
                if (typeof(message) === "function")
                {
                    callback = message;
                    message = title;
                    title = "Please wait...";
                }

                Ratchet.block(title, message, function() {
                    callback();
                });
            };

            this.unblock = function(callback)
            {
                Ratchet.unblock(function() {
                    callback();
                });
            };

            this.showError = function(title, message, callback)
            {
                if (typeof(message) === "function")
                {
                    callback = message;
                    message = title;
                    title = "There was a problem...";
                }

                Ratchet.startModalConfirm(title, message, this.okayButtonTitle, null, function() {
                    callback();
                }, {
                    "cancel": false
                });
            };

        }

    });

})();(function() {

    Ratchet.Actions.register("log", Ratchet.AbstractAction.extend({

        /**
         * Logs data to console.
         *
         * @param config
         * @param actionContext
         * @param callback
         * @return {Boolean}
         */
        execute: function(config, actionContext, callback)
        {
            var data = actionContext.data;

            console.log(JSON.stringify(data));

            callback();
        }

    }));

})();

    return Ratchet.Actions;

}));
