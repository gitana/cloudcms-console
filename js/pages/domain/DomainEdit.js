(function($) {
    Gitana.Console.Pages.DomainEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/domains/{domainId}/edit"
        ],

        EDIT_JSON_URI: [
            "/domains/{domainId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.domain();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        options: function() {

            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter domain title."
                    },
                    "description" : {
                        "helper" : "Enter domain description."
                    }
                }
            });
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Domain(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Domain(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var domain = self.targetObject();
            var defaultData = self.populateObjectAll(domain);
            $('#domain-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'domain-edit-save', true);
                    // Add Buttons
                    $('#domain-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Domain ...");
                            domain.replacePropertiesWith(formVal);
                            domain.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });

                    callback();
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Domain",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "domain-edit",
                "title" : "Edit Domain",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-edit', 24),
                "buttons" :[
                    {
                        "id" : "domain-edit-save",
                        "title" : "Save Domain",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Domain",
                "description" : "Edit domain " + this.friendlyTitle(this.domain()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainEdit);

})(jQuery);