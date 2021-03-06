(function($) {
    Gitana.Console.Pages.Error = Gitana.Console.AbstractGitanaConsoleGadget.extend(
    {
        TEMPLATE: "layouts/console.error",

        DEFAULT_URL: "/error",

        SUBSCRIPTION: "error",

        setup: function() {
            this.get(this.DEFAULT_URL, this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Error(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Error(this));
        },        

        index: function(el, callback) {
            var self = this;

            // load context
            self.loadContext(el, function() {

                // set up menu
                self.setupMenu();

                // set up breadcrumb
                self.setupBreadcrumb(el);

                // set up the page
                self.setupPage(el);

                // detect changes to the error and redraw when they occur
                self.subscribe(self.SUBSCRIPTION, self.refreshHandler(el));

                // list model
                var page = self.model(el);

                // render layout
                self.renderTemplate(el, self.TEMPLATE, function(el) {

                    Gitana.Utils.UI.contentBox(el);

                    Gitana.Utils.UI.jQueryUIDatePickerPatch();

                    el.swap(function(swappedEl) {

                        Gitana.Utils.UI.enableTooltip();

                        Gitana.Utils.UI.processBreadcrumb();

                        if (callback)
                        {
                            callback();
                        }
                    });

                });
            });
        },

        /** ABSTRACT **/
        setupPage: function(el) {

            var error = this.error();

            error.icon = Gitana.Utils.Image.buildImageUri('special', 'warning', 24);

            var page = {
                "title" : "Error",
                "description" : "An error has occurred that requires your attention.",
                "error" : this.error()
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });
    
    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Error);    

})(jQuery);