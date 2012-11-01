(function($) {
    Gitana.Console.Pages.AbstractDomainGroup = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Principals",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'member-manage', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return {
                "member" : true,
                "type" : "",
                "id" : "",
                "name" : "",
                "title" : "",
                "description" : "",
                "lastName" : "",
                "email" : "",
                "companyName" : "",
                "startDate" : "",
                "endDate": "",
                "query" : ""
            };
        },

        filterFormToJSON: function (formData) {
            if (! Alpaca.isValEmpty(formData)) {
                if (! Alpaca.isValEmpty(formData.query)) {
                    return JSON.parse(formData.query);
                } else {
                    var query = {};
                    query['member'] = formData['member'];

                    if (formData['type']) {
                        query['type'] = formData['type'];
                    }
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
                    if (formData['title']) {
                        query['title'] = {
                            "$regex" : formData['title']
                        };
                    }
                    if (formData['description']) {
                        query['description'] = {
                            "$regex" : formData['description']
                        };
                    }
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
                    "member" : {
                        "title": "Member",
                        "type" : "boolean"
                    },
                    "domainId" : {
                        "title": "Domain",
                        "type" : "string",
                        "dependencies" : "member"
                    },
                    "type" : {
                        "title": "Principal Type",
                        "type" : "string",
                        "enum" : ['USER','GROUP'],
                        "dependencies" : "member"
                    },
                    "id" : {
                        "title": "Principal Id",
                        "type" : "string",
                        "dependencies" : "member"
                    },
                    "name" : {
                        "title": "Principal Name",
                        "type" : "string",
                        "dependencies" : "member"
                    },
                    "title" : {
                        "title": "Title",
                        "type" : "string",
                        "dependencies" : "member"
                    },
                    "description" : {
                        "title": "Description",
                        "type" : "string",
                        "dependencies" : "member"
                    },
                    "lastName" : {
                        "title": "Last Name",
                        "type" : "string",
                        "dependencies" : "member"
                    },
                    "email" : {
                        "title": "Email",
                        "type" : "string",
                        "dependencies" : "member"
                    },
                    "companyName" : {
                        "title": "Company Name",
                        "type" : "string",
                        "dependencies" : "member"
                    },
                    "startDate" : {
                        "title": "Start Date",
                        "type" : "string",
                        "format": "date",
                        "dependencies" : "member"
                    },
                    "endDate" : {
                        "title": "End Date",
                        "type" : "string",
                        "format": "date",
                        "dependencies" : "member"
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
                "helper" : "Query principals by membership, id, last name, email, company, date range, title, description or full query.",
                "fields" : {
                    "member" : {
                        "label": "Membership",
                        "rightLabel": "Only display group members?",
                        "helper": "Check this option for displaying group members only."
                    },
                    "domainId" : {
                        "type" : "select",
                        "helper": "Select principal domain.",
                        "dataSource": function(field, callback) {
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
                        },
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "type" : {
                        "type" : "select",
                        "helper": "Select member type.",
                        "optionLabels": ["User", "Group"],
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "id" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter a valid Cloud CMS id for query by exact match of id.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "name" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by principal name.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "title" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by title.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "description" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by description.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "lastName" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by last name.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "email" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by email.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "companyName" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by company name.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "startDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick start date of date range.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "endDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick end date of date range.",
                        "dependencies" : {
                            "member" : function(value) {
                                return !value;
                            }
                        }
                    },
                    "query" : {
                        "type" : "json",
                        "cols": 60,
                        "rows" : 5,
                        "helper": "Enter full query in JSON."
                    }
                }
            };
        },

        filterView: function() {
            return {
                "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                "layout": {
                    "bindings": {
                        "member": "column-1",
                        "domainId": "column-1",
                        "id": "column-1",
                        "lastName": "column-1",
                        "email": "column-2",
                        "name": "column-2",
                        "title": "column-1",
                        "description": "column-2",
                        "type": "column-1",
                        "companyName": "column-2",
                        "startDate": "column-2",
                        "endDate": "column-2",
                        "query" : "column-3"
                    }
                }
            };
        },

        processList: function(el) {
            var self = this;

            $("body").undelegate(".member-selection", "click").delegate(".member-selection", "click", function() {
                var control = $(this);
                var userId = control.val();
                var option = control.is(':checked');
                if (option) {
                    Gitana.Utils.UI.block('Adding member ' + userId + '...');
                    Chain(self.targetObject()).trap(function() {

                    }).addMember(userId).then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                } else {
                    Gitana.Utils.UI.block('Removing member ' + userId + '...');
                    Chain(self.targetObject()).trap(function() {

                    }).removeMember(userId).then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                }
            })
        }
    });

})(jQuery);