(function($) {
    Gitana.Console.Pages.WarehouseTeam = Gitana.Console.Pages.AbstractObjectTeam.extend(
    {
        SUBSCRIPTION : "warehouse-team-page",

        FILTER : "warehouse-team-member-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/warehouses/{warehouseId}/teams/{teamId}", this.index);
        },

        contextObject: function() {
            return this.warehouse();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.WarehouseTeam(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.WarehouseTeam(this));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WarehouseTeam);

})(jQuery);