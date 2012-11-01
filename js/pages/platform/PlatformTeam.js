(function($) {
    Gitana.Console.Pages.PlatformTeam = Gitana.Console.Pages.AbstractObjectTeam.extend(
    {
        SUBSCRIPTION : "platform-team-page",

        FILTER : "platform-team-member-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/teams/{teamId}", this.index);
        },

        contextObject: function() {
            return this.platform();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.PlatformTeam(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.PlatformTeam(this));
        },

        loadContext: function(el, callback) {
            var self = this;

            Chain(self.contextObject()).trap(function(error) {
                return self.handlePageError(el,error);
            }).then(function() {

                var platform = self.platform();

                // Load user console settings
                var authInfo = platform.getDriver().getAuthInfo();
                var principalDomainId = authInfo.getPrincipalDomainId();
                var principalId = authInfo.getPrincipalId();
                var myConsoleAppSettings = {};

                // TODO : update it once we are able to read application by key.
                var currentConsoleSetting = self.consoleAppSettings();
                if (Alpaca.isValEmpty(currentConsoleSetting)) {
                    this.subchain(platform).queryApplications({
                        "key" : "console"
                    }).count(function(count) {
                        if (count > 0) {
                            this.keepOne().then(function() {
                                var consoleAppDefaultSettings, consoleAppUserSettings;
                                this.readApplicationSettings().then(function(){
                                    consoleAppDefaultSettings = this.getSettings();
                                });
                                this.readApplicationPrincipalSettings(principalDomainId,principalId).then(function(){
                                    consoleAppUserSettings = this.getSettings();
                                });
                                this.then(function() {
                                    Alpaca.mergeObject(myConsoleAppSettings,Gitana.Console.Settings.Default);
                                    Alpaca.mergeObject(myConsoleAppSettings,consoleAppDefaultSettings);
                                    Alpaca.mergeObject(myConsoleAppSettings,consoleAppUserSettings);
                                    self.consoleAppSettings(myConsoleAppSettings);
                                })
                            });
                        }
                    });
                }

                var teamId = el.tokens["teamId"];
                if (teamId) {
                    this.readTeam(teamId).then(function() {
                        self.team(this);
                        var groupId = this.getGroupId();
                        this.subchain(self.platform()).readPrimaryDomain().then(function() {
                            self.primaryDomain(this);
                            this.readPrincipal(groupId).then(function() {
                                self.group(this);
                                if (callback) {
                                    callback();
                                }
                            });
                        });
                    });
                } else {
                    if (callback) {
                        callback();
                    }
                }
            });
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformTeam);

})(jQuery);