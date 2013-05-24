(function($) {
    Gitana.CMS.Pages.AbstractAdminPageGadget = Gitana.CMS.Pages.AbstractPageGadget.extend(
    {
        TEMPLATE: "layouts/console.admin",

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

                        // set up commands
                        self.setupCommands();

                        // set up the page
                        self.setupPage(el);

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

        commands: function() {
            return this._observable("commands", arguments, {});
        },

        clearCommands: function(key) {
            this._clearObservable(key, "commands");
        },

        addCommand: function(command, key) {
            var _key = key ? key : "commands"
            var commands = this.commands(_key);
            commands.items[command.id] = command;
            this.commands(_key, commands);
            //}
        },

        addCommands: function(newCommands, key) {
            var self = this;
            var _key = key ? key : "commands"
            var commands = this.commands(_key);
            if (! commands.items) {
                commands.items = {};
            }
            $.each(newCommands, function(i, v) {
                self.addCommand(v, key);
            });
        }

    });

})(jQuery);