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
                if (! Alpaca.isValEmpty(formData.query)) {
                    return JSON.parse(formData.query);
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
                        "type" : "json",
                        "cols": 60,
                        "rows" : 5,
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
        }

    });

})(jQuery);