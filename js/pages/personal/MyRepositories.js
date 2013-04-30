(function($) {
    Gitana.Console.Pages.MyRepositories = Gitana.Console.Pages.Repositories.extend(
    {
        SUBSCRIPTION : "my-repositories",

        FILTER : "my-repository-list-filters",

        setup: function() {
            this.get("/dashboard/repositories", this.index);
        },

        requiredAuthorities: function() {
            return [
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Dashboard(this,"menu-my-repositories"));
        },

        setupBreadcrumb: function() {
            var breadcrumb = [
                {
                    "text" : "My Repositories"
                }
            ];

            this.breadcrumb(breadcrumb);
        },

        setupPage : function(el) {
            var page = {
                "title" : "My Repositories",
                "description" : "Display list of my repositories",
                "listTitle" : "Repository List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'repository', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.MyRepositories);

})(jQuery);