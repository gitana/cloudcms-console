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
        define( ['ratchet/ratchet', 'ratchet/config', 'ratchet/messages', 'ratchet/actions'], factory);
    }
    else
    {
        // Browser globals
        root["Ratchet"] = factory();
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
});/*jshint -W014 */ // bad line breaking
/*jshint -W004 */ // duplicate variables
(function() {

    var MODAL_TEMPLATE = ' \
        <div class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="overflow: visible !important"> \
            <div class="modal-dialog"> \
                <div class="modal-content"> \
                    <div class="modal-header"> \
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                        <h4 class="modal-title"></h4> \
                    </div> \
                    <div class="modal-body"></div> \
                    <div class="modal-footer"></div> \
                </div> \
            </div> \
        </div> \
    ';

    Ratchet.defaultModalFadeClass = "fade";

    Ratchet.blockingModal = null;
    Ratchet.block = function(title, message, configOrAfterShownCallback)
    {
        var config = {};
        if (Ratchet.isFunction(configOrAfterShownCallback)) {
            config.afterShownCallback = configOrAfterShownCallback;
        }
        else if (Ratchet.isObject(configOrAfterShownCallback))
        {
            Ratchet.copyInto(config, configOrAfterShownCallback);
        }

        // if already blocking, then first unblock
        if (Ratchet.blockingModal)
        {
            Ratchet.unblock(function() {
                Ratchet.block(title, message, config);
            });

            return;
        }

        config.title = title;
        if (Ratchet.isUndefined(config.cancel)) {
            config.cancel = true;
        }
        if (Ratchet.isUndefined(config.footer)) {
            config.footer = false;
        }

        Ratchet.showModal(config, function(config) {
            return function(div, cb) {

                $(div).find('.modal-body').html("<div align='center'><div class='modal-please-wait'></div></div><br/><p align='center'>" + message + "<br/><br/></p>");

                cb(function() {

                    // if they click the "close" button, wipe down the Ratchet.blockingModal
                    $(div).find(".close").click(function() {
                        Ratchet.blockingModal = null;
                    });

                    // start the spinner
                    Ratchet.spin($(div).find(".modal-please-wait"));

                    // store div
                    Ratchet.blockingModal = $(div);

                    // after shown
                    if (config.afterShownCallback) {
                        config.afterShownCallback();
                    }
                });
            };
        }(config));
    };

    Ratchet.unblock = function(configOrAfterHiddenCallback)
    {
        var config = {};
        if (Ratchet.isFunction(configOrAfterHiddenCallback)) {
            config.afterHiddenCallback = configOrAfterHiddenCallback;
        }
        else if (Ratchet.isObject(configOrAfterHiddenCallback))
        {
            Ratchet.copyInto(config, configOrAfterHiddenCallback);
        }

        if (Ratchet.blockingModal)
        {
            $(Ratchet.blockingModal).on('hidden.bs.modal', function(config) {
                return function() {
                    Ratchet.blockingModal = null;

                    if (config.afterHiddenCallback)
                    {
                        config.afterHiddenCallback();
                    }
                };
            }(config));
            $(Ratchet.blockingModal).modal('hide');
        }
        else
        {
            config.afterHiddenCallback();
        }
    };

    Ratchet.startModalGadget = function(options, overrides, beforeRatchetCallback, afterRatchetCallback)
    {
        var self = this;

        if (!options) {
            options = {};
        }
        if (Ratchet.isUndefined(options.cancel)) {
            options.cancel = true;
        }
        if (Ratchet.isUndefined(options.title)) {
            options.title = "Unknown Title";
        }
        if (Ratchet.isUndefined(options.completeButtonTitle)) {
            options.completeButtonTitle = "Done";
        }

        Ratchet.showModal(options, function(div, cb) {

            var gadgetType = options.type;
            var gadgetConfiguration = options.config;
            if (!gadgetConfiguration) {
                gadgetConfiguration = {};
            }

            var tempGadgetId = options.id;
            if (!tempGadgetId) {
                tempGadgetId = "gadget-" + new Date().getTime();
            }
            var tempGadgetType = "type-" + new Date().getTime();

            // create an instance of the gadget
            var dynamicGadget = null;
            if (Ratchet.DynamicGadgets) {
                dynamicGadget = Ratchet.DynamicGadgets[gadgetType];
            }
            if (dynamicGadget)
            {
                // instantiate - config is loaded by gadget on configure()
                (function(tempGadgetType, gadgetConfiguration, dynamicGadget) {

                    // using meta-programming, create instances of page controllers
                    Ratchet.GadgetRegistry.register(tempGadgetType, dynamicGadget.extend({

                        setup: function() {
                            this.get("/gadget/" + tempGadgetType, this.index);
                        },

                        configureDefault: function() {
                            this.base();

                            // push page configuration into config service
                            this.config(gadgetConfiguration);
                        }

                    }));

                }(tempGadgetType, gadgetConfiguration, dynamicGadget));
            }
            else
            {
                Ratchet.logError("Cannot start modal for unknown gadget type: " + gadgetType);
                return;
            }

            // attributes
            $(div).find(".modal-body").attr("gadget", tempGadgetType);
            $(div).find(".modal-body").attr("id", tempGadgetId);

            $(div).find('.modal-footer').append("<button class='btn btn-default pull-right complete-button' data-dismiss='modal' aria-hidden='true'>" + options.completeButtonTitle + "</button>");

            // ratchet it up
            var ratchet = new Ratchet($(div).find(".modal-body")[0], options.parent, function() {
            });

            // set up ratchet callback
            if (beforeRatchetCallback)
            {
                beforeRatchetCallback.call(self, div, ratchet);
            }

            // run the ratchet
            ratchet.run("/gadget/" + tempGadgetType);

            if (overrides)
            {
                // get back the gadget bound into the ratchet
                for (var i = 0; i < ratchet.gadgetInstances.length; i++)
                {
                    for (var k in overrides)
                    {
                        ratchet.gadgetInstances[i][k] = overrides[k];
                    }
                }
            }

            // call any custom gadget callbacks (after ratchet callback)
            if (afterRatchetCallback)
            {
                for (var i = 0; i < ratchet.gadgetInstances.length; i++)
                {
                    afterRatchetCallback(div, ratchet, ratchet.gadgetInstances[i]);
                }
            }

            cb();

        });

    };

    Ratchet.confirmDelete = function(title, body, onConfirm)
    {
        Ratchet.startModalConfirm(title, body, "Delete", "btn-danger", function() {
            onConfirm();
        });
    };

    Ratchet.fadeModalConfirm = function(title, body, confirmButtonTitle, confirmButtonClass, onConfirm)
    {
        return Ratchet.startModalConfirm(title, body, confirmButtonTitle, confirmButtonClass, onConfirm, {
            "modalClass": Ratchet.defaultModalFadeClass
        });
    };

    Ratchet.startModalConfirm = function(title, body, confirmButtonTitle, confirmButtonClass, onConfirm, config)
    {
        if (!confirmButtonClass) {
            confirmButtonClass = "btn-default";
        }

        if (!config) {
            config = {};
        }

        if (typeof(config.title) === "undefined")
        {
            config.title = title;
        }
        if (typeof(config.cancel) === "undefined")
        {
            config.cancel = true;
        }

        Ratchet.showModal(config, function(div, cb) {

            $(div).find('.modal-body').html("<p align='center'><br/>" + body + "<br/><br/></p>");
            $(div).find('.modal-footer').append("<button class='btn pull-right confirm-button " + confirmButtonClass + "'>" + confirmButtonTitle + "</button>");

            $(div).find('.confirm-button').click(function() {

                $(div).on('hidden.bs.modal', function() {
                    onConfirm(div);
                });
                $(div).modal('hide');

            });

            cb();
        });
    };

    Ratchet.showModalMessage = function(title, message)
    {
        Ratchet.showModal({
            "title": title,
            "cancel": true
        }, function(div, cb) {
            $(div).find('.modal-body').html("<p align='center'><br/>" + message + "<br/><br/></p>");
            $(div).find('.modal-footer').append("<button class='btn btn-default pull-right' data-dismiss='modal' aria-hidden='true'>Okay</button>");

            cb();
        });
    };

    Ratchet.fadeModalMessage = function(title, message)
    {
        Ratchet.showModal({
            "title": title,
            "cancel": true,
            "modalClass": "fade"
        }, function(div, cb) {
            $(div).find('.modal-body').html("<p align='center'><br/>" + message + "<br/><br/></p>");
            $(div).find('.modal-footer').append("<button class='btn btn-default pull-right' data-dismiss='modal' aria-hidden='true'>Okay</button>");

            cb();
        });
    };

    Ratchet.fadeModal = function(config, setupFunction)
    {
        if (!config) {
            config = {};
        }

        if (!config.modalClass) {
            config.modalClass = Ratchet.defaultModalFadeClass;
        }

        return Ratchet.showModal(config, setupFunction);
    };

    Ratchet.showModal = function(config, setupFunction)
    {
        var self = this;

        if (!config) {
            config = {};
        }

        //Ratchet.unblock();

        if (!setupFunction)
        {
            setupFunction = function(div, callback) {
                callback(null);
            };
        }

        // build modal dom
        var div = $(MODAL_TEMPLATE.trim());

        if (config.modalClass) {
            $(div).addClass(config.modalClass);
        }

        var title = "";
        if (config.title)
        {
            title = config.title;
        }

        // set up title
        $(div).find('.modal-title').html(title);

        // set up footer
        $(div).find('.modal-footer').html("");

        // auto-add cancel button
        if (config.cancel)
        {
            $(div).find('.modal-footer').append("<button class='btn btn-default pull-left' data-dismiss='modal' aria-hidden='true'>Cancel</button>");
        }

        if (typeof(config.footer) === "undefined") {
            config.footer = true;
        }

        if (!config.footer)
        {
            $(div).find(".modal-footer").remove();
        }

        // set up modal
        setupFunction.call(self, div, function(afterShownCallback) {

            if (afterShownCallback) {
                $(div).on("shown.bs.modal", function() {
                    afterShownCallback();
                });
            }

            // launch modal
            var t = $(div).modal({
                "keyboard": true
            });

            /*
            // vertical center
            $(div).on("shown.bs.modal", function() {
                $(div).css({
                    "margin-top": ($(div).outerHeight() / 2)
                });
            });
            */

            if (config.modalClass) {
                t.addClass(config.modalClass);
            }

        });

        return $(div);
    };

    // dynamic gadget types are stored here
    Ratchet.DynamicGadgets = {};
    Ratchet.DynamicRegistry = {
        register: function(type, classObject)
        {
            Ratchet.DynamicGadgets[type] = classObject;

            return classObject;
        }
    };

    // dashlet gadget types are stored here
    Ratchet.DashletGadgets = {};
    Ratchet.DashletRegistry = {
        register: function(type, classObject)
        {
            Ratchet.DashletGadgets[type] = classObject;

            return classObject;
        }
    };

    Ratchet.spin = function(el)
    {
        var opts = {
            lines: 12,            // The number of lines to draw
            length: 7,            // The length of each line
            width: 5,             // The line thickness
            radius: 10,           // The radius of the inner circle
            rotate: 0,            // Rotation offset
            corners: 1,           // Roundness (0..1)
            color: '#000',        // #rgb or #rrggbb
            direction: 1,         // 1: clockwise, -1: counterclockwise
            speed: 1,             // Rounds per second
            trail: 100,           // Afterglow percentage
            opacity: 1/4,         // Opacity of the lines
            fps: 20,              // Frames per second when using setTimeout()
            zIndex: 2e9,          // Use a high z-index by default
            className: 'spinner', // CSS class to assign to the element
            top: 'auto',          // center vertically
            left: 'auto',         // center horizontally
            position: 'relative'  // element position
        };

        $(el).spin(opts);
    }

})();(function($) {
    Ratchet.AbstractDynamicGadget = Ratchet.Gadget.extend(
    {
        HTML: "",

        constructor: function(type, ratchet, id) {

            var self = this;

            this.base(type, ratchet, id);

            // this method provides a way to register dynamic configuration upon instantiation
            var blockKeys = [];
            this.config = function(config)
            {
                var type = self.getGadgetType();
                var id = self.getGadgetId();

                if (config)
                {
                    // add config
                    var block = {
                        "evaluator": "gadget",
                        "condition": {
                            "gadget": id,
                            "gadgetType": type
                        },
                        "config": {
                            "gadgets": {
                            }
                        }
                    };
                    block.config.gadgets[type] = {};
                    block.config.gadgets[type][id] = {};
                    Ratchet.merge(config, block.config.gadgets[type][id]);
                    var blockKey = Ratchet.Configuration.add(block);

                    blockKeys.push(blockKey);
                }

                var c = {};
                var gadgetConfig = Ratchet.Configuration.evaluate({
                    "gadget": id,
                    "gadgetType": type
                });
                if (gadgetConfig.gadgets && gadgetConfig.gadgets[type] && gadgetConfig.gadgets[type][id])
                {
                    Ratchet.merge(gadgetConfig.gadgets[type][id], c);
                }
                else
                {
                    //console.log("Gadget config does not have gadgets[" + type + "][" + id + "] element");
                }
                return c;
            };

            this.releaseAllConfigs = function()
            {
                for (var i = 0; i < blockKeys.length; i++)
                {
                    Ratchet.Configuration.release(blockKeys[i]);
                }
            };
        },

        /**
         * @override
         */
        configure: function(gadgetIdentifier)
        {
            this.base(gadgetIdentifier);

            if (this.getGadgetId())
            {
                this.configureDefault();
                this.configureAutowire();
            }
        },

        /**
         * @extension_point
         *
         *
         */
        configureDefault: function()
        {
        },

        /**
         * @extension_point
         */
        configureAutowire: function()
        {

        },

        /**
         * @override
         */
        teardown: function()
        {
            var self = this;

            this.base();

            if (this.getGadgetId())
            {
                // remove all config listeners for this gadget
                Ratchet.Configuration.removeAllListeners({
                    "evaluator": "gadget",
                    "condition": {
                        "gadgetId": self.getGadgetId(),
                        "gadgetType": self.getGadgetType()
                    }
                });

                // remove our config from the configuration service
                this.releaseAllConfigs();
            }
        },

        renderTemplate: function(el, templateIdentifier, data, callback) {

            var self = this;

            Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] renderTemplate -> templateIdentifier: " + templateIdentifier);

            if (data && callback) {
                el.transform(templateIdentifier, data, function(el) {
                    callback(el);
                }, function(el, err) {

                    Ratchet.logError("Error transforming gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "]");
                    Ratchet.logError("Error Message: " + err.message);

                    callback(el, err);
                });
            } else {
                callback = data;
                el.transform(templateIdentifier, function(el) {
                    callback(el);
                }, function(el, err) {

                    Ratchet.logError("Error transforming gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "]");
                    Ratchet.logError("Error Message: " + err.message);

                });
            }
        },

        index: function(el, callback)
        {
            var self = this;

            var handleRender = function(el, model, cb)
            {
                self.doRender(el, model, function() {
                    cb();
                });
            };

            var model = JSON.parse(JSON.stringify(this.config()));
            handleRender(el, model, function() {

                if (callback)
                {
                    callback();
                }

            });
        },

        doRender: function(context, model, callback)
        {
            var self = this;

            Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] start render chain");
//            console.log("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] start render chain");

            Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] call prepareModel()");
            this.prepareModel(context, model, function() {
                Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] call substituteModelVariables()");

                self.substituteModelVariables(context, model);

                Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] call filterModel()");
                self.filterModel(model, function() {

                    Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] call postFilterModel()");
                    self.postFilterModel(model, function() {

                        Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] call render()");
                        self.render(context, model, function(el) {
                            Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] call beforeSwap()");
                            self.beforeSwap(context, model, function() {
                                Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] call swap()");
                                context.swap(function() {
                                    Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] call afterSwap()");
                                    self.afterSwap($(self.ratchet().el)[0], model, context, function() {
                                        Ratchet.logDebug("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] complete render chain");
    //                                    console.log("Gadget [" + self.getGadgetType() + ", " + self.getGadgetId() + "] complete render chain");

                                        // nothing more to do

                                        if (callback)
                                        {
                                            callback();
                                        }

                                    });
                                });
                            });
                        });
                    });

                });
            });
        },

        substituteModelVariables: function(el, model)
        {
            this.substituteVariables(el, model, model);
        },

        substituteVariables: function(el, model, obj)
        {
            Ratchet.substituteVariables(obj, model, el.tokens, el);
        },

        substitute: function(obj, replacementFunction)
        {
            Ratchet.substitute(obj, replacementFunction);
        },

        render: function(el, model, callback)
        {
            var self = this;

            self.renderTemplate(el, self.TEMPLATE, model, function(el, err) {
                callback(el);
            });
        },

        prepareModel: function(el, model, callback)
        {
            if (!model.cssClasses) {
                model.cssClasses = "";
            }

            // add in a custom class for our gadget
            model.cssClasses += " " + this.getGadgetType();

            // allows for custom observable names
            if (!model.observables) {
                model.observables = {};
            }

            model.tokens = {};
            if (el.tokens)
            {
                for (var k in el.tokens)
                {
                    model.tokens[k] = el.tokens[k];
                }
            }

            callback();
        },

        /**
         * Provides an extension point for potentially permission and authority checking items on the model
         * ahead of applying the render.
         *
         * @param model
         * @param callback
         */
        filterModel: function(model, callback) {
            callback();
        },

        postFilterModel: function(model, callback) {
            callback();
        },

        beforeSwap: function(el, model, callback)
        {
            var self = this;

            // set up observables
            var refreshHandler = self.refreshHandler(el);

            // refresh handler
            model.observables.refresh = "refresh_" + self.getGadgetType() + "_" + self.getGadgetId();// + new Date().getTime();
            self.on(model.observables.refresh, refreshHandler);

            if (callback)
            {
                callback();
            }
        },

        afterSwap: function(el, model, originalContext, callback)
        {
            if (callback)
            {
                callback();
            }
        },

        refresh: function(model) {

            // forces refresh by clearing selected items
            var self = this;

            if (model && model.observables && model.observables.refresh)
            {
                self.trigger(model.observables.refresh);
            }
        }

    });

    Ratchet.AbstractDashlet = Ratchet.AbstractDynamicGadget.extend({

        setup: function()
        {
            this.get(this.index);
        }

    });

})(jQuery);
(function($) {
    Ratchet.AbstractDynamicPage = Ratchet.Gadget.extend(
    {
        index: function(el, callback)
        {
            this.doIndex(el, callback);
        },

        /**
         * To be implemented by implementation class.
         *
         * @extension_point
         *
         * @param el
         * @param callback
         */
        doIndex: function(el, callback)
        {
        },

        renderTemplate: function(el, templateIdentifier, data, callback) {

            if (data && callback) {
                el.transform(templateIdentifier, data, function(el) {
                    callback(el);
                });
            } else {
                callback = data;
                el.transform(templateIdentifier, function(el) {
                    callback(el);
                });
            }
        }

    });

})(jQuery);/*jshint -W004 */ // duplicate variables
(function($)
{
    Ratchet.DynamicRegionResolver = Base.extend(
    {
        constructor: function(config)
        {
            this.base();

            this.config = config;
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

            var resolutions = {};

            if (regions)
            {
                for (var regionName in regions)
                {
                    var x = this.config.regions[regionName];
                    if (x)
                    {
                        var array = [];

                        // we either have a single match or an array
                        if (x.push)
                        {
                            for (var i = 0; i < x.length; i++)
                            {
                                var resolution = {
                                    "type": x[i].gadgetType,
                                    "id": x[i].gadget,
                                    "attrs": {}
                                };

                                array.push(resolution);
                            }
                        }
                        else
                        {
                            var resolution = {
                                "type": x.gadgetType,
                                "id": x.gadget,
                                "attrs": {}
                            };

                            array.push(resolution);
                        }

                        resolutions[regionName] = array;
                    }
                }
            }

            callback.call(self, resolutions);
        }
    });

})(jQuery);/*jshint -W004 */ // duplicate variables
(function() {

    Ratchet.AbstractViewer = Base.extend({

        constructor: function()
        {
            this.base();

            var self = this;

            var blockKeys = [];
            this.config = function(config)
            {
                if (config)
                {
                    // add config
                    var block = {
                        "evaluator": "viewer",
                        "condition": self.id,
                        "config": {
                            "viewers": {
                            }
                        }
                    };
                    block.config.viewers[self.id] = {};
                    Ratchet.merge(config, block.config.viewers[self.id]);
                    var blockKey = Ratchet.Configuration.add(block);

                    blockKeys.push(blockKey);
                }

                var c = {};
                var viewerConfig = Ratchet.Configuration.evaluate({
                    "viewer": self.id
                });
                if (viewerConfig.viewers && viewerConfig.viewers[self.id])
                {
                    Ratchet.merge(viewerConfig.viewers[self.id], c);
                }

                return c;
            };

            /**
             * Determines whether the resource supports a preview URI for the given mimetype.
             *
             * @param resource
             * @param mimetype
             */
            var findUrlMatch = function(resource, mimetype)
            {
                var match = null;

                // regular expression matching
                var regex = Ratchet.wildcardToRegExp(mimetype);

                if (resource.attachments)
                {
                    for (var k in resource.attachments)
                    {
                        var arr = resource.attachments[k].mimetype.match(regex);
                        if (arr && arr.length > 0)
                        {
                            match = {
                                "url": resource.attachments[k].url,
                                "mimetype": resource.attachments[k].mimetype
                            };
                            break;
                        }
                    }
                }

                if (!match)
                {
                    var arr = resource.mimetype.match(regex);
                    if (arr && arr.length > 0)
                    {
                        match = {
                            "url": resource.url,
                            "mimetype": resource.mimetype
                        };
                    }
                }

                return match;
            };

            var urlMatches = function(resource, mimetypes)
            {
                var matches = [];

                for (var i = 0; i < mimetypes.length; i++)
                {
                    var match = findUrlMatch(resource, mimetypes[i]);
                    if (match)
                    {
                        matches.push({
                            mimetype: match.mimetype,
                            url: match.url
                        });
                    }
                }

                return matches;
            };

            this.findAttachments = function(resource)
            {
                var mimetypes = this.listSupportedMimetypes();

                return urlMatches(resource, mimetypes);
            };

            this.findAttachment = function(resource)
            {
                var attachment = null;

                var attachments = this.findAttachments(resource);
                if (attachments.length > 0)
                {
                    attachment = attachments[0];
                }

                return attachment;
            };

        },

        // one-time setup call to allow the viewer to register its configuration
        configure: function(id)
        {
            this.id = id;

            this.doConfigure();
        },

        /**
         * @extension_point
         */
        doConfigure: function()
        {

        },

        /**
         * Describes any supported attachment mimetypes that this viewer can render.
         *
         * @return {Array}
         */
        listSupportedMimetypes: function()
        {
            return [];
        },

        /**
         * Validates whether this viewer can operate in the current device or browser.  This method should check
         * whether all required libraries or browser capabilities exist.  If not, then the method can indicate to the
         * framework that it is not able to proceed.
         *
         * @return {Boolean}
         */
        canOperate: function()
        {
            return false;
        },

        /**
         * Lets this viewer determine whether they can render the resource.
         *
         * The resource attributes:
         *
         *    {
         *       "id": "",                                  (required - unique id for resource)
         *       "title": "",                               (required - display title)
         *       "kind": "file|webpage",                    (required - descriptor)
         *       "url": "http://www...",                    (required - url to resource source)
         *
         *       for files:
         *
         *       "size": 123112,                            (required - size in bytes)
         *       "mimetype": "image/png",                   (required - mimetype)
         *       "filename": "",                            (required - a file name)
         *
         *       file attachments (if available):
         *
         *       "attachments": {
         *         "attachmentId": {
         *           "url": "",                             (required - url to the attachment)
         *           "size": 123112,                        (required - size in bytes)
         *           "mimetype": "",                        (required - mimetype)
         *           "filename": ""                         (optional - a file name)
         *         }
         *       }
         *    }
         *
         * This method should solely make the decision as to whether it can handle the given TYPE of content.
         * Not whether it is functionally able to render it.
         *
         * @param context
         * @return {Boolean}
         */
        canHandle: function(resource)
        {
            return (this.findAttachments(resource).length > 0);
        },

        /**
         * This method gets called if the viewer has been picked and it is able to operationally render the resource
         * into the given container.
         *
         * @param resource
         * @param container dom element
         * @param callback callback function (pass err if fail)
         */
        render: function(resource, container, callback)
        {
            callback();
        }

    });

})();(function() {

    var registry = {};

    var registryClass = Base.extend({

        constructor: function()
        {
            this.base();
        },

        /**
         * Registers a previewer.
         *
         * @param id
         * @param previewerClass
         */
        register: function(id, previewerClass)
        {
            var instance = new previewerClass();
            registry[id] = instance;

            instance.configure(id);

            return previewerClass;
        },

        /**
         * Finds all of the previewers that can execute given a condition.
         *
         * @param condition
         */
        lookupHandlers: function(condition)
        {
            var matches = [];

            for (var id in registry)
            {
                var previewer = registry[id];

                if (previewer.canHandle(condition))
                {
                    matches.push(previewer);
                }
            }

            return matches;
        }

    });

    Ratchet.ViewerRegistry = new registryClass();

    return Ratchet.ViewerRegistry;

})();
/*jshint -W004 */ // duplicate variables
(function() {

    Ratchet.AbstractEditor = Base.extend({

        constructor: function()
        {
            this.base();

            var self = this;

            var blockKeys = [];
            this.config = function(config)
            {
                if (config)
                {
                    // add config
                    var block = {
                        "evaluator": "editor",
                        "condition": self.id,
                        "config": {
                            "editors": {
                            }
                        }
                    };
                    block.config.editors[self.id] = {};
                    Ratchet.merge(config, block.config.editors[self.id]);
                    var blockKey = Ratchet.Configuration.add(block);

                    blockKeys.push(blockKey);
                }

                var c = {};
                var editorConfig = Ratchet.Configuration.evaluate({
                    "editor": self.id
                });
                if (editorConfig.editors && editorConfig.editors[self.id])
                {
                    Ratchet.merge(editorConfig.editors[self.id], c);
                }

                return c;
            };
        },

        // one-time setup call to allow the editor to register its configuration
        configure: function(id)
        {
            this.id = id;

            this.doConfigure();
        },

        /**
         * @extension_point
         */
        doConfigure: function()
        {

        },

        /**
         * Describes any supported attachment mimetypes that this editor can handle.
         *
         * @return {Array}
         */
        listSupportedMimetypes: function()
        {
            return [];
        },

        /**
         * Validates whether this editor can operate in the current device or browser.  This method should check
         * whether all required libraries or browser capabilities exist.  If not, then the method can indicate to the
         * framework that it is not able to proceed.
         *
         * @return {Boolean}
         */
        canOperate: function()
        {
            return true;
        },

        /**
         * Lets this editor determine whether they can render a binary with the given descriptor.
         *
         * The resource attributes:
         *
         *    {
         *       "id": "identifier",
         *       "size": "size",
         *       "mimetype": "mimetype",
         *       "filename": "filename",
         *    }
         *
         * This method should solely make the decision as to whether it can handle the given TYPE of content.
         * Not whether it is functionally able to render it.
         *
         * @param context
         * @return {Boolean}
         */
        canHandle: function(resource)
        {
            var canHandle = false;

            // mimetype check
            if (resource && resource.mimetype)
            {
                var mimetypes = this.config().mimetypes;
                if (mimetypes)
                {
                    for (var i = 0; i < mimetypes.length; i++)
                    {
                        // regular expression matching
                        var regex = Ratchet.wildcardToRegExp(mimetypes[i]);
                        if (resource.mimetype.match(regex))
                        {
                            canHandle = true;
                            break;
                        }
                    }
                }
            }

            return canHandle;
        },

        /**
         * This method gets called if the editor has been picked and it is able to operationally render the resource
         * into the given container.
         *
         * @param resource
         * @param container dom element
         * @param callback callback function (pass err if fail)
         */
        render: function(resource, container, callback)
        {
            callback();
        },

        /**
         * @extension_point
         *
         * Loads data from resource.
         *
         * @param resource
         * @param callback
         */
        load: function(resource, callback)
        {
            callback();
        },

        /**
         * @extension_point
         *
         * Saves data back
         *
         * @param resource
         * @param callback
         */
        save: function(resource, callback)
        {
            callback();
        }

    });

})();(function() {

    var keys = [];
    var registry = {};

    var registryClass = Base.extend({

        constructor: function()
        {
            this.base();
        },

        /**
         * Registers an editor.
         *
         * @param id
         * @param editorClass
         */
        register: function(id, editorClass)
        {
            var instance = new editorClass();
            registry[id] = instance;
            keys.push(id);

            instance.configure(id);

            return editorClass;
        },

        /**
         * Finds all of the editors that can render for a given condition.
         *
         * @param condition
         */
        lookupHandlers: function(condition)
        {
            var matches = [];

            for (var i = 0; i < keys.length; i++)
            {
                var key = keys[i];

                var editor = registry[key];

                if (editor.canHandle(condition))
                {
                    matches.push(editor);
                }
            }

            return matches;
        }

    });

    Ratchet.EditorRegistry = new registryClass();

    return Ratchet.EditorRegistry;

})();


    return Ratchet;

}));
