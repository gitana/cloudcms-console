(function($) {
    Gitana.CMS.Pages.AbstractDatastores = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        contextObject: function() {
            return this.platform();
        },

        /** TO IMPLEMENT **/
        messages: function() {
            return null;
        },

        /** TODO: what should we check? **/
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.contextObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        buildToolbar: function(name, type) {
            this.addButtons([
                {
                "id": "create",
                "title": this.messages().toolbar.create.title,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-add', 48),
                    "url" : '/add/' + type,
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": this.messages().toolbar.importarchive.title,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : this.LINK().call(this, this.contextObject(), 'import', type),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);
        },

        buildList: function(el, name, names, type, types, loadFunction) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit " + name,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-edit', 48),
                    "click": function(datastore){
                        self.app().run("GET", self.link(datastore,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete " + names,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-delete', 48),
                    "click": function(datastores) {
                        self.onClickDeleteMultiple(self.platform(), datastores , name, self.listLink(types) , Gitana.Utils.Image.buildImageUri('objects', type, 20), type);
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(datastore) {
                       self.app().run("GET", self.link(datastore,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export " + name,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(datastore) {
                        self.app().run("GET", self.LINK().call(self,datastore,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.friendlyTitle(this);
                        var value = "<a href='#" + self.link(this) + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Last Modified By",
                    "sortingExpression" : "_system.modified_by",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedBy();
                        callback(value);
                    }
                },
                {
                    "title": "Last Modified On",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                }
            ];

            list["isItemReadonly"] = function(item) {
                return item.getId() == 'default';
            };

            list["loadFunction"] = loadFunction;

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);

            return list;
        },

        buildPage : function(el, type) {
            var page = {
                "title" : this.messages().title,
                "description" : this.messages().description,
                "listTitle" : this.messages().list.title,
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', type, 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

})(jQuery);