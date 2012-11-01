(function($) {
    Gitana.Console.Pages.WarehouseAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {

            var schema = Alpaca.cloneObject(Gitana.Console.Schema.Warehouse);

            Alpaca.mergeObject(schema,this.base());

            return schema;
        },

        options: function() {

            var self = this;

            var options = Alpaca.cloneObject(Gitana.Console.Options.Warehouse);

            Alpaca.mergeObject(options,this.base());

            return options;
        },

        setup: function() {
            this.get("/add/warehouse", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-warehouses"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Warehouses(this), [
                {
                    "text" : "New Warehouse"
                }
            ]));
        },

        setupWarehouseAddForm : function (el) {
            var self = this;
            $('#warehouse-add', $(el)).alpaca({
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'warehouse-add-create', true);
                    // Add Buttons
                    $('#warehouse-add-create', $(el)).click(function() {

                        form.showHiddenMessages();

                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Warehouse...");


                            self.targetObject().createWarehouse(formVal).then(function() {
                                var newWarehouse = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newWarehouse));
                                });
                            });

                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupWarehouseAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Warehouse",
                "description" : "Create a new warehouse.",
                "forms" :[{
                    "id" : "warehouse-add",
                    "title" : "Create A New Warehouse",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'warehouse-add', 24),
                    "buttons" :[
                        {
                            "id" : "warehouse-add-create",
                            "title" : "Create Warehouse",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WarehouseAdd);

})(jQuery);