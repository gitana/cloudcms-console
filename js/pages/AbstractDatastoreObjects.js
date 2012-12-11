(function($) {
    Gitana.CMS.Pages.AbstractDatastoreObjects = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        buildButtons: function(type, name, addType)
        {
            var self = this;

            return [{
                "id": "create",
                "title": "Create New",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-add', 48),
                "url" : this.LINK().call(self, this.targetObject(), 'add/' + type, addType),
                "requiredAuthorities" : [{
                    "permissioned" : self.targetObject(),
                    "permissions" : ["create_subobjects"]
                }]
            },
            {
                "id": "import",
                "title": "Import Archive",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                "url" : this.LINK().call(this, this.contextObject(), 'import'),
                "requiredAuthorities" : [{
                    "permissioned" : this.contextObject(),
                    "permissions" : ["create_subobjects"]
                }]
            }];
        },

        buildPage : function(type, name, names)
        {
            return {
                "title" : names,
                "description" : "Display list of " + names,
                "listTitle" : names,
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', type, 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };
        }
    });

})(jQuery);