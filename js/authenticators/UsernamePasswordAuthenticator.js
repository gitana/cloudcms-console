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
                    $('.ui-dialog-buttonpane button').css("font-size", "1.05em");
                    $('.ui-dialog-buttonpane button').css("margin", "0px");
                    $('.ui-dialog-buttonpane button').css("margin-bottom", "10px");
                    $('.ui-dialog-buttonpane button').css("padding", "0px");
                    $('.ui-widget-overlay').css('opacity','1.0');
                    $('.ui-dialog .ui-dialog-content').css("border", "0px");
                    $('.ui-dialog .ui-dialog-buttonpane').css("background", "#fff");
                    $('.ui-dialog .ui-dialog-content').css("background", "#fff");
                    $('.ui-dialog-buttonset').attr("align", "center");
                    $('.ui-dialog-buttonset').css("float", "none");
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

        logout: function(context, callback) {
            var self = this;
            var platform = Gitana.Authentication.platform;
            platform.logout().then(function() {
                if (callback) {
                    callback();
                }
            });
        }
    });
})(jQuery);