(function($) {
    Gitana.Console.Pages.RepositoryTeamExport = Gitana.Console.Pages.AbstractObjectTeamExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/teams/{teamId}/export", this.index);
        },

        contextObject: function() {
            return this.repository();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.RepositoryTeam(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.RepositoryTeam(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Team",
                "description" : "Export team " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Team",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryTeamExport);

})(jQuery);