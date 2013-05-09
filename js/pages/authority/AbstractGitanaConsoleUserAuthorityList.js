(function($) {
    Gitana.Console.AbstractGitanaConsoleUserAuthorityListGadget = Gitana.Console.AbstractGitanaConsoleAuthorityListGadget.extend(
    {
        SUBSCRIPTION : "authority-users",

        FILTER : "authority-user-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Users",
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
                    "id": "authority-groups",
                    "title": "Group Security",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-security', 48),
                    "url" : self.LINK().call(self,self.targetObject(),'authorities','groups')
                }
            ]);
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return _mergeObject(this.base(),{
                "lastName" : "",
                "email" : "",
                "companyName" : ""
            });
        },

        filterFormToJSON: function (formData) {
            if (! Alpaca.isValEmpty(formData)) {
                if (! Alpaca.isValEmpty(formData.query)) {
                    return JSON.parse(formData.query);
                } else {
                    var query = this.base(formData);
                    if (formData['lastName']) {
                        query['lastName'] = {
                            "$regex" : formData['lastName']
                        };
                    }
                    if (formData['email']) {
                        query['email'] = {
                            "$regex" : formData['email']
                        };
                    }
                    if (formData['companyName']) {
                        query['companyName'] = {
                            "$regex" : formData['companyName']
                        };
                    }
                    return query;
                }
            } else {
                return {};
            }
        },

        filterSchema: function () {
            return _mergeObject(this.base(),{
                "properties" : {
                    "lastName" : {
                        "title": "Last Name",
                        "type" : "string"
                    },
                    "email" : {
                        "title": "Email",
                        "type" : "string"
                    },
                    "companyName" : {
                        "title": "Company Name",
                        "type" : "string"
                    }
                }
            });
        },

        filterOptions: function() {
            return _mergeObject(this.base(),{
                "helper" : "Search for users and assign security rights.",
                "fields" : {
                    "text" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by last name."
                    },
                    "email" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by email."
                    },
                    "companyName" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by company name."
                    }
                }
            });
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
                        "lastName": "column-1",
                        "email": "column-1",
                        "companyName": "column-2",
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
                            removeLabel: "revoke"
                        });
                    }
                });
            };

            list["columns"] = [
                {
                    "title": "ID",
                    "type":"property",
                    "sortingExpression": "name",
                    "property": function(callback) {
                        var name = self.listItemProp(this,'name');
                        var friendlyName = self.friendlyName(this);
                        var itemInfo = "<div>" + friendlyName + "</div>";
                        itemInfo += "<div>" + self.listItemProp(this, 'email') + "</div>";
                        itemInfo += "<div>" + self.listItemProp(this, 'companyName') + "</div>";
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
                        /*var indirectRoles = self.listItemProp(this,'indirectRoles',[]);
                        var value = "";
                        $.each(indirectRoles, function() {
                            value += "<b>" + Gitana.Console.AUTHORITIES[this.grantRoleKey]['title'] +  "</b><br/>" + this.grantPrincipalId.replace('/','<br/>') + "<br/>";
                        });
                        callback(value);*/
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

                        var id = this.getDomainQualifiedId();

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

                        authorityPickerForm += "<select multiple='multiple' data-principal-id='" + id + "' class='authority-picker' title='Select and Add a Role'>";

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
                var query = Alpaca.cloneObject(self.query());

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

                query['type'] = "USER";

                var loadUserPrincipals = function() {

                    if (domainId == "default")
                    {
                        var factory = new Gitana.ObjectFactory();

                        var specialDomain = factory.domain(self.platform(), {
                            "_doc": "default"
                        });
                        var specialGuest = factory.domainPrincipal(specialDomain, {
                            "name": "guest",
                            "type": "USER",
                            "_doc": "guest"
                        });
                        var map = new Gitana.PrincipalMap(specialDomain);
                        map.handleResponse({
                            "offset": 0,
                            "total_rows": 1,
                            "rows": {
                                "guest": specialGuest
                            }
                        });
                        Chain(map).then(function() {
                            loadUserAuthorities.call(this);
                        });
                    }
                    else
                    {
                        self.platform().readDomain(domainId).queryPrincipals(query,self.pagination(pagination)).then(function() {
                            loadUserAuthorities.call(this);
                        });
                    }
                };

                var loadUserAuthorities = function (){

                    // create a list of domain qualified principal ids for whom we want to load authorities
                    var domainQualifiedUserIds = [];
                    this.each(function() {
                        domainQualifiedUserIds.push(this.getDomainQualifiedId());
                    });

                    // generate a principal authority lookup map of all authorities keyed by domain qualified principal id
                    var userAuthorityLookup = null;
                    this.subchain(self.targetObject()).loadAuthorityGrants(domainQualifiedUserIds, function(principalAuthorityGrants) {
                        userAuthorityLookup = self.generateAuthorityLookup(domainId, domainQualifiedUserIds, principalAuthorityGrants)
                    });

                    // for each user, merge in the authority information
                    this.then(function() {
                        this.each(function() {
                            _mergeObject(this, userAuthorityLookup[this.getDomainQualifiedId()]);
                        }).then(function() {
                            callback.call(this);
                        });
                    });
                };

                if (directRole || Alpaca.isValEmpty(query)) {
                    self.targetObject().loadACL(function(acl) {
                        var userIds = [];
                        $.each(acl.rows, function() {
                            var grant = this;
                            var principalDomainId = grant["domainId"];
                            var principalId = grant["_doc"];
                            var principalName = grant["name"];
                            var principalType = grant["type"];
                            var authorities = grant["authorities"];
                            if (principalType == 'USER' && domainId == principalDomainId) {
                                userIds.push(principalId);
                            }
                        });
                        query['_doc'] = {
                            "$in" : userIds
                        };

                        loadUserPrincipals();

                    });
                } else {
                    loadUserPrincipals();
                }


            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        processList: function(el) {
            var self = this;
            $("body").undelegate(".authority-picker", "change").delegate(".authority-picker", "change", function(e, data) {

                var control = $(this);
                var authoritySelection = control.val();
                var principalId = control.attr('data-principal-id');
                var targetObject = self.targetObject();

                if (data.type == 'add') {
                    var role = data.value;
                    Gitana.Utils.UI.block('Granting ' + role + ' role to user ' + principalId + '\'...');

                    Chain(targetObject).grantAuthority(principalId,role).then(function() {
                        Gitana.Utils.UI.unblock(function() {
                            self.filter(self.FILTER,self.filter(self.FILTER));
                        });
                    });
                }

                if (data.type == 'drop') {
                    var role = data.value;
                    Gitana.Utils.UI.block('Revoking ' + role + ' role from user ' + principalId + '\'...');

                    Chain(targetObject).revokeAuthority(principalId,role).then(function() {
                        Gitana.Utils.UI.unblock(function() {
                            self.filter(self.FILTER,self.filter(self.FILTER));
                        });
                    });
                }
            });

            this.base();
        }

    });

})(jQuery);