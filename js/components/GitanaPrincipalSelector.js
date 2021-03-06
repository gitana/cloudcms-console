(function($) {
    Gitana.Console.Pages.GitanaPrincipalSelector = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        TEMPLATE : "components/gitana-principal-selector",

        SUBSCRIPTION : "principal-picker",

        DISPLAY_LIST_FILTER: true,

        FILTER : "principal-candidates-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query User",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
            this.targetId = $(ratchet.el).attr('target-id')
        },

        setup: function() {
            this.get("/add/authenticationgrant", this.index);
            this.get("/authenticationgrants/{authenticationGrantId}/edit", this.index);
            this.get("/registrars/{registrarId}/add/tenant", this.index);
            this.get("/registrars/{registrarId}/tenants/{tenantId}/edit", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        defaultList: function() {
            return _mergeObject({
                "tableConfig": {
                    "iDisplayLength": 10
                }
            }, this.base());
        },


        /** Filter Related Methods **/
        filterEmptyData: function() {
            return {
                "id" : "",
                "name" : "",
                "email" : "",
                "startDate" : "",
                "endDate": "",
                "query" : ""
            };
        },

        filterFormToJSON: function (formData) {
            if (! Alpaca.isValEmpty(formData)) {
                var json_query = _safeParse(formData.query);
                if (!Alpaca.isValEmpty(json_query)) {
                    return json_query;
                } else {
                    var query = {};
                    if (formData['id']) {
                        query._doc = formData['id'];
                    }
                    if (formData['name']) {
                        query['name'] = {
                            "$regex" : formData['name']
                        };
                    }
                    if (formData['email']) {
                        query['email'] = {
                            "$regex" : formData['email']
                        };
                    }
                    if (formData.startDate || formData.endDate) {
                        query["_system.modified_on.ms"] = {
                        };
                        if (formData.startDate) {
                            query["_system.modified_on.ms"]["$gte"] = Gitana.Utils.Date.strToDate(formData.startDate).getTime();
                        }
                        if (formData.endDate) {
                            query["_system.modified_on.ms"]["$lt"] = Gitana.Utils.Date.strToDate(formData.endDate).getTime() + 86400000;
                        }
                    }
                    return query;
                }
            } else {
                return {};
            }
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "domainId" : {
                        "title": "Domain",
                        "type" : "string"
                    },
                    "id" : {
                        "title": "ID",
                        "type" : "string"
                    },
                    "name" : {
                        "title": "Name",
                        "type" : "string"
                    },
                    "email" : {
                        "title": "Email",
                        "type" : "string"
                    },
                    "startDate" : {
                        "title": "Start Date",
                        "type" : "string",
                        "format": "date"
                    },
                    "endDate" : {
                        "title": "End Date",
                        "type" : "string",
                        "format": "date"
                    },
                    "query" : {
                        "title": "Full Query",
                        "type" : "string"
                    }
                }
            };
        },

        filterOptions: function() {
            var self = this;
            return {
                "helper" : "Query users by id, last name, email, company, date range or full query.",
                "fields" : {
                    "domainId" : {
                        "type" : "select",
                        "dataSource": function(field, callback) {
                            var selectedOption;
                            self.platform().listDomains({
                                "limit": Gitana.Console.LIMIT_NONE
                            }).each(function(key, val, index) {
                                field.selectOptions.push({
                                    "value": this.getId(),
                                    "text": self.friendlyTitle(this)
                                });
                                if (! selectedOption) {
                                    selectedOption = this.getId();
                                    if (!self.domain() || self.domain().getId() != selectedOption) {
                                        self.domain(this);
                                        self.resetFilter();
                                    }
                                }
                            }).then(function() {
                                if (callback) {
                                    callback();
                                    field.field.val(selectedOption).change();
                                }
                            });
                        }
                    },
                    "id" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE
                    },
                    "name" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE
                    },
                    "email" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE
                    },
                    "startDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE
                    },
                    "endDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE
                    },
                    "query" : {
                        "type": "editor",
                        "aceMode": "ace/mode/json",
                        "aceFitContentHeight": true
                    }
                }
            };
        },

        filterView: function() {
            return {
                "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                "layout": {
                    "bindings": {
                        "domainId": "column-1",
                        "id": "column-1",
                        "name": "column-1",
                        "email": "column-2",
                        "startDate": "column-2",
                        "endDate": "column-2",
                        "query" : "column-3"
                    }
                }
            };
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
            });

            list.hideCheckbox = true;

            list["columns"] = [
                {
                    "title": "Name",
                    "type":"property",
                    "sortingExpression": "name",
                    "property": function(callback) {
                        var name = self.listItemProp(this,'name');
                        /*
                        var friendlyName = self.friendlyName(this);
                        var itemInfo = "<div>" + friendlyName + "</div>";
                        itemInfo += "<div>" + self.listItemProp(this, 'email') + "</div>";
                        itemInfo += "<div>" + self.listItemProp(this, 'companyName') + "</div>";
                        itemInfo += "<div><b>Domain</b>: " + this.getDomainId() + "</div>";
                        itemInfo += "<div><b>Id</b>: " + this.getId() + "</div>";

                        var value = name;
                        value += self.listItemInfoText(this.getId(),itemInfo);
                        */
                        callback(name);
                    }
                },
                {
                    "title": "Email",
                    "type":"property",
                    "sortingExpression": "email",
                    "property": function(callback) {
                        var email = self.listItemProp(this,'email');
                        callback(email);
                    }
                },
                {
                    "title": "Last Modified On",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                },
                {
                    "title": "Action",
                    "property": function(callback) {
                        var nodeId = this.getDomainQualifiedId();

                        var name = self.listItemProp(this, 'name');
                        var friendlyName = self.friendlyName(this);
                        var itemInfo = "<div>" + friendlyName + "</div>";
                        itemInfo += "<div>" + self.listItemProp(this, 'email') + "</div>";
                        itemInfo += "<div>" + self.listItemProp(this, 'companyName') + "</div>";
                        itemInfo += "<div><b>Domain</b>: " + self.friendlyTitle(self.domain()) + "</div>";
                        itemInfo += "<div><b>Name</b>: " + this.getName() + "</div>";

                        itemInfo.replace('<','&lt;').replace('>','$gt;');

                        var value = '<a class="gitana-selector-action node-action gitana-selector-select node-select" data-target-principal-info="' + itemInfo + '" data-target-principal-id="' + nodeId + '"><span>Select</span></a>';
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {

                var _query = Alpaca.cloneObject(self.query());
                if (Alpaca.isValEmpty(_query)) {
                    if (self.domain()) {
                        Chain(self.domain()).queryUsers(_query,self.pagination(pagination)).then(function() {
                            callback.call(this);
                        });
                    } else {
                        var result = Chain(this.getFactory().domainPrincipalMap(self.platform().getCluster()));
                        result.object['total_rows'] = 0;
                        callback.call(result);
                    }
                } else {
                    Chain(self.domain()).queryUsers(_query,self.pagination(pagination)).then(function() {
                        callback.call(this);
                    });
                }
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        listItemInfoText: function(id, details) {
            return "<div class='list-item-more' data-principal-id='" + id + "'>More</div>"
                + "<div class='list-item-details' data-principal-id='" + id + "'>"
                + details + "</div>"
                + "<div class='list-item-less' data-principal-id='" + id + "'>Less</div>";
        },

        processList: function(el) {
            var self = this;

            $("body").delegate(".list-item-more", "click", function(e, data) {
                var principalId = $(this).attr('data-principal-id');
                $('.list-item-details[data-principal-id="' + principalId + '"]').show();
                $('.list-item-less[data-principal-id="' + principalId + '"]').show();
                $(this).hide();
            });

            $("body").delegate(".list-item-less", "click", function(e, data) {
                var principalId = $(this).attr('data-principal-id');
                $('.list-item-details[data-principal-id="' + principalId + '"]').hide();
                $('.list-item-more[data-principal-id="' + principalId + '"]').show();
                $(this).hide();
            });

            $("body").undelegate(".node-select", "click").delegate(".node-select", "click", function() {
                var control = $(this);
                //$(self.ratchet().el).dialog('close');
                $('.ui-icon-closethick').click();
                $('#'+self.targetId).attr('title',control.attr('data-target-principal-info'));
                $('#'+self.targetId).val(control.attr('data-target-principal-id')).blur().focus();
            })
        },

        setupGitanaPrincipalSelector : function(el) {

            var page = {
                "title" : "User List",
                "description" : "List of Users.",
                "listTitle" : "User List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.observable('principalselector').set(page);
        },

        index: function(el, callback) {
            var self = this;

            this.tokens = el.tokens;

            // load context
            self.loadContext(el, function() {
                // check authorities
                self.checkAuthorities(function(isEntitled, error) {
                    if (isEntitled) {
                        // set up toolbar
                        self.setupToolbar();

                        // set up filter
                        self.setupFilter(el);

                        // set up the list
                        self.setupList(el);

                        // set up the page
                        self.setupGitanaPrincipalSelector(el);

                        // list model
                        var page = self.model(el);

                        // render layout
                        self.renderTemplate(el, self.TEMPLATE, function(el) {

                            Gitana.Utils.UI.jQueryUIDatePickerPatch();

                            Gitana.Utils.UI.contentBox($(el));

                            // set up list search box
                            self.setupListSearchbox(el);

                            el.swap(function(swappedEl) {

                                self.processList(swappedEl);

                                Gitana.Utils.UI.enableTooltip();

                                if (callback)
                                {
                                    callback();
                                }

                            });

                        });
                    } else {
                        self.handleUnauthorizedPageAccess(el, error);
                    }
                });
            });
        },

        filterPostRender: function (renderedField, self) {
            this.base(renderedField, self);

            var domainField = renderedField.childrenByPropertyId["domainId"];

            $(domainField.getEl()).bind("fieldupdate", function() {

                var domainId = domainField.getValue();

                self.platform().readDomain(domainId).then(function() {
                    self.domain(this);
                });
            });
        }

    });

    Ratchet.GadgetRegistry.register("principalselector", Gitana.Console.Pages.GitanaPrincipalSelector);

})(jQuery);