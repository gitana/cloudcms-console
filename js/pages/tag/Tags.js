(function($) {
    Gitana.Console.Pages.Tags = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "tags",

        FILTER : "tag-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/tags", this.index);
        },

        LINK : function() {
            return this.tagLink;
        },

        targetObject: function() {
            return this.branch();
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
            this.menu(Gitana.Console.Menu.Branch(this,"menu-tags"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Tags(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Tag",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag-add', 48),
                    "url" : this.LINK().call(self,this.targetObject(),'add','tag'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.branch(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return Alpaca.merge(this.base(),{
                "id" : "",
                "type" : [""],
                "keyword" : ""
            });
        },

        filterFormToJSON: function (formData) {
            var query = this.base(formData);
            if (! Alpaca.isValEmpty(formData)) {
                if ( Alpaca.isValEmpty(formData.query)) {
                    if (formData['tag']) {
                        query['tag'] = {
                            "$regex" : formData['tag']
                        };
                    }
                }
            }

            var findQuery = {
                "query" : query
            };

            return findQuery;
        },

        filterSchema: function () {
            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "tag" : {
                        "title": "Tag",
                        "type" : "string"
                    }
                }
            });
        },

        filterOptions: function() {

            var self = this;

            var options = Alpaca.mergeObject(this.base(), {
                "helper" : "Query list by id, title, description, date range, type or full query.",
                "fields" : {
                    "tag" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by tag"
                    }
                }
            });

            return options;
        },

        filterView: function() {
            return Alpaca.mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "tag": "column-1",
                        "query" : "column-3"
                    }
                }
            });
        },

        setupListSearchbox: function(el) {
            var self = this;
            $('input.list-search', $(el)).keypress(function(e) {
                if (e.which == 13) {

                    var keyword = $(this).val();

                    var targetObservable = self.FILTER;

                    var listQuery = self.observable(targetObservable).get();

                    if (!Alpaca.isValEmpty(keyword)) {
                        if (Alpaca.isValEmpty(listQuery)) {
                            listQuery = {
                                "formData" : {},
                                "jsonData" : {
                                    "search" : keyword
                                }
                            }
                        } else {
                            listQuery["jsonData"] = {
                                "search" : keyword
                            };
                        }
                    } else {
                        if (listQuery && listQuery["jsonData"] && listQuery["jsonData"]["search"]) {
                            delete listQuery["jsonData"]["search"];
                        }
                    }

                    self.observable(targetObservable).set(listQuery);
                }
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Tag",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag-edit', 48),
                    "click": function(tag){
                        self.app().run("GET", self.LINK().call(self,tag,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Tag(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag-delete', 48),
                    "selection" : "multiple",
                    "click": function(tags) {
                        self.onClickDeleteMultiple(self.branch(), tags , "tag", self.LIST_LINK().call(self,'tags') , Gitana.Utils.Image.buildImageUri('objects', 'tag', 20), 'tag');
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(tag) {
                        self.app().run("GET", self.LINK().call(self,tag,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Tag",
                    "type":"property",
                    "sortingExpression": "tag",
                    "property": function(callback) {
                        var title = self.listItemProp(this,'tag');
                        var link = self.LINK().call(self,this);
                        var value = "<a href='#" + link + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Tagged Nodes",
                    "type":"property",
                    "sortingExpression": "stats.a:has_tag",
                    "property": function(callback) {
                        var numOfDocs = this.get('stats') && this.get('stats')['a:has_tag'] ? this.get('stats')['a:has_tag'] : "0";
                        callback(numOfDocs);
                    }
                },
                {
                    "title": "Last Modified By",
                    "sortingExpression" : "_system.modified_by",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedBy();
                        callback(value);
                    }
                }
                ,
                {
                    "title": "Last Modified On",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                Chain(self.branch()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).find(Alpaca.mergeObject(self.query(),{
                    "query" : {
                        "_type" : "n:tag"
                    }
                }),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['read','update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.branch()).checkNodePermissions(checks, function(checkResults) {
                        self.updateUserRoles(checkResults);
                        callback.call(_this);
                    });
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Tags",
                "description" : "Display list of tags of branch " + this.friendlyTitle(this.branch()) +".",
                "listTitle" : "Tag List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'tag', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Tags);

})(jQuery);

