(function($) {
    Gitana.Console.Pages.AuthenticationGrantExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/authenticationgrants/{authenticationGrantId}/export", this.index);
        },

        targetObject: function() {
            return this.authenticationGrant();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.AuthenticationGrant(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.AuthenticationGrant(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export AuthenticationGrant",
                "description" : "Export authentication grant " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Authentication Grant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Authentication Grant",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AuthenticationGrantExport);

})(jQuery);