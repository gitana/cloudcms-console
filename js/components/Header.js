(function($) {
    Gitana.Console.Components.Header = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/header",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            this.subscribe(this.subscription, this.refresh);

            this.model(el);

            // render
            self.renderTemplate(el, self.TEMPLATE, function(el) {
                var imageUrl = $('#login-user-avatar',$(el)).attr('src');
                if (imageUrl == null || imageUrl != 'css/images/themes/default/console/misc/avatar_small.png') {
                    $('#login-user-avatar',$(el)).attr('src',$('#login-user-avatar',$(el)).attr('data-src'));
                }

                // Add logout button
                $('.logout',$(el)).click(function() {
                    self.app().authenticator.logout(self,function() {
                        Gitana.CMS.refresh();
                    });
                });
                el.swap();
            });

            // Recent History

            $('body').undelegate('.recent-history-icon', 'click').delegate('.recent-history-icon', 'click', function() {
                var message = "<div class='recent-history block-content'><ul class='item-list'>";

                var history = self.history();

                for (var i = history.length - 1; i >= 0; i--) {
                    message += "<li>";
                    message += "<div class='page-title' data-url='" + history[i].url + "'>" + history[i].title + "</div>";
                    message += "<div class='page-description'>" + history[i].timestamp + "<br/>" +history[i].description + "</div>";

                    if (history[i].breadcrumb) {
                        var breadcrumb = history[i].breadcrumb;
                        message += "<div class='page-description'>";
                        for (var j = 0; j < breadcrumb.length; j++) {
                            var breadcrumbItem = breadcrumb[j];
                            message += "<a href='" + (breadcrumbItem.link ? "#" + breadcrumbItem.link : "javascript:void(0);") + "'>" + breadcrumbItem.text + "</a>";
                            if (j != breadcrumb.length -1) {
                                message += " > ";
                            }
                        }
                        message += "</div>";
                    }

                    message += "</li>";
                }

               message += "</ul>";

                if (history.length > 0) {
                    message += "<div class='clear-history'><span class='button red'>Clear History</span></div>";
                }

                message += "</div>";

                var dialog = $(message).dialog({
                    title : "<img src='" + Gitana.Utils.Image.buildImageUri("special", "history", 20) + "' /> Recent History",
                    resizable: true,
                    height: 450,
                    width: 800,
                    modal: true
                }).height('auto');

                $('body').undelegate('.recent-history li div a', 'click').delegate('.recent-history li div a', 'click', function() {
                    dialog.dialog('close');
                });

                $('body').undelegate('.recent-history .page-title', 'click').delegate('.recent-history .page-title', 'click', function() {
                    dialog.dialog('close');
                    self.app().run('GET', $(this).attr('data-url'));
                });

                $('body').undelegate('.recent-history .clear-history', 'click').delegate('.recent-history .clear-history', 'click', function() {
                    self.clearHistory();
                    $('.recent-history').empty();
                    dialog.dialog('close');
                });
            });

            // Clipboard

            $('body').undelegate('.clipboard-icon', 'click').delegate('.clipboard-icon', 'click', function() {
                var message = "<div class='clipboard block-content'>";

                var clipboard = self.clipboard();
                if (clipboard && clipboard.length > 0)
                {
                    message += "<ul class='item-list'>";
                    for (var i = clipboard.length - 1; i >= 0; i--) {
                        var title = self.friendlyTitle(clipboard[i].object);
                        var description = clipboard[i].object.getDescription() ? clipboard[i].object.getDescription() : "";
                        message += "<li data-index='" + i + "'><span class='sprite-48 sprite-48-pairs " + clipboard[i].icon +"'></span>" + title ;
                        message += "<div class='block-list-item-desc'>" + description + "</div></li>";
                    }
                    message += "</ul>";
                }
                else
                {
                    message += "<p align='center'>";
                    message += "<br/>";
                    message += "<br/>";
                    message += "Your clipboard is currently empty.";
                    message += "<br/>";
                    message += "<br/>";
                    message += "<br/>";
                    message += "</p>"
                }

                if (clipboard.length > 0) {
                    message += "<div class='clear-clipboard'><span class='button red'>Clear Clipboard</span></div>";
                }

                message += "</div>";

                var dialog = $(message).dialog({
                    title : "<img src='" + Gitana.Utils.Image.buildImageUri("browser", "clipboard", 20) + "' /> Clipboard",
                    resizable: true,
                    height: 450,
                    width: 800,
                    modal: true
                }).height('auto');

                $('body').undelegate('.clipboard .clear-clipboard', 'click').delegate('.clipboard .clear-clipboard', 'click', function() {
                    self.clearClipboard();
                    $('.clipboard').empty();
                    dialog.dialog('close');
                });
            });

            // My favorites

            var getFavorites = function(myFavorites) {
                var message = "";

                if (myFavorites && myFavorites.length > 0)
                {
                    for (var i = myFavorites.length - 1; i >= 0; i--) {
                        message += "<li data-index='" + i + "'>";
                        message += "<div class='page-title'><a href='#" + myFavorites[i].url + "'>" + myFavorites[i].title + "</a><span class='my-favorites-item-buttonbar'><span class='my-favorites-item-delete-button' title='Remove this item from My Favorites' data-index='" + i + "'></span></span></div>";
                        message += "<div class='page-description'>" + myFavorites[i].timestamp + "<br/>" +myFavorites[i].description + "</div>";

                        if (myFavorites[i].breadcrumb) {
                            var breadcrumb = myFavorites[i].breadcrumb;
                            message += "<div class='page-description'>";
                            for (var j = 0; j < breadcrumb.length; j++) {
                                var breadcrumbItem = breadcrumb[j];
                                message += "<a href='" + (breadcrumbItem.link ? "#" + breadcrumbItem.link : "javascript:void(0);") + "'>" + breadcrumbItem.text + "</a>";
                                if (j != breadcrumb.length -1) {
                                    message += " > ";
                                }
                            }
                            message += "</div>";
                        }

                        message += "</li>";
                    }
                }
                else
                {
                    message += "<p align='center'>";
                    message += "<br/>";
                    message += "<br/>";
                    message += "Your My Favorites list is currently empty.";
                    message += "<br/>";
                    message += "<br/>";
                    message += "<br/>";
                    message += "</p>"
                }

                return message;
            };

            $('body').undelegate('.my-favorites-icon', 'click').delegate('.my-favorites-icon', 'click', function() {
                var message = "<div class='my-favorites block-content'><ul class='item-list'>";

                var myFavorites = self.consoleAppSettings()['MY_FAVORITES'] ? self.consoleAppSettings()['MY_FAVORITES'] : [];

                message += getFavorites(myFavorites);

                message += "</ul>";

                message += "<div class='my-favorites-buttonbar'><span class='button add-my-favorites'>Add Current Page</span>";
                if (myFavorites.length > 0) {
                    message += "<span class='button red clear-my-favorites'>Clear My Favorites</span>";
                }

                message += "</div></div>";

                $(".ui-dialog").remove();
                var dialog = $(message).dialog({
                    title : "<img src='" + Gitana.Utils.Image.buildImageUri("browser", "my-favorites", 20) + "' /> My Favorites",
                    resizable: true,
                    height: 450,
                    width: 800,
                    modal: true
                }).height('auto');

                var updateMyConsoleAppSettings = function() {
                    var myConsoleAppSettings = self.myConsoleAppSettings();
                    Chain(myConsoleAppSettings).then(function() {
                        if (!this["settings"]) {
                            this["settings"] = {};
                        }
                        if (!this["settings"]['MY_FAVORITES']) {
                            this["settings"]['MY_FAVORITES'] = [];
                        }
                        this["settings"]['MY_FAVORITES'] = myFavorites;
                        this.update().reload().then(function() {
                            $('.my-favorites .item-list').empty().append(getFavorites(myFavorites));
                        })
                    });
                };

                $('body').undelegate('.my-favorites .add-my-favorites', 'click').delegate('.my-favorites .add-my-favorites', 'click', function() {
                    myFavorites.push(self.page());
                    self.consoleAppSettings()['MY_FAVORITES'] = myFavorites;
                    updateMyConsoleAppSettings();
                });

                $('body').undelegate('.my-favorites .clear-my-favorites', 'click').delegate('.my-favorites .clear-my-favorites', 'click', function() {
                    myFavorites = [];
                    self.consoleAppSettings()['MY_FAVORITES'] = [];
                    updateMyConsoleAppSettings();
                });

                $('body').undelegate('.my-favorites li div a', 'click').delegate('.my-favorites li div a', 'click', function() {
                    dialog.dialog('close');
                });

                $('body').undelegate('.my-favorites span.my-favorites-item-delete-button', 'click').delegate('.my-favorites span.my-favorites-item-delete-button', 'click', function() {
                    var dataIndex = $(this).attr('data-index');
                    myFavorites.splice(dataIndex,1);
                    self.consoleAppSettings()['MY_FAVORITES'] = myFavorites;
                    updateMyConsoleAppSettings();
                });
            });

            /*

            $('body').bind('no-match', function(event, param) {

                if (param.route.uri != "/error" && !Alpaca.isValEmpty(self.ratchet().routes)) {
                    self.error({
                        "http" : {
                            "status" : "404"
                        },
                        "message" :  "The URI " + param.route.uri + " could not be found"
                    });

                    self.app().run('GET',"/error");

                }
                return false;

            });

            */
        }
    });

    Ratchet.GadgetRegistry.register("header", Gitana.Console.Components.Header);

})(jQuery);