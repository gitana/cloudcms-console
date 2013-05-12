(function($) {
    Gitana.Console.AbstractGitanaConsoleAuthorityListGadget = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        /** abstract methods **/
        targetObject: function() {
        },

        /** ABSTRACT **/
        searchFilter: function(key) {
            return {
                $or : [
                    {
                        "title" : {
                            "$regex" : key
                        }
                    },{
                        "description" : {
                            "$regex" : key
                        }
                    },{
                        "name" : {
                            "$regex" : key
                        }
                    }
                ]
            };
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["modify_permissions"]
                }
            ];
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return {
                "directRole" : true,
                "domainId" : "default",
                "id" : "",
                "name" : "",
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
                    query['directRole'] = formData['directRole'];

                    if (formData['domainId']) {
                        query['domainId'] = formData['domainId'];
                    }

                    if (formData['id']) {
                        query['_doc'] = formData['id'];
                    }
                    if (formData['name']) {
                        query['name'] = {
                            "$regex" : formData['name']
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
                    "directRole" : {
                        "title": "Direct Role",
                        "type" : "boolean"
                    },
                    "domainId" : {
                        "title": "Domain",
                        "type" : "string"
                    },
                    "id" : {
                        "title": "Principal Id",
                        "type" : "string"
                    },
                    "name" : {
                        "title": "Principal Name",
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
                "helper" : "Query principals by domain, role option, id, last name, email, company, date range or full query.",
                "fields" : {
                    "directRole" : {
                        "label": "Direct Role",
                        "rightLabel": "Only display principals with direct roles?",
                        "helper": "Check option for only displaying principals with direct roles."
                    },
                    "domainId" : {
                        "type" : "select",
                        "helper": "Select principal domain.",
                        "dataSource": function(field, callback) {

                            // add in the "special principals" domain
                            field.selectOptions.push({
                                "value": "default",
                                "text": "Special Principals"
                            });

                            self.platform().listDomains().each(
                                function(key, val, index) {
                                    field.selectOptions.push({
                                        "value": this.getId(),
                                        "text": self.friendlyTitle(this)
                                    });
                                }).then(function() {
                                    if (callback) {
                                        callback();
                                        field.field.val('default').change();
                                    }
                                });
                        }
                    },
                    "id" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter a valid Cloud CMS id for query by exact match of id."
                    },
                    "name" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by name."
                    },
                    "startDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick start date of date range."
                    },
                    "endDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick end date of date range."
                    },
                    "query" : {
                        "type": "editor",
                        "aceMode": "ace/mode/json",
                        "aceFitContentHeight": true,
                        "helper": "Enter full query in JSON."
                    }
                }
            };
        },

        listItemInfoText: function(id, details) {
            return "<div class='list-item-more' data-principal-id='" + id + "'>More</div>"
                + "<div class='list-item-details' data-principal-id='" + id + "'>"
                + details + "</div>"
                + "<div class='list-item-less' data-principal-id='" + id + "'>Less</div>";
        },

        processList: function(el) {
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
        },

        determineAuthorityGrantDomainQualifiedId: function(domainId, grant)
        {
            var principalId = grant["principal"];

            if (grant.principalName == "everyone") {
                principalId = "everyone";
            }
            if (grant.principalName == "guest") {
                principalId = "guest";
            }

            return domainId + "/" + principalId;
        },

        generateAuthorityLookup: function(domainId, domainQualifiedPrincipalIds, principalAuthorityGrants)
        {
            var self = this;
            var principalAuthorityLookup = {};

            $.each(domainQualifiedPrincipalIds, function(index, domainQualifiedPrincipalId) {

                principalAuthorityLookup[domainQualifiedPrincipalId] = {
                    "inheritedRoles" : [],
                    "indirectRoles" : [],
                    "roles" : []
                };

                var authorityGrants = principalAuthorityGrants[domainQualifiedPrincipalId];
                for (var grantId in authorityGrants) {

                    var authorityGrant = authorityGrants[grantId];

                    // the "role key" of the authority (i.e. consumer, collaborator)
                    var grantRoleKey = authorityGrant["role-key"];

                    // the domain qualified id of the principal who was granted the right
                    var grantPrincipalId = self.determineAuthorityGrantDomainQualifiedId(domainId, authorityGrant);

                    // the domain
                    var grantDomainId = authorityGrant["domain"];

                    // the name of the principal
                    var grantPrincipalName = authorityGrant["principalName"];

                    // the id of the object that was granted against (i.e. server id, repo id)
                    var grantPermissionedId = authorityGrant["permissioned"];

                    // NOTE: if the grant was made directly, then grantPrincipalId == userId1
                    // otherwise, grantPrincipalId == the id of the security user that was granted the authority
                    // and to which the principal userId1 belongs
                    var indirect = (grantPrincipalId != domainQualifiedPrincipalId);

                    if (indirect) {

                        principalAuthorityLookup[domainQualifiedPrincipalId]['indirectRoles'].push({
                            "grantId" : grantId,
                            "grantRoleKey" : grantRoleKey,
                            "grantPrincipalId" : grantPrincipalId,
                            "grantPrincipalDomain" : grantDomainId,
                            "grantPrincipalName" : grantPrincipalName,
                            "grantPermissionedId" : grantPermissionedId
                        });

                    } else {

                        principalAuthorityLookup[domainQualifiedPrincipalId]['roles'].push({
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

                    var inheritsFrom = authorityGrant["inheritsFrom"];

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

                        principalAuthorityLookup[domainQualifiedPrincipalId]['inheritedRoles'].push({
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

            return principalAuthorityLookup;
        }

    });

})(jQuery);