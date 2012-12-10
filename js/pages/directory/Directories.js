(function($) {
    Gitana.Console.Pages.Directories = Gitana.CMS.Pages.AbstractDatastores.extend(
    {
        SUBSCRIPTION : "directories",

        FILTER : "directory-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : Gitana.CMS.Messages.Directories.toolbar.query.title,
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'query', 48)
            }
        },

        setup: function() {
            this.get("/directories", this.index);
        },

        messages: function() {
            return Gitana.CMS.Messages.Directories;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-directories"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Directories(this));
        },

        setupToolbar: function() {
            this.base();
            this.buildToolbar("Directory", "directory");
        },

        /** OVERRIDE **/
        setupList: function(el) {

            var self = this;

            var loadFunction = function(query, pagination, callback) {
                var checks = [];
                self.contextObject().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryDirectories(self.query(),self.pagination(pagination)).each(function() {
                        $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                    }).then(function() {
                        var _this = this;
                        this.subchain(self.platform()).checkDirectoryPermissions(checks, function(checkResults) {
                            self.updateUserRoles(checkResults);
                            callback.call(_this);
                        });
                    });
            };

            this.buildList(el, "Directory", "Directories", "directory", "directories", loadFunction);
        },

        setupPage : function(el) {
            this.buildPage(el, "Directory", "Directories", "directory");
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Directories);

})(jQuery);