(function($) {
    Gitana.Console.Pages.WarehouseTeamEdit = Gitana.Console.Pages.AbstractObjectTeamEdit.extend(
    {
        EDIT_URI: "/warehouses/{warehouseId}/teams/{teamId}/edit",

        EDIT_JSON_URI: "/warehouses/{warehouseId}/teams/{teamId}/edit/json",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        contextObject: function() {
            return this.warehouse();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.WarehouseTeam(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.WarehouseTeam(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WarehouseTeamEdit);

})(jQuery);