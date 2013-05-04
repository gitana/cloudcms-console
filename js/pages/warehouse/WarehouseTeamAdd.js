(function($) {
    Gitana.Console.Pages.WarehouseTeamAdd = Gitana.Console.Pages.AbstractObjetTeamAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/warehouses/{warehouseId}/add/team", this.index);
        },

        targetObject: function() {
            return this.warehouse();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Warehouse(this, "menu-warehouse-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.WarehouseTeams(this), [
                {
                    "text" : "New Team"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Warehouse Team",
                "description" : "Create a new warehouse team.",
                "forms" :[{
                    "id" : "team-add",
                    "title" : "Create A New Warehouse Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-add', 24),
                    "buttons" :[
                        {
                            "id" : "team-add-create",
                            "title" : "Create Team",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WarehouseTeamAdd);

})(jQuery);