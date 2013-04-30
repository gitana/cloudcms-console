(function($) {
    Gitana.CMS.Pages.AbstractListFormPageGadget = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        TEMPLATE: "layouts/console.list.form",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return {
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title",
                        "type": "string"
                    },
                    "description": {
                        "title": "Description",
                        "type": "string"
                    }
                }
            }
        },

        options: function() {
            return {
                "fields": {
                    "title" : {
                        "size" : 60,
                        "helper" : "Enter object title."
                    },
                    "description": {
                        "type": "textarea",
                        "cols" : 60,
                        "helper" : "Enter object description."
                    }
                }
            }
        },

        index: function(el) {
            var self = this;

            this.tokens = el.tokens;

            // load context
            self.loadContext(el, function() {

                // check authorities
                self.checkAuthorities(function(isEntitled, error) {
                    if (isEntitled) {
                        // set up menu
                        self.setupMenu();

                        // set up breadcrumb
                        self.setupBreadcrumb();

                        // set up toolbar
                        self.setupToolbar();

                        // set up filter
                        self.setupFilter(el);

                        // set up the list
                        self.setupList(el);

                        // set up the dashlets
                        self.setupDashlets(el);

                        // set up the page
                        self.setupPage(el);

                        // detect changes to the list and redraw when they occur
                        self.setupRefreshSubscription(el);

                        if (self.filterSubscription) {
                            self.subscribe(self.filterSubscription, self.refreshHandler(el));
                        }

                        // list model
                        var page = self.model(el);

                        // render layout
                        self.renderTemplate(el, self.TEMPLATE, function(el) {

                            Gitana.Utils.UI.jQueryUIDatePickerPatch();

                            Gitana.Utils.UI.contentBox($(el));

                            self.setupForms(el);

                            el.swap();

                            self.processList(el);

                            Gitana.Utils.UI.processBreadcrumb();

                        });
                    } else {
                        self.handleUnauthorizedPageAccess(el, error);
                    }
                });
            });
        },

        /** Abstract methpds **/
        setupForms: function(el) {
        }
    });

})(jQuery);