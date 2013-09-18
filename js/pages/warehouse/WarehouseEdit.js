(function($) {
    Gitana.Console.Pages.WarehouseEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/warehouses/{warehouseId}/edit"
        ],

        EDIT_JSON_URI: [
            "/warehouses/{warehouseId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.warehouse();
        },

        contextObject: function() {
            return this.platform();
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

            var schema = Alpaca.cloneObject(Gitana.Console.Schema.Warehouse);

            _mergeObject(schema,this.base());

            return schema;
        },

        options: function() {

            var self = this;

            var options = Alpaca.cloneObject(Gitana.Console.Options.Warehouse);

            _mergeObject(options,this.base());

            return options;
        },


        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Warehouse(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Warehouse(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var warehouse = self.targetObject();
            var defaultData = this.populateObject(["title","description","uri"],warehouse);
            $('#warehouse-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'warehouse-edit-save', true);
                    // Add Buttons
                    $('#warehouse-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Warehouse ...");
                            warehouse.replacePropertiesWith(formVal);
                            warehouse.update().then(function() {
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
                "title": "Edit Warehouse",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'warehouse-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "warehouse-edit",
                "title" : "Edit Warehouse",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'warehouse-edit', 24),
                "buttons" :[
                    {
                        "id" : "warehouse-edit-save",
                        "title" : "Save Warehouse",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Warehouse",
                "description" : "Edit warehouse " + this.friendlyTitle(this.warehouse()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WarehouseEdit);

})(jQuery);