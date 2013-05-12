(function($) {
    Gitana.Console.AbstractGitanaConsoleGroupAuthorityListGadget = Gitana.Console.AbstractGitanaConsoleAuthorityListGadget.extend(
    {
        SUBSCRIPTION : "authority-groups",

        FILTER : "authority-group-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Groups",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        DISPLAY_LIST_FILTER: true,

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "authority-users",
                    "title": "User Security",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-security', 48),
                    "url" : self.LINK().call(self,self.targetObject(),'authorities','users')
                }
            ]);
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return Alpaca.merge(this.base(),{
                "title" : "",
                "description" : ""
            });
        },

        filterFormToJSON: function (formData) {
            if (! Alpaca.isValEmpty(formData)) {
                var json_query = JSON.parse(formData.query);
                if (!Alpaca.isValEmpty(json_query)) {
                    return json_query;
                } else {
                    var query = this.base(formData);
                    if (formData['title']) {
                        query['title'] = {
                            "$regex" : formData['title']
                        };
                    }
                    if (formData['description']) {
                        query['email'] = {
                            "$regex" : formData['description']
                        };
                    }
                    return query;
                }
            } else {
                return {};
            }
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

            var self = this;

            var options = _mergeObject(this.base(), {
                "helper" : "Query groups by id, name, title, description, date range, type or full query.",
                "fields" : {
                    "title" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by title."
                    },
                    "description" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by description."
                    }
                }
            });

            return options;
        },

        filterView: function() {
            return {
                "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                "layout": {
                    "bindings": {
                        "directRole": "column-1",
                        "domainId": "column-2",
                        "id": "column-1",
                        "name": "column-1",
                        "title": "column-1",
                        "description": "column-2",
                        "startDate": "column-2",
                        "endDate": "column-2",
                        "query" : "column-3"
                    }
                }
            };
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
            });

            list.hideCheckbox = true;

            list.initCompleteCallback = function() {
                $(".authority-picker").each(function() {

                    if (!$(this).parent().hasClass('asmContainer')) {
                        $(this).asmSelect({
                            sortable: false,
                            removeLabel: "Revoke"
                        });
                    }
                });
            };

            list["columns"] = [
                {
                    "title": "Group",
                    "type":"property",
                    "sortingExpression": "name",
                    "property": function(callback) {
                        var name = self.listItemProp(this, 'name');
                        var friendlyName = self.friendlyName(this);
                        //var title = ("<b>Domain</b> : " + this.getDomainId() + "<br/><b>Id</b> : " + this.getId()).replace(/</gi,"&lt;").replace(/>/gi,"&gt;");
                        //var value = "<a href='#" + self.link(this) + "' rel='tooltip-html' title='" + title +"'>" + name + "</a><br/>" + friendlyName;

                        var itemInfo = "<div>" + friendlyName + "</div>";
                        itemInfo += "<div>" + self.listItemProp(this, 'description') + "</div>";
                        itemInfo += "<div><b>Domain</b>: " + this.getDomainId() + "</div>";
                        itemInfo += "<div><b>Id</b>: " + this.getId() + "</div>";

                        var value = "<a href='#" + self.link(this) + "' title='" + name + "'>" + name + "</a>";
                        value += self.listItemInfoText(this.getId(),itemInfo);
                        callback(value);
                    }
                },
                {
                    "title": "Inherited Roles",
                    "property": function(callback) {
                        var inheritedRoles = self.listItemProp(this,'inheritedRoles',[]);
                        var value = "";
                        $.each(inheritedRoles, function() {
                            value += "<b>" + Gitana.Console.AUTHORITIES[this.grantRoleKey]['title'] + "</b><br/><a href='#"+ self.listLink('nodes') + this.grantPermissionedId + "'>Node</a><br/>";
                        });
                        callback(value);
                    }
                },
                {
                    "title": "Indirect Roles",
                    "property": function(callback) {
                        var indirectRoles = self.listItemProp(this,'indirectRoles',[]);
                        var value = "";
                        var id = this.getId();
                        $.each(indirectRoles, function() {
                            value += "<div class='asmListItem'><span class='asmListItemLabel'>" + Gitana.Console.AUTHORITIES[this.grantRoleKey]['title'] +  "</span></div>";
                            value += "<div><a href='#" + self.listLink('domains') + this.grantPrincipalDomain + "/groups/" + this.grantPrincipalId +"'>" + this.grantPrincipalName + "</a></div>";
                            var itemInfo = "<div><b>Domain</b>: " + this.grantPrincipalDomain + "</div>";
                            itemInfo += "<div><b>Id</b>: " + this.grantPrincipalId + "</div>";
                            value += self.listItemInfoText(id + "-" + this.grantPrincipalId,itemInfo);
                        });
                        callback(value);
                    }
                },
                {
                    "title": "Direct Roles",
                    "property": function(callback) {
                        var authorityPickerForm = "";
                        var id = this.getDomainId() + "/" + this.getId();

                        var roles = self.listItemProp(this, 'roles', []);
                        var inheritedRoles = self.listItemProp(this, 'inheritedRoles', []);
                        var indirectRoles = self.listItemProp(this, 'indirectRoles', []);

                        var roleKeys = [];
                        var excludedKeys = [];

                        $.each(roles, function() {
                            roleKeys.push(this.grantRoleKey);
                        });

                        $.each(inheritedRoles, function() {
                            excludedKeys.push(this.grantRoleKey);
                        });

                        $.each(indirectRoles, function() {
                            excludedKeys.push(this.grantRoleKey);
                        });

                        authorityPickerForm += "<select multiple='multiple' data-principal-id='" + id + "' class='authority-picker' title='Select and Add New Role'>";

                        $.each(Gitana.Console.AUTHORITIES, function(key, val) {
                            if ($.inArray(key, excludedKeys) == -1) {
                                var hasRole = $.inArray(key, roleKeys) == -1 ? "" : "selected='selected'";
                                authorityPickerForm += "<option value='" + key + "' " + hasRole + ">" + val['title'] + "</option>";
                            }
                        });

                        authorityPickerForm += "</select>";

                        callback(authorityPickerForm, 5);
                    }
                }

            ];

            list["loadFunction"] = function(query, pagination, callback) {

                var query =  Alpaca.cloneObject(self.query());

                var directRole = true;

                if (query && query['directRole'] != null) {
                    directRole = query['directRole'];
                    delete query['directRole'];
                }

                var domainId = "default";

                if (query && query['domainId'] != null) {
                    domainId = query['domainId'];
                    delete query['domainId'];
                }

                query['type'] = "GROUP";

                query["teamGroup"] = {
                    "$ne" : true
                };

                var loadGroupPrincipals = function() {

                    if (domainId == "default")
                    {
                        var factory = new Gitana.ObjectFactory();

                        var specialDomain = factory.domain(self.platform(), {
                            "_doc": "default"
                        });
                        var specialEveryone = factory.domainPrincipal(specialDomain, {
                            "name": "everyone",
                            "type": "GROUP",
                            "_doc": "everyone"
                        });
                        var map = new Gitana.PrincipalMap(specialDomain);
                        map.handleResponse({
                            "offset": 0,
                            "total_rows": 1,
                            "rows": {
                                "everyone": specialEveryone
                            }
                        });
                        Chain(map).then(function() {
                            loadGroupAuthorities.call(this);
                        });
                    }
                    else
                    {
                        self.platform().readDomain(domainId).queryPrincipals(query,self.pagination(pagination)).then(function() {
                            loadGroupAuthorities.call(this);
                        });
                    }
                };

                var loadGroupAuthorities = function (){

                    // create a list of domain qualified principal ids for whom we want to load authorities
                    var domainQualifiedGroupIds = [];
                    this.each(function() {
                        domainQualifiedGroupIds.push(this.getDomainQualifiedId());
                    });

                    // generate a principal authority lookup map of all authorities keyed by domain qualified principal id
                    var groupAuthorityLookup = null;
                    this.subchain(self.targetObject()).loadAuthorityGrants(domainQualifiedGroupIds, function(principalAuthorityGrants) {
                        groupAuthorityLookup = self.generateAuthorityLookup(domainId, domainQualifiedGroupIds, principalAuthorityGrants)
                    });

                    // for each user, merge in the authority information
                    this.then(function() {
                        this.each(function() {
                            _mergeObject(this, groupAuthorityLookup[this.getDomainQualifiedId()]);
                        }).then(function() {
                            callback.call(this);
                        });
                    });
                };

                if (directRole || Alpaca.isValEmpty(query)) {
                    self.targetObject().loadACL(function(acl) {
                        var groupIds = [];
                        $.each(acl.rows, function() {
                            var grant = this;
                            var principalDomainId = grant["domainId"];
                            var principalId = grant["_doc"];
                            var principalName = grant["name"];
                            var principalType = grant["type"];
                            var authorities = grant["authorities"];
                            if (principalType == 'GROUP' && domainId == principalDomainId) {
                                groupIds.push(principalId);
                            }
                        });
                        query['_doc'] = {
                            "$in" : groupIds
                        };

                        loadGroupPrincipals();

                    });
                } else {
                    loadGroupPrincipals();
                }
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        processList: function(el) {
            var self = this;
            $("body").delegate(".authority-picker", "change", function(e, data) {

                var control = $(this);
                var authoritySelection = control.val();
                var principalId = control.attr('data-principal-id');
                var targetObject = self.targetObject();

                if (data.type == 'add') {
                    var role = data.value;
                    Gitana.Utils.UI.block('Granting ' + role + ' role to group ' + principalId + '\'...');

                    Chain(targetObject).grantAuthority(principalId,role).then(function() {
                        Gitana.Utils.UI.unblock(function() {
                            self.filter(self.FILTER,self.filter(self.FILTER));
                        });
                    });
                }

                if (data.type == 'drop') {
                    var role = data.value;
                    Gitana.Utils.UI.block('Revoking ' + role + ' role from group ' + principalId + '\'...');

                    Chain(targetObject).revokeAuthority(principalId,role).then(function() {
                        Gitana.Utils.UI.unblock(function() {
                            self.filter(self.FILTER,self.filter(self.FILTER));
                        });
                    });
                }
            });

            this.base();

        },

        setupDashlets: function(el) {
            //this.setupPublicSecurity(el);
        }

    });

})(jQuery);