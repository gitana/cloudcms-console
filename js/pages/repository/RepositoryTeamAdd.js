(function($) {
    Gitana.Console.Pages.RepositoryTeamAdd = Gitana.Console.Pages.AbstractObjetTeamAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/add/team", this.index);
        },

        targetObject: function() {
            return this.repository();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Repository(this, "menu-repository-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.RepositoryTeams(this), [
                {
                    "text" : "New Team"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Repository Team",
                "description" : "Create a new repository team.",
                "forms" :[{
                    "id" : "team-add",
                    "title" : "Create A New Repository Team",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryTeamAdd);

})(jQuery);