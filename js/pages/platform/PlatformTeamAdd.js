(function($) {
    Gitana.Console.Pages.PlatformTeamAdd = Gitana.Console.Pages.AbstractObjetTeamAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/add/team", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.PlatformTeams(this), [
                {
                    "text" : "New Team"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Platform Team",
                "description" : "Create a new platform team.",
                "forms" :[{
                    "id" : "team-add",
                    "title" : "Create A New Platform Team",
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

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformTeamAdd);

})(jQuery);