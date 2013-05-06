(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.GitanaWebHostPickerField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.GitanaWebHostPickerField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Control for picking Gitana web hosts
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {
            this.base();
            var self = this;

            if (this.options.platform) {
                this.platform = this.options.platform;
            }

            if (!this.options.validator) {
                this.options.validator = function(control, callback) {

                    var controlVal = control.getValue();

                    if (!self.platform) {
                        callback({
                            "message": self.view.getMessage("emptyPlatform"),
                            "status": false
                        });
                        return false;
                    }

                    if (Alpaca.isValEmpty(controlVal)) {
                        callback({
                            "status" : true
                        });
                        return true;
                    } else {
                        var id = controlVal;

                        Chain(self.platform).trap(function(error) {
                            callback({
                                "message" : self.view.getMessage("invalidWebHostId"),
                                "status" : false
                            });
                            return false;
                        }).readApplication(id).then(function() {
                            callback({
                                "message": "Valid web host ID",
                                "status": true
                            });
                        });
                    }
                }
            }
        },

        /**
         * @see Alpaca.ControlField#renderField
         */
        renderField: function(onSuccess) {

            if (this.controlFieldTemplateDescriptor)
            {
                this.field = this.view.tmpl(this.controlFieldTemplateDescriptor, {
                    "id": this.getId(),
                    "options": this.options
                });
                this.injectField(this.field);
                this.field.attr('rel',"tooltip-html");
            }

            if (onSuccess) {
                onSuccess();
            }

        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
            var self = this;
            $('<button class="gitana-picker-button">Select...</button>').button({
                icons: {
                    primary:'ui-icon-document'
                }
            }).click(function() {

                // make sure we only insert once
                var el = $('<div gadget="webhostselector"></div>').hide().insertAfter(self.field);
                var ratchet = $(el).ratchet();
                ratchet.run();

                // TODO: we need some way to wait for ratchet to finish render...
                window.setTimeout(function() {

                    $(el).show();

                    var dialog = Gitana.Utils.UI.modalOpen({
                        "title": "Select a Web Host",
                        "body": el,
                        "width": 700
                    });

                    for (var i = 0; i < ratchet.gadgetInstances.length; i++)
                    {
                        ratchet.gadgetInstances[i].selectHandler = function(webHostId, title) {
                            $(dialog).dialog("close");
                            $(self.field).val(webHostId).blur().focus();
                            $(self.field).trigger("change");
                        }
                    }

                }, 1000);

            }).insertAfter(this.field);
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Cloud CMS Web Host Picker Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for picking Cloud CMS web host.";
        }
    });

    Alpaca.registerMessages({
        "emptyPlatform": "Cloud CMS platform not provided",
        "invalidWebHostId": "Invalid web host ID"
    });

    Alpaca.registerFieldClass("gitanawebhostpicker", Alpaca.Fields.GitanaWebHostPickerField);
})(jQuery);
