(function($) {
    Gitana.Console.Pages.UserProfile = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/profile", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Dashboard(this,"menu-my-profile"));
        },

        setupBreadcrumb: function() {
             return this.breadcrumb(Gitana.Console.Breadcrumb.MyProfile(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "edit",
                    "title": "Edit Profile",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-edit', 48),
                    "url" : "#/profile/edit"
                }
            ]);
        },

        setupProfile: function () {
            var self = this;
            var user = self.user();
            var userDetails = self.userDetails();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : user.getId()
                    },
                    {
                        "key" : "Name",
                        "value" : user.getName()
                    },
                    {
                        "key" : "Last Name",
                        "value" : user.getLastName() ? user.getLastName() : ""
                    },
                    {
                        "key" : "First Name",
                        "value" : user.getFirstName() ? user.getFirstName() : ""
                    },
                    {
                        "key" : "Email",
                        "value" : user.getEmail() ? user.getEmail() : ""
                    },
                    {
                        "key" : "Company",
                        "value" : user.getCompanyName() ? user.getCompanyName() : ""
                    },
                    {
                        "key" : "Avatar",
                        "class" : "avatar-photo",
                        "img" : userDetails && userDetails.avatarUrl ? userDetails.avatarUrl : "css/images/themes/" + Gitana.Apps.THEME +"/console/misc/avatar_small.png"
                    },
                    {
                        "key" : "Last Modified",
                        "value" : user.getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            this.pairs("profile-pairs",pairs);
        },

        setupSettings: function () {
            var self = this;
            var pairs = {
                "title" : "Settings",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-settings', 20),
                "alert" : "",
                "class" : "item-list item-list-long-left",
                "items" : []
            };

            var userConsoleAppSettings = this.consoleAppSettings();

            $.each(Gitana.Console.Settings.Schema['properties'], function(key,value) {
                var setting = userConsoleAppSettings[key];
                var keyTitle = value['title'];
                pairs.items.push({
                    "key" : keyTitle,
                    "value" : setting
                })
            });

            this.pairs("settings-pairs",pairs);
        },

        setupDashlets : function () {
            this.setupProfile();
            this.setupSettings();
        },

        setupPage : function(el) {

            var msgContext = {
                "userFullName": this.userDetails().fullName
            };

            var page = {
                "title" : _msg("Personal.MyProfile.title", msgContext),
                "description" : _msg("Personal.MyProfile.description", msgContext),
                "dashlets" :[{
                    "id" : "pairs",
                    "grid" : "grid_12",
                    "gadget" : "pairs",
                    "subscription" : "profile-pairs"
                },{
                    "id" : "settings",
                    "grid" : "grid_12",
                    "gadget" : "pairs",
                    "subscription" : "settings-pairs"
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.UserProfile);

})(jQuery);