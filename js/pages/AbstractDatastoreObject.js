(function($) {
    Gitana.CMS.Pages.AbstractDatastoreObject = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        buildButtons: function(type, types, name) {

            var self = this;

            return [{
                "id": "edit",
                "title": "Edit",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-edit', 48),
                "url" : self.link(self.targetObject(), "edit"),
                "requiredAuthorities" : [
                    {
                        "permissioned" : this.targetObject(),
                        "permissions" : ["update"]
                    }
                ]
            },
            {
                "id": "delete",
                "title": "Delete",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-delete', 48),
                "click": function(autoClientMapping) {
                    self.onClickDelete(self.targetObject(), name, self.listLink(types), Gitana.Utils.Image.buildImageUri('objects', type, 24), name);
                },
                "requiredAuthorities" : [
                    {
                        "permissioned" : this.targetObject(),
                        "permissions" : ["delete"]
                    }
                ]
            },
            {
                "id": "edit-json",
                "title": "Edit JSON",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                "url" : self.link(this.targetObject(), "edit", "json"),
                "requiredAuthorities" : [
                    {
                        "permissioned" : this.targetObject(),
                        "permissions" : ["update"]
                    }
                ]
            },
            {
                "id": "export",
                "title": "Export",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                "url" : self.LINK().call(self, self.targetObject(), 'export'),
                "requiredAuthorities" : [
                    {
                        "permissioned" : self.targetObject(),
                        "permissions" : ["read"]
                    }
                ]
            }];
        },

        buildPage : function(type, name, overviewSubscription) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of " + name + " " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : overviewSubscription
                    }
                ]
            };

            return page;
        }

    });

})(jQuery);

