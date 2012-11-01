(function($) {
    Gitana.Console.Pages.DomainUserExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/domains/{domainId}/users/{userId}/export", this.index);
        },

        targetObject: function() {
            return this.principalUser();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.DomainUser(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainUser(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export User",
                "description" : "Export user " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export User",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export User",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainUserExport);

})(jQuery);