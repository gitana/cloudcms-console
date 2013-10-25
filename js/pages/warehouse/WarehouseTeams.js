(function($) {
    Gitana.Console.Pages.WarehouseTeams = Gitana.Console.Pages.AbstractObjectTeams.extend({

        SUBSCRIPTION : "warehouse-teams",

        FILTER : "warehouse-team-list-filters",

        setup: function() {
            this.get("/warehouses/{warehouseId}/teams", this.index);
        },

        targetObject: function() {
            return this.warehouse();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Warehouse(this, "menu-warehouse-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.WarehouseTeams(this));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Warehouse Teams",
                "description" : "Display list of teams of warehouse " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Team List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'team', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WarehouseTeams);

})(jQuery);