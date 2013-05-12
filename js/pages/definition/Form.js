(function($) {
    Gitana.Console.Pages.Form = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/forms/{formId}", this.index);
        },

        targetObject: function() {
            return this.form();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Form(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Form(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            var targetNode = this.targetObject();
            self.addButtons([
                {
                    "id": "edit",
                    "title": "Edit Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-edit', 48),
                    "url" : self.LINK().call(self,self.form(),'edit'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                "id": "delete",
                "title": "Delete Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-delete', 48),
                    "click": function(form) {
                        self.onClickDelete(self.targetObject(),'form',self.LIST_LINK().call(self,'forms'),Gitana.Utils.Image.buildImageUri('objects', 'form', 20), 'form', function(obj) {
                            return obj['formKey'];
                        });
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["delete"]
                        }
                    ]
                },
                {
                    "id": "edit-json",
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "url" : self.link(self.targetObject(),'edit','json'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                    "id": "export",
                    "title": "Export Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'export'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["read"]
                        }
                    ]
                }/*,
                {
                    "id": "import",
                    "title": "Import Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'import'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }*/
            ]);
        },

        setupFormOverview: function () {
            var self = this;
            var form = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(form,'_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(form,'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(form,'description')
            });
            this._pushItem(pairs.items, {
                "key" : "QName",
                "value" : form.getQName()
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + this.form().getSystemMetadata().getModifiedBy() + " @ " +this.form().getSystemMetadata().getModifiedOn().getTimestamp()
            });

            this.pairs("form-overview",pairs);
        },

        setupDashlets : function () {

            this.setupFormOverview();

        },

        setupPage : function(el) {

            var description = "Overview of form " + this.targetObject().getQName() + ".";

            var page = {
                "title" : this.targetObject()['formKey'],
                "description" : description,
                "dashlets" :[
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "form-overview"
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Form);

})(jQuery);