(function($) {
    Gitana.Console.Pages.Archive = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/vaults/{vaultId}/archives/{archiveId}", this.index);
        },

        targetObject: function() {
            return this.archive();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Archive(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Archive(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "download",
                    "title": "Download Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "click": function() {
                        var downloadLink = self.targetObject().getDownloadUri();
                        var link = downloadLink + "?a=true";
                        window.open(link);
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["delete"]
                        }
                    ]
                },
                {
                    "id": "delete",
                    "title": "Delete Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-delete', 48),
                    "click": function(archive) {
                        self.onClickDelete(self.targetObject(), 'archive', self.listLink('archives'), Gitana.Utils.Image.buildImageUri('security', 'archive', 20), 'archive');
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["delete"]
                        }
                    ]
                }
            ]);

        },

        setupArchiveOverview: function () {
            var self = this;
            var archive = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(archive, '_doc')
                    },
                    {
                        "key" : "Group",
                        "value" : self.listItemProp(archive, 'group')
                    },
                    {
                        "key" : "Artifact",
                        "value" : self.listItemProp(archive, 'artifact')
                    },
                    {
                        "key" : "Version",
                        "value" : self.listItemProp(archive, 'version')
                    },
                    {
                        "key" : "Container Type",
                        "value" : self.listItemProp(archive, 'containerType')
                    },
                    {
                        "key" : "Type",
                        "value" : self.listItemProp(archive, 'type')
                    },
                    {
                        "key" : "Last Modified",
                        "value" : "By " + archive.getSystemMetadata().getModifiedBy() + " @ " + archive.getSystemMetadata().getModifiedOn().getTimestamp()
                    },
                    {
                        "key" : "Full JSON",
                        "value" : "<pre class='record-full-json'>" + JSON.stringify(self.populateObjectAll(archive), null, ' ') + "</pre>"
                    }
                ]
            };

            this.pairs("archive-overview", pairs);
        },

        setupDashlets : function () {
            this.setupArchiveOverview();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of archive " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "archive-overview"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Archive);

})(jQuery);

