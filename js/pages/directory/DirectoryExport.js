(function($) {
    Gitana.Console.Pages.DirectoryExport = Gitana.CMS.Pages.AbstractDatastoreExport.extend(
    {
        setup: function() {
            this.get("/directories/{directoryId}/export", this.index);
        },

        targetObject: function() {
            return this.directory();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Directory(this));
        },

        setupBreadcrumb: function(el) {
            var items = [{
                "text" : "Export"
            }];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Directory(this), items));
        },

        setupPage : function(el) {
            return this.buildPage(el, "Directory");
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DirectoryExport);

})(jQuery);