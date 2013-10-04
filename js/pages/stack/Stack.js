(function($) {
    Gitana.Console.Pages.Stack = Gitana.CMS.Pages.AbstractListPageGadget.extend({

        SUBSCRIPTION : "stack-datastores",

        FILTER : "stack-datastore-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Data Stores",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        DISPLAY_LIST_FILTER: true,

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/stacks/{stackId}", this.index);
        },

        targetObject: function() {
            return this.stack();
        },

        contextObject: function() {
            return this.platform();
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
            this.menu(Gitana.Console.Menu.Stack(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Stack(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            if (this.targetObject().getId() != "default") {
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack-edit', 48),
                        "url" : self.link(this.targetObject(), "edit"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
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
                        "id": "delete",
                        "title": "Delete",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack-delete', 48),
                        "click": function(stack) {
                            self.onClickDelete(self.targetObject(), 'stack', self.listLink('stacks'), Gitana.Utils.Image.buildImageUri('security', 'stack', 20), 'stack');
                        },
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["delete"]
                            }
                        ]
                    }
                ], self.SUBSCRIPTION + "-page-toolbar");
            } else {
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack-edit', 48),
                        "url" : self.link(this.targetObject(), "edit"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
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
                    }
                ], self.SUBSCRIPTION + "-page-toolbar");
            }

            self.addButtons([
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
                }/*,
                {
                    "id": "import",
                    "title": "Import Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'import'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }*/
            ], self.SUBSCRIPTION + "-page-toolbar");
        },

        setupStackOverview: function () {
            var self = this;
            var stack = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(stack, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(stack, 'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(stack, 'description')
            });
            this._pushItem(pairs.items, {
                "key" : "Key",
                "value" : self.listItemProp(stack, 'key')
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + stack.getSystemMetadata().getModifiedBy() + " @ " + stack.getSystemMetadata().getModifiedOn().getTimestamp()
            });

            this.pairs("stack-overview", pairs);
        },

        setupDashlets : function (el, callback) {
            this.setupStackOverview();
            callback();
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return _mergeObject(this.base(), {
                "member" : true,
                "dataStoreType" : "repository"
            });
        },

        filterFormToJSON: function (formData) {
            if (! Alpaca.isValEmpty(formData)) {
                var json_query = _safeParse(formData.query);
                if (!Alpaca.isValEmpty(json_query)) {
                    return json_query;
                } else {
                    var query = this.base(formData);
                    query['member'] = formData['member'];

                    if (formData['dataStoreType']) {
                        query['dataStoreType'] = formData['dataStoreType'];
                    }

                    return query;
                }
            } else {
                return {};
            }
        },

        filterSchema: function () {
            return _mergeObject({
                "type" : "object",
                "properties" : {
                    "member" : {
                        "title": "Member",
                        "type" : "boolean",
                        "default" : true
                    },
                    "dataStoreType" : {
                        "title": "Data Store Type",
                        "type" : "string",
                        "required" : true,
                        "default" : "repository",
                        "enum" : [
                            "application",
                            "directory",
                            "domain",
                            "registrar",
                            "repository",
                            "vault",
                            "warehouse",
                            "webhost"
                        ],
                        "dependencies": "member"
                    }
                }
            }, this.base());
        },

        filterOptions: function() {
            var self = this;
            return _mergeObject(this.base(), {
                "helper" : "Query data stores by membership, type, id, title, description, date range or full query.",
                "fields" : {
                    "member" : {
                        "label": "Membership",
                        "rightLabel": "Only display stack's current members?",
                        "helper": "Check option for only displaying stack's current members."
                    },
                    "dataStoreType" : {
                        "type": "select",
                        "optionLabels": [
                            "Application",
                            "Directory",
                            "Domain",
                            "Registrar",
                            "Repository",
                            "Vault",
                            "Warehouse",
                            "Web Host"
                        ],
                        "dependencies": {
                            "member": false
                        }
                    }
                }
            });
        },

        filterView: function() {
            return _mergeObject(this.base(), {
                "layout": {
                    "bindings": {
                        "member": "column-1",
                        "dataStoreType": "column-2"
                    }
                }
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list.hideCheckbox = true;

            list["actions"] = self.actionButtons({
            });

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "property": function(callback) {
                        //TODO: Doesn't seem like the datastore has the real ID,it is actually the association key.
                        var value = "<a href='#" + self.datastoreLink(this) + "'>" + self.friendlyTitle(this) + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Type",
                    "type":"property",
                    "sortingExpression": "type",
                    "property": function(callback) {
                        var type = this.getType();
                        callback(type);
                    }
                },
                {
                    "title": "Last Modified",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                },
                {
                    "title": "Key",
                    "type":"property",
                    "property": function(callback) {
                        if (this.get('isMember')) {
                            //TODO: Stack/Application association returns both key and _doc and it seems like _doc is the one we needs.
                            var key = /*this.get('key') ? this.get('key') :*/ this.getId();
                            callback("<input type='text' disabled value='" + key + "' id='" + this.get('datastoreId') + "' data-type='" + this.getType() + "' class='membership-key' size='15' style='padding:2px 5px;'/>");
                        } else {
                            callback("<input type='text' id='" + this.getId() + "' data-type='" + this.getType() + "' class='membership-key' size='15' style='padding:2px 5px;'/>");
                        }
                    }
                },
                {
                    "title": "Membership",
                    "property": function(callback) {
                        var buttonText = this.get('isMember') ? "Remove" : "Add";
                        var buttonClass = this.get('isMember') ? "membership-remove" : "membership-add";
                        var value = "<a id='" + this.get('datastoreId') + "' data-type='" + this.getType() + "' class='membership-action " + buttonClass + "'><span>" + buttonText + "</span></a>";
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var memberIds = [];
                var directMemberIds = [];
                var dataStoreQuery = Alpaca.cloneObject(self.query());
                if (Alpaca.isValEmpty(dataStoreQuery) || dataStoreQuery['member']) {
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).listDataStores(self.pagination()).then(function(){
                            this.each(function(key, val, index) {
                                this['isMember'] = true;
                            }).then(function() {
                                callback.call(this);
                            });
                        });
                } else {

                    delete dataStoreQuery['member'];

                    var dataStoreType = dataStoreQuery['dataStoreType'];

                    delete dataStoreQuery['dataStoreType'];

                    var handler = function() {

                        var dataStoreIds = [];
                        var dataStoreMembers = {};

                        this.each(
                            function() {
                                dataStoreIds.push(this.getId());
                            }).then(function() {
                                this.subchain(self.targetObject()).queryDataStores({
                                    "datastoreId" : {
                                        "$in" : dataStoreIds
                                    }
                                }).each(function() {
                                        dataStoreMembers[this.get('datastoreId')] = this.getId();
                                    });
                                this.then(function() {
                                    this.each(function() {
                                        if (dataStoreMembers[this.getId()]) {
                                            this['isMember'] = true;
                                            this['key'] = dataStoreMembers[this.getId()];
                                        } else {
                                            this['isMember'] = false;
                                        }
                                    }).then(function() {
                                        callback.call(this);
                                    });
                                });
                            });
                    };

                    switch (dataStoreType) {
                        case 'repository' :
                            Chain(self.contextObject()).trap(
                                function(error) {
                                    return self.handlePageError(el, error);
                                }).queryRepositories(dataStoreQuery, self.pagination(pagination)).then(handler);
                            break;
                        case 'domain' :
                            Chain(self.contextObject()).trap(
                                function(error) {
                                    return self.handlePageError(el, error);
                                }).queryDomains(dataStoreQuery, self.pagination(pagination)).then(handler);
                            break;
                        case 'registrar' :
                            Chain(self.contextObject()).trap(
                                function(error) {
                                    return self.handlePageError(el, error);
                                }).queryRegistrars(dataStoreQuery, self.pagination(pagination)).then(handler);
                            break;
                        case 'application' :
                            Chain(self.contextObject()).trap(
                                function(error) {
                                    return self.handlePageError(el, error);
                                }).queryApplications(dataStoreQuery, self.pagination(pagination)).then(handler);
                            break;
                        case 'vault' :
                            Chain(self.contextObject()).trap(
                                function(error) {
                                    return self.handlePageError(el, error);
                                }).queryVaults(dataStoreQuery, self.pagination(pagination)).then(handler);
                            break;
                        case 'webhost' :
                            Chain(self.contextObject()).queryWebHosts(dataStoreQuery, self.pagination(pagination)).then(handler);
                            break;
                    }
                }
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION, list);
        },

        processList: function(el) {
            var self = this;

            $("body").undelegate(".membership-add", "click").delegate(".membership-add", "click", function() {
                var control = $(this);
                var dataStoreId = control.attr('id');
                var dataStoreType = control.attr('data-type');
                var keyInput = $('input[id="' + dataStoreId + '"]');
                var key = keyInput.val();
                if (!key)
                {
                    key = dataStoreId;
                }
                Gitana.Utils.UI.block('Adding member ' + dataStoreId + '...');
                Chain(self.targetObject()).trap(
                    function() {

                    }).existsDataStore(key, function(exists) {
                        if (exists) {
                            Gitana.Utils.UI.unblock(function() {
                                var errorDialog = '<div id="error-dialog"><h2>Key ' + key + ' exists.</h2><h2>Try to use a different key.</h2></div>';
                                $(errorDialog).dialog({
                                    title : "<img src='" + Gitana.Utils.Image.buildImageUri('special', 'error-message', 24) + "' />Data Store Assignment Error",
                                    modal: true,
                                    width: 450,
                                    height: 300
                                });
                            });
                        } else {
                            this.assignDataStore({
                                "id" : dataStoreId,
                                "type" : dataStoreType,
                                "key" : key
                            }).then(function() {
                                    Gitana.Utils.UI.unblock();
                                    control.removeClass('membership-add').addClass('membership-remove');
                                    $('span', $(control)).html('Remove');
                                    keyInput.attr('disabled', 'disabled');
                                });
                        }
                    });
            });

            $("body").undelegate(".membership-remove", "click").delegate(".membership-remove", "click", function() {
                var control = $(this);
                var dataStoreId = control.attr('id');
                var dataStoreType = control.attr('data-type');
                var keyInput = $('input[id="' + dataStoreId + '"]');
                var key = keyInput.val();

                Gitana.Utils.UI.block('Removing member ' + dataStoreId + '...');
                Chain(self.targetObject()).trap(
                    function() {

                    }).unassignDataStore(key).then(function() {
                        Gitana.Utils.UI.unblock();
                        control.removeClass('membership-remove').addClass('membership-add');
                        $('span', $(control)).html('Add');
                        keyInput.removeAttr('disabled');
                    });
            });
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of stack " + title + ".",
                "listTitle" : "Data Store List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'datastore', 20),
                "subscription" : this.SUBSCRIPTION,
                "pageToolbar" : true,
                "filter" : this.FILTER,
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "stack-overview"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Stack);

})(jQuery);

