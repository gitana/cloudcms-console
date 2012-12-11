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
            return Alpaca.mergeObject(this.base(),{
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
            return Alpaca.mergeObject(this.base(),{
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
            return Alpaca.mergeObject(this.base(),{
                "helper" : "Query users by id, name, last name, email, company name, date range or full query.",
                "fields" : {
                    "lastName" : {
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
            }

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

                var loadUserAuthorities = function (){

                    self.platform().readDomain(domainId).queryPrincipals(query, self.pagination(pagination)).then(function() {

                        var userIds = [];

                        var userAuthorityLookup = {};

                        this.each(function() {
                            userIds.push(this.getDomainId() + "/" + this.getId());
                        });

                        this.subchain(self.targetObject()).loadAuthorityGrants(userIds, function(principalAuthorityGrants) {

                            $.each(userIds, function(index, principalId) {

                                userAuthorityLookup[principalId] = {

                                    "inheritedRoles" : [],

                                    "indirectRoles" : [],

                                    "roles" : []

                                };

                                var authorityGrants = principalAuthorityGrants[principalId];

                                for (var grantId in authorityGrants) {

                                    var grant = authorityGrants[grantId];

                                    // the "role key" of the authority (i.e. consumer, collaborator)
                                    var grantRoleKey = grant["role-key"];

                                    // the id of the principal who was granted the right
                                    var grantPrincipalId = domainId + "/" + grant["principal"];

                                    var grantDomainId = grant["domain"];

                                    var grantPrincipalFullId = grantDomainId + "/" + grantPrincipalId;

                                    var grantPrincipalName = grant["principalName"];

                                    // the id of the object that was granted against (i.e. server id, repo id)
                                    var grantPermissionedId = grant["permissioned"];

                                    // NOTE: if the grant was made directly, then grantPrincipalId == userId1
                                    // otherwise, grantPrincipalId == the id of the security user that was granted the authority
                                    // and to which the principal userId1 belongs
                                    var indirect = (grantPrincipalId != principalId);

                                    if (indirect) {

                                        userAuthorityLookup[principalId]['indirectRoles'].push({
                                            "grantId" : grantId,
                                            "grantRoleKey" : grantRoleKey,
                                            "grantPrincipalId" : grantPrincipalId,
                                            "grantPrincipalDomain" : grantDomainId,
                                            "grantPrincipalName" : grantPrincipalName,
                                            "grantPermissionedId" : grantPermissionedId
                                        });

                                    } else {

                                        userAuthorityLookup[principalId]['roles'].push({
                                            "grantId" : grantId,
                                            "grantRoleKey" : grantRoleKey,
                                            "grantPrincipalId" : grantPrincipalId,
                                            "grantPrincipalDomain" : grantDomainId,
                                            "grantPrincipalName" : grantPrincipalName,
                                            "grantPermissionedId" : grantPermissionedId
                                        });

                                    }

                                    // NOTE: in the case of nodes, authorities may also be inherited (i.e. propagated) due to
                                    // authorities being assigned to a node on the other side of an association that propagates
                                    // authorities (like the a:child association).

                                    var inheritsFrom = grant["inheritsFrom"];

                                    //text += "\n\tinherited: " + (!Gitana.isEmpty(inheritsFrom));

                                    if (inheritsFrom) {
                                        // the id of the grant being masked
                                        // this is usually the original association id that our propagated association is masking
                                        var inheritedGrantId = inheritsFrom["id"];

                                        // the id of the original principal
                                        // this should be the same as userId1
                                        var inheritedDomainId = inheritsFrom["domain"];
                                        var inheritedPrincipalId = inheritsFrom["principal"];
                                        var inheritedPrincipalName = inheritsFrom["principalName"];
                                        // the id of the original permissioned
                                        // this may be something like the folder that our document sits inside of
                                        var inheritedPermissionedId = inheritsFrom["permissioned"];

                                        userAuthorityLookup[principalId]['inheritedRoles'].push({
                                            "grantId" : inheritedGrantId,
                                            "grantRoleKey" : grantRoleKey,
                                            "grantPrincipalId" : inheritedPrincipalId,
                                            "grantPrincipalDomain" : inheritedDomainId,
                                            "grantPrincipalName" : inheritedPrincipalName,
                                            "grantPermissionedId" : inheritedPermissionedId
                                        });

                                    }

                                }
                            });
                        });

                        this.then(function() {
                            var _this = this;
                            this.each(
                                function() {

                                    var userId = this.getDomainId() + "/" + this.getId();

                                    Alpaca.mergeObject(_this[this.getId()], userAuthorityLookup[userId]);

                                }).then(function() {

                                    callback.call(this);

                                });

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
                        }

                        loadUserAuthorities();

                    });
                } else {
                   loadUserAuthorities();
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