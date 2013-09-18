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

            var breadcrumb = [{
                "text" : "My Dashboard"
            }];

            this.breadcrumb(breadcrumb);
        },

        setupNotifications: function(el) {

            var self = this;

            var model = {
                "name": this.userDetails().fullName
            };

            Gitana.Utils.Render.processRootTemplate("templates/notifications/dashboard-welcome-notification/notification.html", model, function(html) {

                var notifications = [{
                    "body" : html
                }];

                self.notifications(notifications);

            });

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
                        "img": activityDetails.userAvatarUri,
                        "value" : "<div class='block-list-item-div'><div class='block-list-item-text'>" + activityDetails.itemText + "</div><div class='block-list-item-desc'> @ " + this.get('timestamp')['timestamp'] + "</div></div>"
                    });
            }).totalRows(function (totalRows) {
                self.processItemsDashlet(totalRows, pairs, self.listLink('my-activities'));
                self.pairs("my-activities", pairs);
            });

            this.pairs("my-activities", pairs);
        },

        setupDashlets: function(el, callback) {

            this.setupNotifications(el);
            this.setupMyActivities();

            callback();
        },

        setupPage : function(el) {

            var msgContext = {
                "userFullName": this.userDetails().fullName
            };

            var page = {
                "title": _msg("Personal.Dashboard.title", msgContext),
                "description": _msg("Personal.Dashboard.description", msgContext),
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

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Dashboard);

})(jQuery);