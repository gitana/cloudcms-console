(function($) {
    Gitana.Console.Pages.DefinitionExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/export", this.index);
        },

        targetObject: function() {
            return this.definition();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Definition(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Definition(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Definition",
                "description" : "Export definition " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Definition",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Definition",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DefinitionExport);

})(jQuery);