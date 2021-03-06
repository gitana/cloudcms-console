(function($) {
    Gitana.Console.Pages.UserProfile = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
    {
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
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : user.getId()
            });
            this._pushItem(pairs.items, {
                "key" : "Name",
                "value" : user.getName()
            });
            this._pushItem(pairs.items, {
                "key" : "Last Name",
                "value" : user.getLastName()
            });
            this._pushItem(pairs.items, {
                "key" : "First Name",
                "value" : user.getFirstName()
            });
            this._pushItem(pairs.items, {
                "key" : "Email",
                "value" : user.getEmail()
            });
            this._pushItem(pairs.items, {
                "key" : "Company",
                "value" : user.getCompanyName()
            });
            this._pushItem(pairs.items, {
                "key" : "Avatar",
                "class" : "avatar-photo",
                "img" : userDetails && userDetails.avatarUrl ? userDetails.avatarUrl : "css/images/themes/" + Gitana.Apps.THEME +"/console/misc/avatar_small.png"
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : user.getSystemMetadata().getModifiedOn().getTimestamp()
            });

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

        setupDashlets : function (el, callback) {
            this.setupProfile();
            this.setupSettings();

            callback();
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

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.UserProfile);

})(jQuery);