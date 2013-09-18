(function($) {
    Gitana.Console.Pages.TenantTeamAdd = Gitana.Console.Pages.AbstractObjectTeamAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/registrars/{registrarId}/tenants/{tenantId}/add/team", this.index);
        },

        targetObject: function() {
            return this.tenant();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Tenant(this, "menu-tenant-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.TenantTeams(this), [
                {
                    "text" : "New Team"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Tenant Team",
                "description" : "Create a new tenant team.",
                "forms" :[{
                    "id" : "team-add",
                    "title" : "Create A New Tenant Team",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TenantTeamAdd);

})(jQuery);