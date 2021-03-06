(function($) {
    Gitana.Console.Pages.RepositoryChangesets = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "repository-changesets",

        FILTER : "changeset-list-filters",

        setup: function() {
            this.get("/repositories/{repositoryId}/changesets", this.index);
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
           this.menu(Gitana.Console.Menu.Repository(this, "menu-change-sets"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.RepositoryChangesets(this));
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
                var json_query = _safeParse(formData.query);
                if (Alpaca.isValEmpty(json_query)) {
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
            return _mergeObject(this.base(), {
                "properties" : {
                    "id" : {
                        "title": "ID",
                        "type" : "string"
                    }
                }
            });
        },

        filterOptions: function() {

            var self = this;

            var options = _mergeObject(this.base(), {
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
            return _mergeObject(this.base(),{
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
                    "title": "ID",
                    "type":"property",
                    "sortingExpression": "_doc",
                    "property": function(callback) {
                        var title = this.getId();
                        var value = "<a href='#" + self.LINK().call(self,this) + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Revision",
                    "type":"property",
                    "sortingExpression": "revision",
                    "property": function(callback) {
                        var value = self.listItemProp(this,'revision');
                        callback(value);
                    }
                },
                {
                    "title": "Active",
                    "type":"property",
                    "sortingExpression": "active",
                    "property": function(callback) {
                        var value = self.listItemProp(this,'active');
                        callback(value);
                    }
                },
                {
                    "title": "Branch",
                    "type":"property",
                    "sortingExpression": "branch",
                    "property": function(callback) {
                        var branchId = self.listItemProp(this,'branch');
                        var value = "<a href='#" + self.LIST_LINK().call(self,'branches') + branchId + "'>" + branchId + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Parents",
                    "type":"property",
                    "sortingExpression": "parents",
                    "property": function(callback) {
                        var value = "";
                        var parents = this.get('parents');
                        if (parents) {
                            $.each(parents, function(index,parent) {
                                value += "<a href='#" + self.LIST_LINK().call(self,'changesets') + parent + "'>" + parent + "</a>";
                                if (index != parents.length -1) {
                                    value += ",";
                                }
                            });
                        }
                        callback(value);
                    }
                },
                {
                    "title": "Timestamp",
                    "type":"property",
                    "sortingExpression": "_system.created_on.timestamp",
                    "property": function(callback) {
                        var value = this.getSystemMetadata()["created_on"]["timestamp"];
                        callback(value);
                    }
                }
            ];
            list.hideIcon = true;
            list.hideCheckbox = true;

            list["loadFunction"] = function(query, pagination, callback) {
                self.targetObject().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryChangesets(self.query(),self.pagination(pagination)).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION,list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Repository Changesets",
                "description" : "Displays a list of changesets contained within the repository '"+this.friendlyTitle(this.targetObject()) + "'.",
                "listTitle" : "Changeset List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'changesets', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryChangesets);

})(jQuery);