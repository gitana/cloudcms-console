(function($) {
    Gitana.Console.Pages.Archives = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "archives",

            FILTER : "archive-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Archives",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/vaults/{vaultId}/archives", this.index);
            },

            targetObject: function() {
                return this.vault();
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
                this.menu(Gitana.Console.Menu.Vault(this, "menu-vault-archives"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Archives(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "create",
                        "title": "Upload Archive",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-add', 48),
                        "url" : this.LINK().call(self, this.targetObject(), 'add', 'archive'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    }
                ]);

                this.toolbar(self.SUBSCRIPTION + "-toolbar", {
                    "items" : {}
                });
            },

            /** Filter Related Methods **/
            filterEmptyData: function() {
                return Alpaca.merge(this.base(), {
                    "archive" : {
                        "groupId" : "",
                        "artifact" : "",
                        "version" : "",
                        "type" : ""
                    }
                });
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    if (Alpaca.isValEmpty(formData.query)) {
                        if (formData['archive'] && formData['archive']['groupId']) {
                            query['groupId'] = formData['archive']['groupId'];
                        }
                        if (formData['archive'] && formData['archive']['artifactId']) {
                            query['artifactId'] = formData['archive']['artifactId'];
                        }
                        if (formData['archive'] && formData['archive']['version']) {
                            query['version'] = formData['archive']['version'];
                        }
                        if (formData['archive'] && formData['archive']['type']) {
                            query['type'] = formData['archive']['type'];
                        }
                    }
                }

                return query;
            },

            filterSchema: function () {
                return Alpaca.mergeObject(this.base(), {
                    "properties" : {
                        "archive" : {
                            "type" : "object",
                            "title" : "Archive",
                            "properties" : {
                                "groupId" : {
                                    "title": "Group Id",
                                    "type" : "string"
                                },
                                "artifact" : {
                                    "title": "Artifact",
                                    "type" : "string"
                                },
                                "version" : {
                                    "title": "Version",
                                    "type" : "string"
                                },
                                "type" : {
                                    "title": "Type",
                                    "type" : "string",
                                    "enum" : ['repository','domain','vault','application','registrar','webhost','warehouse']
                                }
                            }
                        }
                    }
                });
            },

            filterOptions: function() {

                var self = this;

                var options = Alpaca.mergeObject(this.base(), {
                    "helper" : "Query archives by id, title, description, date range, archive id or full query.",
                    "fields" : {
                        "archive" : {
                            "fields" : {
                                "groupId" : {
                                    "size": this.DEFAULT_FILTER_TEXT_SIZE,
                                    "helper": "Enter regular expression for query by archive group id."
                                },
                                "artifact" : {
                                    "size": this.DEFAULT_FILTER_TEXT_SIZE,
                                    "helper": "Enter regular expression for query by archive artifact."
                                },
                                "version" : {
                                    "size": this.DEFAULT_FILTER_TEXT_SIZE,
                                    "helper": "Enter regular expression for query by archive version."
                                },
                                "type" : {
                                    "optionLabels": ['Repository','Domain','Vault','Application','Registrar','Webhost','Warehouse'],
                                    "helper": "Select data store type."
                                }
                            }
                        }
                    }
                });

                return options;
            },

            filterView: function() {
                return Alpaca.mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "startDate" : "column-1",
                            "endDate" : "column-1",
                            "archive" : "column-2"
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
                    "download": {
                        "title": "Download Archive",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                        "click": function(archive) {
                            var downloadLink = archive.getDownloadUri() + "?a=true";
                            window.open(downloadLink);
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["read"]
                        }
                    },
                    "delete": {
                        "title": "Delete Archive(s)",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-delete', 48),
                        "selection" : "multiple",
                        "click": function(archives) {
                            self.onClickDeleteMultiple(self.targetObject(), archives, "archive", self.LIST_LINK().call(self, 'archives'), Gitana.Utils.Image.buildImageUri('objects', 'archive', 20), 'archive');
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["delete"]
                        }
                    }
                });

                list["columns"] = [
                    {
                        "title": "Group",
                        "type":"property",
                        "sortingExpression": "group",
                        "property": function(callback) {
                            var title = self.listItemProp(this, 'group');
                            //var link = this.getDownloadUri();
                            //var value = "<div class='archive-download' data-link='" + link + "'>" + title + "</div>";
                            var value = "<a href='#" + self.link(this) + "'>" + title + "</a>";
                            callback(value);
                        }
                    },
                    {
                        "title": "Artifact",
                        "type":"property",
                        "sortingExpression": "artifact",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'artifact'));
                        }
                    },
                    {
                        "title": "Version",
                        "type":"property",
                        "sortingExpression": "version",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'version'));
                        }
                    },
                    {
                        "title": "Type",
                        "type":"property",
                        "sortingExpression": "type",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'type'));
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

                list["loadFunction"] = function(query, pagination, callback) {
                    var checks = [];
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryArchives(self.query(), self.pagination(pagination)).each(
                        function() {
                            $.merge(checks, self.prepareListPermissionCheck(this, ['read','delete']));
                        }).then(function() {
                            var _this = this;
                            this.subchain(self.targetObject()).checkArchivePermissions(checks, function(checkResults) {
                                self.updateUserRoles(checkResults);
                                callback.call(_this);
                            });
                        });
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            processList: function(el) {
                var self = this;
                $("body").undelegate(".archive-download", "click").delegate(".archive-download", "click", function(e, data) {
                    var downloadLink = $(this).attr('data-link');
                    var link = downloadLink + "?a=true";
                    window.open(link);
                });
            },

            setupPage : function(el) {
                var page = {
                    "title" : "Archives",
                    "description" : "Display list of archives of vault " + this.friendlyTitle(this.targetObject()) + ".",
                    "listTitle" : "Archive List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'archive', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Archives);

})(jQuery);