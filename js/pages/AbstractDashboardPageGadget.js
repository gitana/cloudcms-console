(function($) {
    Gitana.CMS.Pages.AbstractDashboardPageGadget = Gitana.CMS.Pages.AbstractPageGadget.extend(
    {
        TEMPLATE: "layouts/console.dashboard",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            this.tokens = el.tokens;

            // load context
            self.loadContext(el, function() {

                // check authorities
                self.checkAuthorities(function(isEntitled ,error) {
                    if (isEntitled) {

                        // set up menu
                        self.setupMenu();

                        // set up breadcrumb
                        self.setupBreadcrumb();

                        // set up toolbar
                        self.setupToolbar();

                        // set up the dashlets
                        self.setupDashlets(el);

                        // set up the page
                        self.setupPage(el);

                        // detect changes to the list and redraw when they occur
                        //self.setupRefreshSubscription(el);

                        // list model
                        var page = self.model(el);

                        // render layout
                        self.renderTemplate(el, self.TEMPLATE, function(el) {
                            Gitana.Utils.UI.contentBox($(el));
                            el.swap();
                            Gitana.Utils.UI.enableTooltip();
                            Gitana.Utils.UI.processBreadcrumb();
                        });
                    } else {
                        self.handleUnauthorizedPageAccess(el, error);
                    }
                });
            });
        },

        defaultLatestItemsPagination: function() {
            return {
                "skip" : 0,
                "limit" : this.consoleSetting('NUMBER_OF_LATEST_ITEMS'),
                "sort": {
                    '_system.created_on.ms': -1
                }
            };
        },

        defaultSnapshotPagination: function() {
            return {
                "skip" : 0,
                "limit" : 1,
                "sort": {
                    '_system.modified_on.ms': -1
                }
            };
        },

        defaultPlatformActivitiesPagination: function() {
            return {
                "skip" : 0,
                "limit" : this.consoleSetting('NUMBER_OF_ACTIVITY_ITEMS'),
                "sort": {
                    'timestamp.ms': -1
                }
            };
        },

        processItemsDashlet: function(totalRows, pairs, link) {
            totalRows = totalRows == null ? 0 : totalRows;
            if (totalRows > this.consoleSetting('NUMBER_OF_LATEST_ITEMS')) {
                /*
                pairs['items'].push({
                    "img" : Gitana.Utils.Image.buildImageUri('browser', 'more', 32),
                    "class" : "block-list-more-item-img",
                    "link" : "#" + link
                });
                */
                pairs['items'].push({
                    "value": "<div class='block-list-item-more'><a href='#" + link + "'>More...</a></div>"
                })
            }
            if (totalRows == 0) {
                pairs['items'].push({
                    "img" : Gitana.Utils.Image.buildImageUri('browser', 'empty', 48),
                    "class" : "block-list-item-img",
                    "value" : "Empty List" + "<div class='block-list-item-desc'>Nothing found.</div>"
                });
            }
        },

        /** Abstract methods **/

        setupDashlets: function(el) {
        }
    });

})(jQuery);