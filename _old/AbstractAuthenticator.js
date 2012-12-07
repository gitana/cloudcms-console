(function($) {
    Gitana.CMS.AbstractAuthenticator = Base.extend({

        constructor: function() {
            this.base();
        },

        /**
         * Extension point - runs ahead of page load to facilitate integration with external auth services
         */
        preload: function()
        {
        },

        getURLParameters: function() {

            var urlParams = {};

            if (window.location.href.indexOf('?') == -1) {
                return urlParams;
            }

            var params = window.location.href.split('?')[1].split("&"), length = params.length, current;

            if (params[ 0 ]) {
                for (var i = 0; i < length; i++) {
                    current = params[ i ].split("=");
                    current[ 0 ] = decodeURIComponent(current[ 0 ]);
                    // allow just a key to turn on a flag, e.g., test.html?noglobals
                    current[ 1 ] = current[ 1 ] ? decodeURIComponent(current[ 1 ]) : true;
                    urlParams[ current[ 0 ] ] = current[ 1 ];
                }
            }

            return urlParams;
        },

        populateAuthenticatedUser: function (context, user) {
            // update user observable
            context.observable("user").set(user);
            context.observable("userRoles").set({});

            // update user details observable
            var userDetails = user.object;
            userDetails['friendlyName'] = user.getFirstName() ? user.getFirstName() : user.getName();
            userDetails['fullName'] = user.getFirstName() && user.getLastName() ? user.getFirstName() + ' ' + user.getLastName() : userDetails['friendlyName'];
            user.attachment('avatar').trap(function() {
                context.observable("userDetails").set(userDetails);
            }).then(function() {
                if (this.getLength() > 0) {
                    userDetails['avatarUrl'] = this.getDownloadUri()+ "?timestamp=" + new Date().getTime();
                }
                // load user settings
                context.observable("userDetails").set(userDetails);
            });
        },

        populateTenant: function (context, authInfo) {

            // we build up an object to hold tenant info
            var tenantDetails = {
                "id": authInfo.getTenantId(),
                "title": authInfo.getTenantTitle(),
                "description": authInfo.getTenantDescription(),
                "friendlyName": authInfo.getTenantTitle() ? authInfo.getTenantTitle() : authInfo.getTenantId(),
                "avatarUrl": "" // TODO: platform attachment?
            };

            var platform = context.topRatchet().platform;

            platform.tenantAttachment('avatar').trap(function() {
                context.observable("tenantDetails").set(tenantDetails);
            }).then(function() {
                if (this.getLength() > 0) {
                    tenantDetails['avatarUrl'] = this.getDownloadUri()+ "?timestamp=" + new Date().getTime();
                }
                // load user settings
                context.observable("tenantDetails").set(tenantDetails);
            });

            // update user observable
            //context.observable("tenantDetails").set(tenantDetails);
        },

        authenticate: function(context, successCallback, failureCallback) {
        },

        loginDialog: function(context, successCallback, failureCallback, retry) {
        },

        logout: function(context,callback) {
        }
    });

})(jQuery);