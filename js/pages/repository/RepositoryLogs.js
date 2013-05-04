(function($) {
    Gitana.Console.Pages.RepositoryLogs = Gitana.Console.Pages.PlatformLogs.extend(
    {
        SUBSCRIPTION : "repository-logs",

        FILTER : "repository-logs-filters",

        setup: function() {
            this.get("/repositories/{repositoryId}/logs", this.index);
        },

        targetObject: function() {
            return this.repository();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Repository(this, "menu-repository-logs"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.RepositoryLogs(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
        },

        setupPage : function(el) {
            var page = {
                "title" : "Repository Logs",
                "description" : "Display list of log entries of repository " + this.friendlyTitle(this.targetObject()) +".",
                "listTitle" : "Log Entry List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'logs', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryLogs);

})(jQuery);