(function($) {
    Gitana.Console.Pages.BranchAdmin = Gitana.CMS.Pages.AbstractAdminPageGadget.extend({

        TEMPLATE: "layouts/console.admin",

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/admin", this.index);
        },

        targetObject: function() {
            return this.branch();
        },

        requiredAuthorities: function() {
            return [{
                "permissioned" : this.targetObject(),
                "permissions" : ["create_subobjects"]
            }];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Branch(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Branch(this), [{
                "text" : "Administration"
            }]));
        },

        setupCommands: function() {
            var self = this;
            self.base();

            self.addCommands([{
                "id": "reindex-paths",
                "title": "Rebuild PATH indexes for all branch nodes",
                "description": "This operation will rebuild the path lookup indexes for all of the nodes in this branch.  Your node data will not be affected.  The server will go node-by-node to rebuild the paths.  During this time, path-related retrieval will be slower and may be inconsistent.",
                "requiredAuthorities" : [{
                    "permissioned" : self.targetObject(),
                    "permissions": ["create_subobjects"]
                }],
                "click": function() {
                    Gitana.Utils.UI.block("Please wait...", "Your branch path indexes are being rebuilt...");

                    Chain(self.branch()).adminRebuildPathIndexes().then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                }
            }, {
                "id": "reindex-search",
                "title": "Rebuild SEARCH indexes for all branch nodes",
                "description": "This operation will rebuild the full-text search indexes for all of the nodes in this branch.  Your node data will not be affected.  The server will go node-by-node to rebuild the paths.  During this time, full-text and structured search retrieval will be inconsistent.",
                "requiredAuthorities" : [{
                    "permissioned" : self.targetObject(),
                    "permissions": ["create_subobjects"]
                }],
                "click": function() {
                    Gitana.Utils.UI.block("Please wait...", "Your search indexes are being rebuilt...");

                    Chain(self.branch()).adminRebuildSearchIndexes().then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                }
            }, {
                "id": "maintenance",
                "title": "Run maintenance over all branch nodes",
                "description": "This operation will perform common maintenance functions to look for leftover system-maintained nodes that can be safely removed or repaired.  Your custom node data will not be affected.  This helps to ensure fast performance for your searches and content queries.",
                "requiredAuthorities" : [{
                    "permissioned" : self.targetObject(),
                    "permissions": ["create_subobjects"]
                }],
                "click": function() {
                    Gitana.Utils.UI.block("Please wait...", "Content maintenance is being run...");

                    Chain(self.branch()).adminContentMaintenance().then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                }
            }]);
        },

        setupPage : function(el) {

            var page = {
                "title" : this.friendlyTitle(this.targetObject()),
                "description" : "Administrative Tools"
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BranchAdmin);

})(jQuery);