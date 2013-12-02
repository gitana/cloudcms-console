(function($) {

    Gitana.CMS.UsernamePasswordAuthenticator = Ratchet.Authenticators.GitanaUsernamePasswordAuthenticator.extend({

        loginDialog : function(context, username, password, successCallback, failureCallback, retry) {
            var self = this;

            var options = {
                "fields": {
                    "username": {
                        "type": "text"
                    },
                    "password": {
                        "type": "password"
                    }
                }
            };

            if (retry) {
                options.fields.password['helper'] = "Login Failed. Try Again!";
            }

            // launch the dialog
            var appName = Gitana.Apps.APP_NAME;
            var dialog = $('<div title="Cloud CMS ' + appName.charAt(0).toUpperCase() + appName.slice(1) +'"></div>');
            dialog.alpaca({
                "data": {
                    "username" : username ? username : "",
                    "password" : password ? password : ""
                },
                "schema": {
                    "type": "object",
                    "properties": {
                        "username": {
                            "title": "Username",
                            "type": "string"
                        },
                        "password": {
                            "title": "Password",
                            "type": "string"
                        }
                    }
                },
                "options": options,
                "view": {
                    'parent' : 'VIEW_WEB_EDIT_LIST'
                },
                "postRender": function(control) {
                    dialog.dialog({
                        resizable: false,
                        height: 300,
                        width: 500,
                        modal: true,
                        closeOnEscape: false,
                        buttons: {
                            "Login": function() {
                                var form = control.getValue();

                                self.username = form["username"];
                                self.password = form["password"];

                                if (control.isValid(true)) {
                                    // close the dialog
                                    $('.ui-widget-overlay').css('opacity','0.3');
                                    $(dialog).dialog("close");

                                    self._authenticate(context, self.username, self.password, successCallback, failureCallback);
                                }
                            }
                        }
                    }).height('auto');
                    $('.ui-dialog').css("overflow", "hidden");
                    $('.ui-dialog-buttonpane').css("overflow", "hidden");
                    $('.ui-dialog-buttonpane').css("border-bottom-left-radius", "4px");
                    $('.ui-dialog-buttonpane').css("border-bottom-right-radius", "4px");
                    $('.ui-dialog-titlebar').find('a').hide();
                    $('.ui-dialog-buttonpane button').css("font-size", "12px");
                    $('.ui-dialog-buttonpane button').css("font-weight", "600");
                    $('.ui-dialog-buttonpane button').css("margin", "0px");
                    $('.ui-dialog-buttonpane button').css("margin-bottom", "10px");
                    $('.ui-dialog-buttonpane button').css("padding", "5px");
                    $('.ui-widget-overlay').css('opacity','1.0');
                    $('.ui-dialog .ui-dialog-content').css("border", "0px");
                    $('.ui-dialog .ui-dialog-buttonpane').css("background", "#fff");
                    $('.ui-dialog .ui-dialog-content').css("background", "#fff");
                    $('.ui-dialog-buttonset').attr("align", "center");
                    $('.ui-dialog-buttonset').css("float", "none");
                    $('.ui-dialog-titlebar .ui-dialog-titlebar-close').css("display", "none");
                    var buttons = dialog.dialog("option", "buttons");
                    var passwordControl = control.getControlByPath("password");
                    passwordControl.field.keypress(function(e) {
                        if (e.which == 13) {
                            buttons['Login']();
                        }
                    });
                }
            });
        },

        postLogin: function(platform, context, callback)
        {
            var self = this;

            var authInfo = platform.getDriver().getAuthInfo();
            context.observable("authInfo").set(authInfo);

            // populate tenantDetails
            self.populateTenantDetails(context, authInfo, function() {

                var userName = authInfo.getPrincipalName();
                var domainId = authInfo.getPrincipalDomainId();

                platform.readDomain(domainId).then(function() {
                    context.observable("domain").set(this);
                    this.readPrincipal(userName).then(function() {
                        self.populateAuthenticatedUser(context, this, function() {
                            callback();
                        });
                    });
                });
            });
        },

        postLogout: function(callback)
        {
            callback();
        },

        /*

         logout: function(context, callback) {
         var self = this;
         Gitana.Authentication.platform().logout().then(function() {
         if (callback) {
         callback();
         }
         });
         }
         */

        populateTenantDetails: function(context, authInfo, callback)
        {
            // we build up an object to hold tenant info
            var tenantDetails = {
                "id": authInfo.getTenantId(),
                "title": authInfo.getTenantTitle(),
                "description": authInfo.getTenantDescription(),
                "friendlyName": authInfo.getTenantTitle() ? authInfo.getTenantTitle() : authInfo.getTenantId(),
                "avatarUrl": "" // TODO: platform attachment?
            };

            var platform = Gitana.Authentication.platform();
            tenantDetails['avatarUrl'] = platform.getTenantPreviewUri("avatar48", {
                "attachment": "avatar",
                "size": 48,
                "timestamp": new Date().getTime()
            });

            // update tenant observable
            context.observable("tenantDetails").set(tenantDetails);

            callback();
        },

        populateAuthenticatedUser: function(context, user, callback)
        {
            // update user observable
            context.observable("user").set(user);
            context.observable("userRoles").set({});

            // update user details observable
            var userDetails = user;
            userDetails['friendlyName'] = user["firstName"] ? user["firstName"] : user["name"];
            userDetails['fullName'] = user["firstName"] && user["lastName"] ? user["firstName"] + " " + user["lastName"] : userDetails['friendlyName'];
            userDetails['avatarUrl'] = user.getPreviewUri("avatar48", {
                "attachment": "avatar",
                "size": 48,
                "timestamp": new Date().getTime()
            });

            // load user settings
            context.observable("userDetails").set(userDetails);

            callback();
        }
    });
})(jQuery);