(function($) {
    Gitana.Console.Pages.TenantTeams = Gitana.Console.Pages.AbstractObjectTeams.extend({

        SUBSCRIPTION : "tenant-teams",

        FILTER : "tenant-team-list-filters",

        setup: function() {
            this.get("/registrars/{registrarId}/tenants/{tenantId}/teams", this.index);
        },

        targetObject: function() {
            return this.tenant();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Tenant(this, "menu-tenant-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.TenantTeams(this));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Tenant Teams",
                "description" : "Display list of teams of tenant " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Team List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'team', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TenantTeams);

})(jQuery);