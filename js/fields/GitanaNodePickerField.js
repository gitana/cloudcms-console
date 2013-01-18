(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.GitanaNodePickerField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.GitanaNodePickerField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Control for JSON schema email format.
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

            if (this.options.branch) {
                this.branch = this.options.branch;
            }

            if (!this.options.validator) {
                this.options.validator = function(control, callback) {

                    var controlVal = control.getValue();

                    if (!self.branch) {
                        callback({
                            "message": self.view.getMessage("emptyBranch"),
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

                        Chain(self.branch).trap(function(error) {
                            callback({
                                "message" : self.view.getMessage("invalidNodeId"),
                                "status" : false
                            });
                            return false;
                        }).readNode(id).then(function() {
                            callback({
                                "message": "Valid node ID",
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

            var self = this;

            if (this.controlFieldTemplate) {
                this.field = $.tmpl(this.controlFieldTemplate, {
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
                var el = $('<div gadget="nodeselector"></div>').hide().insertAfter(self.field);
                var ratchet = $(el).ratchet();
                ratchet.run();

                // TODO: we need some way to wait for ratchet to finish render...
                window.setTimeout(function() {

                    $(el).show();

                    var dialog = Gitana.Utils.UI.modalOpen({
                        "title": "Select a Node",
                        "body": el,
                        "width": 700
                    });

                    for (var i = 0; i < ratchet.gadgetInstances.length; i++)
                    {
                        ratchet.gadgetInstances[i].selectHandler = function(nodeId, title) {
                            $(dialog).dialog("close");
                            $(self.field).val(nodeId).blur().focus();
                        }
                    }

                }, 1000);

            }).insertAfter(this.field);
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Cloud CMS Node Picker Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for picking Cloud CMS node.";
        }
    });

    Alpaca.registerMessages({
        "emptyBranch": "Cloud CMS branch not provided",
        "invalidNodeId": "Invalid node ID"
    });

    Alpaca.registerFieldClass("gitananodepicker", Alpaca.Fields.GitanaNodePickerField);
})(jQuery);
