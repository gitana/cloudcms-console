(function($) {
    Gitana.Console.Pages.Dashboard = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/dashboard", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Dashboard(this));
        },

        setupBreadcrumb: function() {
            var breadcrumb = [
                {
                    "text" : "My Dashboard"
                }
            ];

            this.breadcrumb(breadcrumb);
        },

        setupNotifications: function() {
            var notifications = [
                {
                    "message" : "Hey there! Welcome to Gitana."
                }
            ];

            this.notifications(notifications);
        },

        setupMyActivities: function () {
            var self = this;
            var pairs = {
                "title" : "My Latest Activities",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'activity', 20),
                "alert" : "",
                "items" : [
                ]
            };

            var pagination = self.defaultPlatformActivitiesPagination();
            Chain(self.platform()).queryActivities({
                "userDomainId": self.user().getDomainId(),
                "userId": self.user().getId()
            },pagination).each( function() {
                    var activityDetails = Gitana.Utils.Activity.activityDetails(self, this);

                    pairs['items'].push({
                        "img" : Gitana.Utils.Image.buildImageUri('objects', activityDetails.iconId, 48),
                        "class" : "block-list-item-img",
                        "value" : activityDetails.itemText + "." + "<div class='block-list-item-desc'>" + " @ " + this.get('timestamp')['timestamp'] + "</div>"
                    });
            }).totalRows(function (totalRows) {
                self.processItemsDashlet(totalRows, pairs, self.listLink('my-activities'));
                self.pairs("my-activities", pairs);
            });

            this.pairs("my-activities", pairs);
        },

        setupDashlets: function(el) {

            this.setupNotifications();
            this.setupMyActivities();

        },

        setupPage : function(el) {

            var page = {
                "title" : "Dashboard",
                "description" : "Your personal dashboard of Cloud CMS.",
                "notifications" : true,
                "dashlets" : [
                    {
                        "id" : "my-activities",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "my-activities"
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    })

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Dashboard);

})(jQuery);