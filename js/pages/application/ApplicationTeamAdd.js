(function($) {
    Gitana.Console.Pages.ApplicationTeamAdd = Gitana.Console.Pages.AbstractObjetTeamAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/applications/{applicationId}/add/team", this.index);
        },

        targetObject: function() {
            return this.application();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Application(this, "menu-application-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.ApplicationTeams(this), [
                {
                    "text" : "New Team"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Application Team",
                "description" : "Create a new application team.",
                "forms" :[{
                    "id" : "team-add",
                    "title" : "Create A New Application Team",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ApplicationTeamAdd);

})(jQuery);