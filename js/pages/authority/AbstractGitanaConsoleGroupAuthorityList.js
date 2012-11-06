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
                if (! Alpaca.isValEmpty(formData.query)) {
                    return JSON.parse(formData.query);
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
            return Alpaca.mergeObject(this.base(), {
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

            var options = Alpaca.mergeObject(this.base(), {
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
            }

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

                var loadGroupAuthorities = function (){

                    self.platform().readDomain(domainId).queryPrincipals(query,self.pagination(pagination)).then(function() {

                        var groupIds = [];

                        var groupAuthorityLookup = {};

                        this.each(function() {
                            groupIds.push(this.getDomainQualifiedId());
                        });

                        this.subchain(self.targetObject()).loadAuthorityGrants(groupIds,function(principalAuthorityGrants) {

                            $.each(groupIds, function(index, principalId) {

                                groupAuthorityLookup[principalId] = {

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
                                    var grantPrincipalId = grant["principal"];

                                    var grantDomainId = grant["domain"];

                                    var grantPrincipalFullId = grantDomainId + "/" + grantPrincipalId;

                                    var grantPrincipalName = grant["principalName"];

                                    // the id of the object that was granted against (i.e. server id, repo id)
                                    var grantPermissionedId = grant["permissioned"];

                                    // NOTE: if the grant was made directly, then grantPrincipalId == userId1
                                    // otherwise, grantPrincipalId == the id of the security group that was granted the authority
                                    // and to which the principal userId1 belongs
                                    var indirect = (grantPrincipalFullId != principalId);

                                    /*
                                     var text = "Principal: " + principalId + " was granted: " + grantId;
                                     text += "\n\trole: " + grantRoleKey;
                                     text += "\n\tprincipal: " + grantPrincipalId;
                                     text += "\n\tpermissioned: " + grantPermissionedId;
                                     text += "\n\tindirect: " + indirect;
                                     */

                                    if (indirect) {

                                        var indirectRole = {
                                            "grantId" : grantId,
                                            "grantRoleKey" : grantRoleKey,
                                            "grantPrincipalId" : grantPrincipalId,
                                            "grantPrincipalDomain" : grantDomainId,
                                            "grantPrincipalName" : grantPrincipalName,
                                            "grantPermissionedId" : grantPermissionedId
                                        };

                                        groupAuthorityLookup[principalId]['indirectRoles'].push(indirectRole);

                                    } else {

                                        groupAuthorityLookup[principalId]['roles'].push({
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

                                        /*
                                         text += "\n\t\tid: " + inheritedGrantId;
                                         text += "\n\t\tprincipal: " + inheritedPrincipalId;
                                         text += "\n\t\tpermissioned: " + inheritedPermissionedId;
                                         */

                                        groupAuthorityLookup[principalId]['inheritedRoles'].push({
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

                            this.each(function() {

                                var groupId = this.getDomainId() + "/" + this.getId();

                                Alpaca.mergeObject(_this[this.getId()], groupAuthorityLookup[groupId]);

                            }).then(function() {

                               callback.call(this);

                            });

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
                        }

                        loadGroupAuthorities();

                    });
                } else {
                   loadGroupAuthorities();
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

        /*
        publicSecurityDashlet: function() {
            return [
                {
                    "id" : "public-security",
                    "grid" : "grid_4"
                }
            ]
        },


        setupPublicSecurity: function(el) {
            var self = this;
            var authorityPickerForm = "<h3>Roles for General Public</h3>";
            var id = 'EVERYONE';
            var targetObject = self.targetObject();
            if (targetObject.listAuthorities) {
                var hasAuthority = false;
                authorityPickerForm += "<select multiple='multiple' data-principal-id='" + id + "' class='public-authority-picker' title='Select and Add New Role for General Public'>";
                targetObject.listAuthorities(Gitana.EVERYONE, function(authorities) {
                    hasAuthority = true;
                    $.each(Gitana.Console.AUTHORITIES, function(key, val) {
                        var hasRole = $.inArray(key, authorities) == -1 ? "" : "selected='selected'";
                        authorityPickerForm += "<option value='" + key + "' " + hasRole + ">" + val['title'] + "</option>";
                    });
                }).then(function() {
                    if (!hasAuthority) {
                        $.each(Gitana.Console.AUTHORITIES, function(key, val) {
                            authorityPickerForm += "<option value='" + key + "'>" + val['title'] + "</option>";
                        });
                    }
                    authorityPickerForm += "</select>";
                    $('#public-security').empty().append(authorityPickerForm);
                    $(".public-authority-picker").asmSelect({
                        sortable: false,
                        removeLabel: "Revoke"
                    });
                });
            }
            $("body").undelegate(".public-authority-picker", "change").delegate(".public-authority-picker", "change", function(e, data) {

                var control = $(this);
                var authoritySelection = control.val();
                var principalId = id;
                var targetObject = self.targetObject();

                if (data.type == 'add') {
                    var role = data.value;
                    Gitana.Utils.UI.block('Granting ' + role + ' role to group ' + principalId + '\'...');

                    Chain(targetObject).grantAuthority(Gitana.EVERYONE,role).then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                }

                if (data.type == 'drop') {
                    var role = data.value;
                    Gitana.Utils.UI.block('Revoking ' + role + ' role from group ' + principalId + '\'...');

                    Chain(targetObject).revokeAuthority(Gitana.EVERYONE,role).then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                }
            })
        },
        */

        setupDashlets: function(el) {
            //this.setupPublicSecurity(el);
        }

    });

})(jQuery);