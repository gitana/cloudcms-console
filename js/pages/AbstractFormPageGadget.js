(function($) {
    Gitana.CMS.Pages.AbstractFormPageGadget = Gitana.CMS.Pages.AbstractPageGadget.extend(
    {
        TEMPLATE: "layouts/console.form",

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
                        self.setupBreadcrumb(el);

                        // set up toolbar
                        // self.setupToolbar(el);

                        // set up the page
                        self.setupPage(el);

                        // detect changes to the list and redraw when they occur
                        self.subscribe(this.subscription, this.refresh);

                        // list model
                        var page = self.model(el);

                        // render layout
                        self.renderTemplate(el, self.TEMPLATE, function(el) {

                            Gitana.Utils.UI.contentBox($(el));

                            Gitana.Utils.UI.jQueryUIDatePickerPatch();

                            self.asyncSetupForms(el, function() {

                                el.swap(function(newEl) {

                                    Gitana.Utils.UI.enableTooltip();
                                    Gitana.Utils.UI.processBreadcrumb();

                                    self.asyncProcessForm(el, function() {});
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

        asyncProcessForm: function(el, callback) {
            this.processForm(el);
            callback();
        },

        processForm: function(el) {
        }
    });

})(jQuery);