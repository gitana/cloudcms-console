(function($) {
    Gitana.Console.Pages.StackTeamAdd = Gitana.Console.Pages.AbstractObjectTeamAdd.extend(
    {
        setup: function() {
            this.get("/stacks/{stackId}/add/team", this.index);
        },

        targetObject: function() {
            return this.stack();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Stack(this, "menu-stack-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.StackTeams(this), [
                {
                    "text" : "New Team"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Stack Team",
                "description" : "Create a new stack team.",
                "forms" :[{
                    "id" : "team-add",
                    "title" : "Create A New Stack Team",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackTeamAdd);

})(jQuery);