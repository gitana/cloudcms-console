(function($) {
    Gitana.Console.Pages.StackAttachmentsManage = Gitana.Console.Pages.AbstractObjectAttachmentsManage.extend(
    {
        SUBSCRIPTION : "stack-attachments",

        FILTER : "stack-attachments-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/stacks/{stackId}/manage/attachments", this.index);
        },

        targetObject: function() {
            return this.stack();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Stack(this,"menu-stack-attachments"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.StackAttachments(this), [
                {
                    "text" : "Manage"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Manage Stack Attachments",
                "description" : "Add, remove or view attachment(s) of stack " + this.friendlyTitle(this.targetObject()) + "."
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackAttachmentsManage);

})(jQuery);