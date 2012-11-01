(function($) {
    Gitana.Console.Pages.RepositoryChangeset = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "repository-changeset",

        FILTER : "changeset-nodes-filters",

        HIDE_FILTER : true,

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/changesets/{changesetId}", this.index);
        },

        targetObject: function() {
            return this.repository();
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
           this.menu(Gitana.Console.Menu.Changeset(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Changeset(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);

            this.toolbar("repository-changeset-toolbar",{
                "items" : {}
            });
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return Alpaca.merge(this.base(),{
                "id" : "",
                "type" : [""]
            });
        },

        filterFormToJSON: function (formData) {
            var query = this.base();
            if (! Alpaca.isValEmpty(formData)) {
                if ( Alpaca.isValEmpty(formData.query)) {
                    if (formData['id']) {
                        query['_doc'] = {
                            "$regex" : formData['id']
                        };
                    }
                }
            }
            return query;
        },

        filterSchema: function () {
            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "id" : {
                        "title": "Id",
                        "type" : "string"
                    }
                }
            });
        },

        filterOptions: function() {

            var self = this;

            var options = Alpaca.mergeObject(this.base(), {
                "helper" : "Refine list by id, title, description, date range, type or full query.",
                "fields" : {
                    "id" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by id."
                    }
                }
            });

            return options;
        },

        filterView: function() {
            return Alpaca.mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "id": "column-1"
                    }
                }
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
            });

            list["columns"] = [
                {
                    "title": "Id",
                    "type":"property",
                    "sortingExpression": "_doc",
                    "property": function(callback) {
                        var nodeId = this.getId();
                        var value = "<a href='#" + self.LIST_LINK().call(self,'branches') + self.changeset().get('branch') + "/" + nodeId + "'>" + nodeId + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.friendlyTitle(this);
                        callback(title);
                    }
                },
                {
                    "title": "Type",
                    "type":"property",
                    "sortingExpression": "_type",
                    "property": function(callback) {
                        var title = this.get('_type') ? this.get('_type') : "";
                        callback(title);
                    }
                },
                {
                    "title": "Last Modified",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                }
            ];
            list.hideIcon = true;
            list.hideCheckbox = true;

            list["loadFunction"] = function(query, pagination, callback) {
                self.changeset().trap(function(error) {
                    return self.handlePageError(el, error);
                }).listNodes(self.pagination(pagination)).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION,list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Repository Changeset",
                "description" : "Display list of nodes of change set "+this.friendlyTitle(this.changeset()) + ".",
                "listTitle" : "Node List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'node', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryChangeset);

})(jQuery);