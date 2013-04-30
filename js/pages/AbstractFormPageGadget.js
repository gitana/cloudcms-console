(function($) {
    Gitana.CMS.Pages.AbstractFormPageGadget = Gitana.CMS.Pages.AbstractPageGadget.extend(
    {
        TEMPLATE: "layouts/console.form",

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
                        self.setupBreadcrumb(el);

                        // set up toolbar
                        // self.setupToolbar(el);

                        // set up the page
                        self.setupPage(el);

                        // detect changes to the list and redraw when they occur
                        self.setupRefreshSubscription(el);

                        // list model
                        var page = self.model(el);

                        // render layout
                        self.renderTemplate(el, self.TEMPLATE, function(el) {

                            /*
                            Gitana.Utils.UI.contentBox($(el));
                            Gitana.Utils.UI.jQueryUIDatePickerPatch();
                            */

                            self.asyncSetupForms(el, function() {

                                el.swap(function(newEl) {

                                    Gitana.Utils.UI.contentBox();
                                    Gitana.Utils.UI.jQueryUIDatePickerPatch();

                                    Gitana.Utils.UI.enableTooltip();
                                    Gitana.Utils.UI.processBreadcrumb();

                                    self.asyncProcessForms(el, newEl, function() {});
                                });
                            });
                        });
                    } else {
                        self.handleUnauthorizedPageAccess(el, error);
                    }
                });
            });
        },

        /** Abstract methods **/
        asyncSetupForms: function(el, callback) {
            this.setupForms(el);
            callback();
        },

        setupForms: function(el) {
        },

        asyncProcessForms: function(el, newEl, callback) {
            this.processForms(el);
            callback();
        },

        processForms: function(el) {
        }
    });

})(jQuery);