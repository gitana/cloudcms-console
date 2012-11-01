(function($) {
    Gitana.Console.Pages.TenantTeamEdit = Gitana.Console.Pages.AbstractObjectTeamEdit.extend(
    {
        EDIT_URI: "/registrars/{registrarId}/tenants/{tenantId}/teams/{teamId}/edit",

        EDIT_JSON_URI: "/registrars/{registrarId}/tenants/{tenantId}/teams/{teamId}/edit/json",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        contextObject: function() {
            return this.tenant();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.TenantTeam(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.TenantTeam(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TenantTeamEdit);

})(jQuery);