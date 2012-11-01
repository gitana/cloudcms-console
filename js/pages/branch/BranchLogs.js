(function($) {
    Gitana.Console.Pages.BranchLogs = Gitana.Console.Pages.PlatformLogs.extend(
    {
        SUBSCRIPTION : "branch-logs",

        FILTER : "branch-logs-filters",

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/logs", this.index);
        },

        targetObject: function() {
            return this.branch();
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
           this.menu(Gitana.Console.Menu.Branch(this, "menu-branch-logs"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.BranchLogs(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
        },

        setupPage : function(el) {
            var page = {
                "title" : "Branch Logs",
                "description" : "Display list of log entries of branch " + this.friendlyTitle(this.branch()) +".",
                "listTitle" : "Log Entry List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'logs', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BranchLogs);

})(jQuery);