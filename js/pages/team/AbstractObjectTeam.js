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
                    },
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
                    }/*,
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
                            var id = this.getDomainId();
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
                            var id = this.getName();
                            var value = "<a href='#" + self.link(this) + "'>" + id + "</a>";
                            callback(value);
                        }
                    },
                    {
                        "title": "Title",
                        "type":"property",
                        "sortingExpression": "title",
                        "property": function(callback) {
                            var type = this.TYPE;
                            if (type == "GROUP") {
                                var title = this.get('title') ? this.get('title') : "";
                                callback(title);
                            } else {
                                var name = "";
                                if (this.getFirstName()) {
                                    name += this.getFirstName() + " ";
                                }
                                if (this.getLastName()) {
                                    name += this.getLastName();
                                }
                                callback(name);
                            }
                        }
                    },
                    {
                        "title": "Type",
                        "type":"property",
                        "sortingExpression": "type",
                        "property": function(callback) {
                            callback(this.TYPE);
                        }
                    },
                    {
                        "title": "Membership",
                        "property": function(callback) {
                            var buttonText = this.get('isMember') ? "Remove" : "Add";
                            var buttonClass = this.get('isMember') ? "membership-remove" : "membership-add";
                            var value = "<a id='" + this.getDomainQualifiedId() + "' class='membership-action " + buttonClass + "'><span>" + buttonText + "</span></a>";
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
                        Chain(self.targetObject()).trap(
                            function(error) {
                                return self.handlePageError(el, error);
                            }).listMembers(self.pagination()).each(
                            function() {
                                this.object['isMember'] = true;
                                domainIds.push(this.getDomainId());
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
                                    this.each(
                                        function() {
                                            if (domainLookup[this.getDomainId()]) {
                                                this.object['domainName'] = domainLookup[this.getDomainId()]['name'];
                                                this.object['domainLink'] = domainLookup[this.getDomainId()]['link'];
                                            }
                                        }).then(function() {
                                            callback.call(this);
                                        });
                                })

                            });
                    } else {

                        delete principalQuery['member'];

                        var domainId = principalQuery['domainId'] ? principalQuery['domainId'] : "default";

                        delete principalQuery['domainId'];

                        Alpaca.mergeObject(principalQuery, {
                            "teamGroup" : {
                                "$ne" : true
                            }
                        });

                        var domainName, domainLink;

                        Chain(self.platform()).readDomain(domainId).then(function() {
                            domainName = self.friendlyTitle(this);
                            domainLink = self.link(this);
                            this.then(function() {
                                this.queryPrincipals(principalQuery, self.pagination(pagination)).then(function() {

                                    this.subchain(self.targetObject()).listMembers().each(function() {
                                        memberIds.push(this.getId());
                                    });

                                    this.then(function() {
                                        this.each(
                                            function() {
                                                if ($.inArray(this.getId(), memberIds) != -1) {
                                                    this.object['isMember'] = true;
                                                } else {
                                                    this.object['isMember'] = false;
                                                }
                                                this.object['domainName'] = domainName;
                                                this.object['domainLink'] = domainLink;
                                            }).then(function() {
                                                callback.call(this);
                                            });
                                    });
                                });
                            });
                        });
                    }
                };

                // store list configuration onto observer
                self.list(this.SUBSCRIPTION, list);
            },

            processList: function(el) {
                var self = this;

                $("body").undelegate(".membership-add", "click").delegate(".membership-add", "click", function() {
                    var control = $(this);
                    var userId = control.attr('id');
                    Gitana.Utils.UI.block('Adding member ' + userId + '...');
                    Chain(self.targetObject()).trap(
                        function() {

                        }).addMember(userId).then(function() {
                            Gitana.Utils.UI.unblock();
                            control.removeClass('membership-add').addClass('membership-remove');
                            $('span', $(control)).html('Remove');
                        });
                });

                $("body").undelegate(".membership-remove", "click").delegate(".membership-remove", "click", function() {
                    var control = $(this);
                    var userId = control.attr('id');

                    Gitana.Utils.UI.block('Removing member ' + userId + '...');
                    Chain(self.targetObject()).trap(
                        function() {

                        }).removeMember(userId).then(function() {
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

            setupDashlets : function () {
                this.setupProfile();
            },

            setupPage : function(el) {
                var page = {
                    "title" : "Team " + this.friendlyTitle(this.targetObject()),
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

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }

        });

})(jQuery);