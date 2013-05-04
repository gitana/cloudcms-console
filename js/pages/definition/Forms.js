(function($) {
    Gitana.Console.Pages.Forms = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "forms",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/forms", this.index);
        },

        targetObject: function() {
            return this.definition();
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
            if (this.targetObject().getTypeQName() == "d:type") {

                return this.menu(Gitana.Console.Menu.Type(this,"menu-definition-forms"))

            } else {

                return this.menu(Gitana.Console.Menu.Definition(this,"menu-definition-forms"));

            }
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Forms(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-add', 48),
                    "url" : this.LINK().call(this,this.definition(),'add','form'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": "Import Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : this.LINK().call(this, this.contextObject(), 'import'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-edit', 48),
                    "click": function(form){
                        var key = self.listItemProp(form,"form-key");
                        self.app().run("GET", self.LIST_LINK().call(self,'forms') + key + '/edit');
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Form(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-delete', 48),
                    "click": function(forms) {
                        self.onClickDeleteMultiple(self.definition(), forms , "form", self.LIST_LINK().call(self,'forms') , Gitana.Utils.Image.buildImageUri('objects', 'form', 20), 'form', function(obj) {
                            return self.listItemProp(obj,'form-key');
                        });
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(form) {
                        var key = self.listItemProp(form,"form-key");
                        self.app().run("GET", self.LIST_LINK().call(self,'forms') + key + '/edit/json');
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(form) {
                        self.app().run("GET", self.LINK().call(self,form,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Form Key",
                    "type":"property",
                    "property": function(callback) {
                        var key = self.listItemProp(this,"form-key");
                        var value = "<a href='#" + self.LIST_LINK().call(self,'forms') + key + "'>" + key + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "QName",
                    "type":"property",
                    "property": function(callback) {
                        var value = self.listItemProp(this,"_qname");
                        callback(value);
                    }
                },
                {
                    "title": "Last Modified",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var query = self.query();
                var checks = [];
                self.definition().trap(function(error) {
                    return self.handlePageError(el, error);
                }).listFormAssociations().each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this, ['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.branch()).checkNodePermissions(checks, function(checkResults) {
                        self.updateUserRoles(checkResults);
                        callback.call(_this);
                    });
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Forms",
                "description" : "Display list of forms of current definition " + this.definition().getQName() + ".",
                "listTitle" : "Form List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'form', 20),
                "subscription" : this.SUBSCRIPTION
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Forms);

})(jQuery);