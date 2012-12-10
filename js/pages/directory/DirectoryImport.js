(function($) {
    Gitana.Console.Pages.DirectoryImport = Gitana.CMS.Pages.AbstractDatastoreImport.extend(
        {
            setup: function() {
                this.get("/directories/{directoryId}/import", this.index);
            },

            targetObject: function() {
                return this.directory();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Directory(this));
            },

            setupBreadcrumb: function(el) {
                var items = [
                    {
                        "text" : "Import"
                    }
                ];

                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Directory(this), items));
            },

            containerType: function() {
                return 'directory';
            },

            setupPage : function(el) {
                return this.buildPage(el, "Directory");
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DirectoryImport);

})(jQuery);