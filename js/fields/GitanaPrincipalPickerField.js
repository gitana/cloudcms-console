(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.GitanaPrincipalPickerField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.GitanaPrincipalPickerField.prototype
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

            if (this.options.context) {
                this.context = this.options.context;
                this.platform = this.options.context.platform();
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
                        var ids = controlVal.split("/");
                        if (ids.length != 2) {
                            callback({
                                "message" : self.view.getMessage("invalidPrincipal"),
                                "status" : false
                            });
                            return false;
                        }
                        var domainId = ids[0];
                        var principalId = ids[1];
                        var domain;
                        Chain(self.platform).trap(function(error){
                            callback({
                                "message" : self.view.getMessage("invalidDomainId"),
                                "status" : false
                            });
                            return false;
                        }).readDomain(domainId).trap(function(error){
                            callback({
                                "message" : self.view.getMessage("invalidPrincipal"),
                                "status" : false
                            });
                            return false;
                        }).then(function() {
                            domain = this;
                        }).readPrincipal(principalId).then(function() {
                                var friendlyName = self.context.friendlyName(this);
                                var itemInfo = "<div>" + friendlyName + "</div>";
                                itemInfo += "<div>" + self.context.listItemProp(this, 'email') + "</div>";
                                itemInfo += "<div>" + self.context.listItemProp(this, 'companyName') + "</div>";
                                itemInfo += "<div><b>Domain</b>: " + self.context.friendlyTitle(domain) + "</div>";
                                itemInfo += "<div><b>Name</b>: " + this.getName() + "</div>";

                                itemInfo.replace('<', '&lt;').replace('>', '$gt;');

                                control.field.attr('title',itemInfo);
                            callback({
                                "message": "Valid group id",
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

            if (this.controlFieldTemplate) {
                this.field = $.tmpl(this.controlFieldTemplate, {
                    "id": this.getId(),
                    "options": this.options
                });
                this.injectField(this.field);
                this.field.attr('rel',"tooltip-html");
                $('<div gadget="principalselector" target-id="' + this.field.attr('id') + '"></div>').hide().insertAfter(this.field);
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
            $('<button class="gitana-principal-picker-button">Select Principal...</button>').button({
                icons: {
                    primary:'ui-icon-person'
                }
            }).click(function() {
                    $(".ui-dialog").remove();
                    $('div[gadget="principalselector"]').show().dialog({
                        title : "<div><img src='" + Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant', 20) + "'/>Cloud CMS Principal Picker</div>",
                        resizable: true,
                        width: 900,
                        height: 600,
                        modal: true
                    }).height('auto');
            }).insertAfter(this.field);
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Cloud CMS Principal Picker Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for picking Cloud CMS principal.";
        }
    });

    Alpaca.registerMessages({
        "emptyPlatform": "Cloud CMS platform not provided",
        "invalidDomainId": "Invalid domain id",
        "invalidPrincipal": "Invalid principal id"
    });

    Alpaca.registerFieldClass("gitanaprincipalpicker", Alpaca.Fields.GitanaPrincipalPickerField);
})(jQuery);
