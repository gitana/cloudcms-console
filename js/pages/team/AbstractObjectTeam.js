(function($) {
    Gitana.Console.Pages.AbstractObjectTeam = Gitana.Console.Pages.AbstractDomainGroup.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.team();
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            //if (self.targetObject().getKey() != "owners") {
            self.addButtons([
                {
                    "id": "edit",
                    "title": "Edit Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-edit', 48),
                    "url" : self.teamLink(this.targetObject(), this.contextObject(), "edit"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["edit"]
                        }
                    ]
                },
                {
                    "id": "delete",
                    "title": "Delete Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-delete', 48),
                    "click": function(group) {
                        var link = self.teamLink(null, self.contextObject());
                        self.onClickDelete(self.targetObject(), 'team', link, Gitana.Utils.Image.buildImageUri('security', 'team', 20), 'team');
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["delete"]
                        }
                    ]
                }//,
                /*
                {
                    "id": "edit-json",
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "url" : self.teamLink(this.targetObject(), this.contextObject(), "edit", "json"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["edit"]
                        }
                    ]
                }*//*,
                {
                    "id": "export",
                    "title": "Export Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "url" : self.teamLink(this.targetObject(), this.contextObject(), "export"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["read"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": "Import Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : self.teamLink(this.targetObject(), this.contextObject(), "import"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }*/
            ], self.SUBSCRIPTION + "-page-toolbar");
            //}
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
                    "title": "Domain",
                    "type":"property",
                    "sortingExpression": "domainId",
                    "property": function(callback) {
                        var id = this["domainId"];//.getDomainId();
                        var link = this.get('domainLink') ? this.get('domainLink') : self.listLink('domains') + id;
                        var name = self.listItemProp(this, 'domainName', id);
                        // make sure we get the primary domain name
                        if (name == id && self.primaryDomain() && self.primaryDomain().getId() == id) {
                            name = "Primary Domain";
                        }
                        var value = "<a href='#" + link + "'>" + name + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Principal",
                    "type":"property",
                    "sortingExpression": "name",
                    "property": function(callback) {
                        //var name = this.getName();
                        var name = this["name"];
                        var value = "<a href='#" + self.link(this) + "'>" + name + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {

                        var title = null;

                        // cover both cases: member or principal since this class uses both
                        var isUser = (this.TYPE == "USER" || this.TYPE == "user" || this.type == "USER" || this.type == "user");
                        if (!isUser)
                        {
                            title = this["title"];
                            if (!title) {
                                title = this["name"];
                            }
                        }
                        else
                        {
                            title = this["title"];
                            if (!title) {
                                title = this["fullName"];
                            }
                            if (!title) {
                                title = this["name"];
                            }
                        }

                        callback(title);
                    }
                },
                {
                    "title": "Type",
                    "type":"property",
                    "sortingExpression": "type",
                    "property": function(callback) {

                        var typeString = "group";
                        var isUser = (this.TYPE == "USER" || this.TYPE == "user" || this.type == "USER" || this.type == "user");
                        if (isUser) {
                            typeString = "user";
                        }

                        callback(typeString);
                    }
                },
                {
                    "title": "Membership",
                    "property": function(callback) {

                        var buttonText = this.get('isMember') ? "Remove" : "Add";
                        var buttonClass = this.get('isMember') ? "membership-remove" : "membership-add";

                        var domainQualifiedId = this["domainId"] + "/" + this["_doc"];
                        var value = "<a id='" + domainQualifiedId + "' class='membership-action " + buttonClass + "'><span>" + buttonText + "</span></a>";
                        callback(value);
                    }
                }
            ];
            list["loadFunction"] = function(query, pagination, callback) {
                var memberIds = [];
                var principalQuery = Alpaca.cloneObject(self.query());

                if (Alpaca.isValEmpty(principalQuery) || principalQuery['member']) {
                    var domainIds = [];
                    var domainLookup = {};
                    Chain(self.targetObject()).trap(function(error) {
                            return self.handlePageError(el, error);
                    }).listMembers(self.pagination()).then(function(){
                        this.each(function() {
                            this.isMember = true;
                            domainIds.push(this["domainId"]);
                        }).then(function() {
                            this.subchain(self.platform()).queryDomains({
                                "repository" : {
                                    "$in" : domainIds
                                }
                            }).each(function() {
                                domainLookup[this.getId()] = {
                                    "name" : self.friendlyTitle(this),
                                    "link" : self.link(this)
                                }
                            });

                            this.then(function() {
                                this.each(function() {
                                    if (domainLookup[this["domainId"]]) {
                                        this["domainName"] = domainLookup[this["domainId"]]['name'];
                                        this['domainLink'] = domainLookup[this["domainId"]]['link'];
                                    }
                                }).then(function() {
                                    callback.call(this);
                                });
                            })

                        });
                    });
                } else {

                    delete principalQuery['member'];

                    var domainId = principalQuery['domainId'] ? principalQuery['domainId'] : "default";

                    delete principalQuery['domainId'];

                    _mergeObject(principalQuery, {
                        "teamGroup" : {
                            "$ne" : true
                        }
                    });

                    var handleAuthorities = function()
                    {
                        this.subchain(self.targetObject()).listMembers().each(function() {
                            memberIds.push(this.getId());
                        });

                        this.then(function() {
                            this.each(function() {
                                if ($.inArray(this.getId(), memberIds) != -1) {
                                    this.isMember = true;
                                } else {
                                    this.isMember = false;
                                }
                                this['domainName'] = domainName;
                                this['domainLink'] = domainLink;
                            }).then(function() {
                                callback.call(this);
                            });
                        });
                    };

                    if (domainId == "default")
                    {
                        var factory = new Gitana.ObjectFactory();

                        var specialDomain = factory.domain(self.platform(), {
                            "_doc": "default"
                        });
                        var specialGuest = factory.domainPrincipal(specialDomain, {
                            "name": "guest",
                            "type": "USER",
                            "_doc": "guest",
                            "domainId": "default"
                        });
                        var specialEveryone = factory.domainPrincipal(specialDomain, {
                            "name": "everyone",
                            "type": "GROUP",
                            "_doc": "everyone",
                            "domainId": "default"
                        });
                        var map = new Gitana.PrincipalMap(specialDomain);
                        map.handleResponse({
                            "offset": 0,
                            "total_rows": 2,
                            "rows": {
                                "everyone": specialEveryone,
                                "guest": specialGuest
                            }
                        });
                        Chain(map).then(function() {
                            handleAuthorities.call(this)
                        });
                    }
                    else
                    {
                        var domainName, domainLink;
                        Chain(self.platform()).readDomain(domainId).then(function() {
                            domainName = self.friendlyTitle(this);
                            domainLink = self.link(this);
                            this.then(function() {
                                this.queryPrincipals(principalQuery, self.pagination(pagination)).then(function() {
                                    handleAuthorities.call(this);
                                });
                            });
                        });
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
                var principalId = control.attr('id');

                Gitana.Utils.UI.block('Adding member...<br/>' + principalId);
                Chain(self.targetObject()).trap(
                    function() {

                    }).addMember(principalId).then(function() {
                        Gitana.Utils.UI.unblock();
                        control.removeClass('membership-add').addClass('membership-remove');
                        $('span', $(control)).html('Remove');
                    });
            });

            $("body").undelegate(".membership-remove", "click").delegate(".membership-remove", "click", function() {
                var control = $(this);
                var principalId = control.attr('id');

                Gitana.Utils.UI.block('Removing member...<br/>' + principalId);
                Chain(self.targetObject()).trap(
                    function() {

                    }).removeMember(principalId).then(function() {
                        Gitana.Utils.UI.unblock();
                        control.removeClass('membership-remove').addClass('membership-add');
                        $('span', $(control)).html('Add');
                    });
            });
        },

        setupProfile: function () {
            var self = this;
            var team = self.team();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'team', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "Team Key",
                        "value" : team.getKey()
                    },
                    {
                        "key" : "Roles",
                        "value" : self.listItemProp(team, 'roleKeys').join(';')
                    },
                    {
                        "key" : "Title",
                        "value" : ""
                    },
                    {
                        "key" : "Description",
                        "value" : ""
                    },
                    {
                        "key" : "Avatar",
                        "img" : "",
                        "class" : "avatar-photo"
                    },
                    {
                        "key" : "Last Modified",
                        "value" : ""
                    }
                ]
            };

            this.pairs("team-profile-pairs", pairs);

            self.group().then(function() {

                pairs["items"][2]['value'] = self.listItemProp(this, 'title');
                pairs["items"][3]['value'] = self.listItemProp(this, 'description');
                pairs["items"][5]['value'] = "By " + this.getSystemMetadata().getModifiedBy() + " @ " + this.getSystemMetadata().getModifiedOn().getTimestamp();
                self.pairs("team-profile-pairs", pairs);

                this.attachment('avatar').trap(
                    function() {
                        return false;
                    }).then(function() {
                        if (this.getLength() > 0) {
                            pairs["items"][4]['img'] = this.getDownloadUri();
                            self.pairs("team-profile-pairs", pairs);
                        }
                    });
            });
        },

        setupDashlets : function (el, callback) {
            this.setupProfile();
            callback();
        },

        setupPage : function(el) {
            var page = {
                "title" : "Team " + this.friendlyTitle(this.targetObject()),
                "description": "Overview of the team",
                "listTitle" : "Manage Memberships",
                "subscription" : this.SUBSCRIPTION,
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "filter" : this.FILTER,
                "pageToolbar" : true,
                "dashlets" :[
                    {
                        "id" : "pairs",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "team-profile-pairs"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        },

        filterOptions: function() {

            var self = this;

            var options = this.base();

            options.fields.domainId.dataSource = function(field, callback)
            {
                // add in the "special principals" domain
                field.selectOptions.push({
                    "value": "default",
                    "text": "Special Principals"
                });

                self.platform().listDomains({
                    "limit": Gitana.Console.LIMIT_NONE
                }).each(function(key, val, index) {
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
            };

            return options;
        }
    });

})(jQuery);