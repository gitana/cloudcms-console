(function($) {
    Gitana.Console.Pages.AutoClientMappingEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/webhosts/{webhostId}/autoclientmappings/{autoClientMappingId}/edit"
        ],

        EDIT_JSON_URI: [
            "/webhosts/{webhostId}/autoclientmappings/{autoClientMappingId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.autoClientMapping();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        schema: function() {
            return Alpaca.merge({}, Gitana.Console.Schema.AutoClientMapping);
        },

        options: function() {
            var self = this;

            var options = Alpaca.merge({}, Gitana.Console.Options.AutoClientMapping);

            options['fields']['clientKey']['dataSource'] = function(field, callback) {
                Chain(self.platform()).listClients().each(
                    function(key, val, index) {
                        var title = this.getTitle() ? this.getTitle() : this.getKey();
                        field.selectOptions.push({
                            "value": this.getKey(),
                            "text": title
                        });
                    }).then(function() {
                        if (callback) {
                            callback();
                            field.field.val(self.targetObject().getTargetClientKey()).change();
                        }
                    });
            };

            options['fields']['applicationId']['dataSource'] = function(field, callback) {
                Chain(self.platform()).listApplications().each(
                    function(key, val, index) {
                        var title = this.getTitle() ? this.getTitle() : this.getId();
                        field.selectOptions.push({
                            "value": this.getId(),
                            "text": title
                        });
                    }).then(function() {
                        if (callback) {
                            callback();
                            field.field.val(self.targetObject().getTargetApplicationId()).change();
                        }
                    });
            };

            return options;
        },


        setupMenu: function() {
            this.menu(Gitana.Console.Menu.AutoClientMapping(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.AutoClientMapping(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var autoClientMapping = self.targetObject();
            var defaultData = this.populateObject(["title","description","uri","clientKey","applicationId"],autoClientMapping);
            $('#auto-client-mapping-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'auto-client-mapping-edit-save', true);
                    // Add Buttons
                    $('#auto-client-mapping-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Auto Client Mapping ...");
                            _mergeObject(autoClientMapping,formVal);
                            autoClientMapping.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Auto Client Mapping",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "auto-client-mapping-edit",
                "title" : "Edit Auto Client Mapping",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping-edit', 24),
                "buttons" :[
                    {
                        "id" : "auto-client-mapping-edit-save",
                        "title" : "Save Auto Client Mapping",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Auto Client Mapping",
                "description" : "Edit Auto Client Mapping " + this.friendlyTitle(this.webhost()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AutoClientMappingEdit);

})(jQuery);