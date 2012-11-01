(function($) {
    Gitana.Console.Pages.StackExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/stacks/{stackId}/export", this.index);
        },

        targetObject: function() {
            return this.stack();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Stack(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Stack(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Stack",
                "description" : "Export stack " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Stack",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Stack",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackExport);

})(jQuery);