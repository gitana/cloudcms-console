(function($) {
    Gitana.Console.Pages.StackTeamImport = Gitana.Console.Pages.AbstractObjectTeamImport.extend(
    {
        setup: function() {
            this.get("/stacks/{stackId}/teams/{teamId}/import", this.index);
        },

        contextObject: function() {
            return this.stack();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.StackTeam(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Import"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.StackTeam(this), items));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);
        },

        setupPage : function(el) {

            var page = {
                "title" : "Stack Team Import",
                "description" : "Import an archive to team " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Archive List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'archive', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "forms" :[
                    {
                        "id" : "import",
                        "title" : "Import Archive",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 24),
                        "buttons" :[
                            {
                                "id" : "import-create",
                                "title" : "Import Archive",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackTeamImport);

})(jQuery);