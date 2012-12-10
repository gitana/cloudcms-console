(function($) {
    Gitana.Console.Pages.IdentityExport = Gitana.CMS.Pages.AbstractDatastoreObjectExport.extend(
    {
        setup: function() {
            this.get("/directories/{directoryId}/identities/{identityId}/export", this.index);
        },

        targetObject: function() {
            return this.identity();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Identity(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Identity(this), items));
        },

        setupPage : function(el) {

            var page = this.buildPage("identity", "Identity");

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.IdentityExport);

})(jQuery);