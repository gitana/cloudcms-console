(function($) {
    Gitana.Console.Pages.ConnectionExport = Gitana.CMS.Pages.AbstractDatastoreObjectExport.extend(
    {
        setup: function() {
            this.get("/directories/{directoryId}/connections/{connectionId}/export", this.index);
        },

        targetObject: function() {
            return this.connection();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Connection(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Connection(this), items));
        },

        setupPage : function(el) {

            var page = this.buildPage("connection", "Connection");

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ConnectionExport);

})(jQuery);