(function($) {
    Gitana.Console.Pages.TenantTeam = Gitana.Console.Pages.AbstractObjectTeam.extend(
    {
        SUBSCRIPTION : "tenant-team-page",

        FILTER : "tenant-team-member-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/registrars/{registrarId}/tenants/{tenantId}/teams/{teamId}", this.index);
        },

        contextObject: function() {
            return this.tenant();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.TenantTeam(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.TenantTeam(this));
        },

        loadContext: function(el, callback) {
            var self = this;

            Chain(self.contextObject()).trap(function(error) {
                return self.handlePageError(el,error);
            }).then(function() {
                    var teamId = el.tokens["teamId"];
                    if (teamId) {
                        this.readTeam(teamId).then(function() {
                            self.team(this);
                            var groupId = this.getGroupId();
                            this.subchain(self.platform()).readPrimaryDomain().readPrincipal(groupId).then(function() {
                                self.group(this);
                                if (callback) {
                                    callback();
                                }
                            });
                        });
                    } else {
                        if (callback) {
                            callback();
                        }
                    }
            });
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TenantTeam);

})(jQuery);