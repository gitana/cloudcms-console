(function($) {
    Gitana.Console.Pages.StackAttachments = Gitana.Console.Pages.AbstractObjectAttachments.extend(
    {
        SUBSCRIPTION : "stack-attachments",

        FILTER : "node-attachments-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/stacks/{stackId}/attachments", this.index);
        },

        targetObject: function() {
            return this.stack();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Stack(this,"menu-stack-attachments"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.StackAttachments(this));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Stack Attachments",
                "description" : "Add, remove or view attachment(s) of stack " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Attachment List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "forms" :[{
                    "id" : "add-attachments",
                    "title" : "Attachment Manager",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 24),
                    "buttons" :[
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackAttachments);

})(jQuery);