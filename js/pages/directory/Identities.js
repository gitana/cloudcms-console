(function($) {
    Gitana.Console.Pages.Identities = Gitana.CMS.Pages.AbstractDatastoreObjects.extend(
        {
            SUBSCRIPTION : "identities",

            FILTER : "identity-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            setup: function() {
                this.get("/directories/{directoryId}/identities", this.index);
            },

            targetObject: function() {
                return this.directory();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Directory(this, "menu-directory-identities"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Identities(this));
            },

            setupToolbar: function() {
                this.base();

                //var buttons = this.buildButtons("identity", "Identity");
                var buttons = [];
                this.addButtons(buttons);

                this.toolbar(this.SUBSCRIPTION + "-toolbar", {
                    "items" : {}
                });
            },

            /** Filter Related Methods **/
            filterEmptyData: function() {
                return Alpaca.merge(this.base(), {
                    "title" : "",
                    "description" : ""
                });
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = _safeParse(formData.query);
                    if (Alpaca.isValEmpty(json_query)) {
                        if (formData['title']) {
                            query['title'] = formData['title'];
                        }
                        if (formData['description']) {
                            query['description'] = formData['description'];
                        }
                    }
                }

                return query;
            },

            filterSchema: function () {
                return _mergeObject(this.base(), {
                    "properties" : {
                        "title" : {
                            "title": "Title",
                            "type" : "string"
                        },
                        "description" : {
                            "title": "Description",
                            "type" : "string"
                        }
                    }
                });
            },

            filterOptions: function() {

                var options = _mergeObject(this.base(), {
                    //"helper" : "Query trusted domain mappings by id, title, description, date range, client key, uri or full query.",
                    "fields" : {
                        "title" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                            //,"helper": "Enter regular expression for query by title."
                        },
                        "description" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                            //,"helper": "Enter regular expression for query by description."
                        }
                    }
                });

                return options;
            },

            filterView: function() {
                return _mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "title" : "column-1",
                            "description" : "column-2"
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
                    "edit": {
                        "title": "Edit",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'identity-edit', 48),
                        "click": function(identity){
                            self.app().run("GET", self.LINK().call(self, identity, 'edit'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["update"]
                        }
                    },
                    "delete": {
                        "title": "Delete",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'identity-delete', 48),
                        "selection" : "multiple",
                        "click": function(identities) {
                            self.onClickDeleteMultiple(self.targetObject(), identities, "identities", self.LIST_LINK().call(self, 'identities'), Gitana.Utils.Image.buildImageUri('objects', 'identity', 24), 'identity');
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["delete"]
                        }
                    },
                    "export": {
                        "title": "Export",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "click": function(identities) {
                            self.app().run("GET", self.LINK().call(self, identities, 'export'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["read"]
                        }
                    }
                });

                list["columns"] = [
                    {
                        "title": "ID",
                        "type": "property",
                        "sortingExpression": "id",
                        "property": function(callback) {
                            var id = self.listItemProp(this,'_doc');
                            var value = "<a href='#" + self.link(this) + "'>" + id + "</a>";
                            callback(value);
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    var checks = [];
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryIdentities(self.query(), self.pagination(pagination)).each(
                        function() {
                            $.merge(checks, self.prepareListPermissionCheck(this, ['read','delete']));
                        }).then(function() {
                            var _this = this;

                            this.subchain(self.targetObject()).checkIdentityPermissions(checks, function(checkResults) {
                                self.updateUserRoles(checkResults);
                                callback.call(_this);
                            });
                        });
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            setupPage : function(el) {

                var page = this.buildPage("identity", "Identity", "Identities");

                this.page(_mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Identities);

})(jQuery);