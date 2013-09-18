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
                        "size" : 60
                    },
                    "description": {
                        "type": "textarea",
                        "cols" : 60
                    }
                }
            }
        },

        index: function(el, callback) {
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

                            self.setupForms(el, function() {

                                el.swap(function(swappedEl) {

                                    Gitana.Utils.UI.contentBox();
                                    Gitana.Utils.UI.jQueryUIDatePickerPatch();

                                    Gitana.Utils.UI.enableTooltip();
                                    Gitana.Utils.UI.processBreadcrumb();

                                    self.processForms(el, swappedEl, function() {

                                        if (callback)
                                        {
                                            callback();
                                        }
                                    });
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
        setupForms: function(el, callback) {
            callback();
        },

        processForms: function(el, newEl, callback) {
            callback();
        }
    });

})(jQuery);