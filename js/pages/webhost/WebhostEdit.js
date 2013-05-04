(function($) {
    Gitana.Console.Pages.WebhostEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/webhosts/{webhostId}/edit"
        ],

        EDIT_JSON_URI: [
            "/webhosts/{webhostId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.webhost();
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
            return Alpaca.merge(this.base(), Gitana.Console.Schema.Webhost);
        },

        options: function() {
            var self = this;

            var options = Alpaca.merge(this.base(), Gitana.Console.Options.Webhost);

            return Alpaca.merge(options, {
                "fields" : {
                    "title" : {
                        "helper" : "Enter web host title."
                    },
                    "description" : {
                        "helper" : "Enter web host description."
                    }
                }
            });
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Webhost(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Webhost(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var webhost = self.targetObject();
            var defaultData = this.populateObject(["title","description","urlPatterns"],webhost);
            $('#webhost-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'webhost-edit-save', true);
                    // Add Buttons
                    $('#webhost-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Web Host ...");
                            webhost.replacePropertiesWith(formVal);
                            webhost.update().then(function() {
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
                "title": "Edit Web Host",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'webhost-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "webhost-edit",
                "title" : "Edit Web Host",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'webhost-edit', 24),
                "buttons" :[
                    {
                        "id" : "webhost-edit-save",
                        "title" : "Save Web Host",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Web Host",
                "description" : "Edit web host " + this.friendlyTitle(this.webhost()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WebhostEdit);

})(jQuery);