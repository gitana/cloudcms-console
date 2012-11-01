(function($) {
    Gitana.Console.Pages.DomainGroupExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/domains/{domainId}/groups/{groupId}/export", this.index);
        },

        targetObject: function() {
            return this.group();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.DomainGroup(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainGroup(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Group",
                "description" : "Export group " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Group",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainGroupExport);

})(jQuery);