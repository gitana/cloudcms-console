(function($) {
    Gitana.Console.Pages.StackLogs = Gitana.Console.Pages.PlatformLogs.extend(
    {
        SUBSCRIPTION : "stack-logs",

        FILTER : "stack-logs-filters",

        setup: function() {
            this.get("/stacks/{stackId}/logs", this.index);
        },

        targetObject: function() {
            return this.stack();
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
           this.menu(Gitana.Console.Menu.Stack(this, "menu-stack-logs"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.StackLogs(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
        },

        setupPage : function(el) {
            var page = {
                "title" : "Stack Logs",
                "description" : "Display list of log entries of stack " + this.friendlyTitle(this.targetObject()) +".",
                "listTitle" : "Log Entry List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'logs', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackLogs);

})(jQuery);