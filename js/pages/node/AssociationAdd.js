(function($) {
    Gitana.Console.Pages.AssociationAdd = Gitana.CMS.Pages.AbstractListFormPageGadget.extend(
    {
        TEMPLATE: "layouts/console.picker.form",

        SUBSCRIPTION : "nodes-candidates",

        FILTER : "node-candidates-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Nodes",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        schema: function() {

            return _mergeObject({
                "properties" : {
                    "target" : {
                        "title": "Target Node Id",
                        "type" : "string"                        
                    }/*,
                    "_type" : {
                        "title": "Association Type",
                        "type" : "string",
                        "default" : "a:child",
                        "required" : true                        
                    }*/,
                    "direction" : {
                        "title": "Association Direction",
                        "type" : "string",
                        "default" : "OUTGOING",
                        "enum": ["OUTGOING","INCOMING","MUTUAL"],
                        "required" : true
                    }
                }
            },this.base());
        },

        options: function() {
            var self = this;
            var options = _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter association title."
                    },
                    "description" : {
                        "helper" : "Enter association description."
                    },
                    "target" : {
                        "type" : "text",
                        "size" : "60",
                        "fieldClass" : "target-node-id",
                        "helper" : "Enter target node id or select it from the node list."
                    }/*,
                    "_type" : {
                        "type": "select",
                        "helper" : "Pick association type."
                    }*/,
                    "direction" : {
                        "type": "select",
                        "helper" : "Pick association direction."
                    }
                }
            });

            options['fields']['target']['validator'] = function(control, callback) {
                var controlVal = control.getValue();
                self.branch().trap(function(error) {
                    if (error.status && error.status == '404') {
                        callback({
                            "message": "Invalid node id",
                            "status": false
                        });
                    }
                }).readNode(controlVal).then(function() {
                    callback({
                        "message": "Valid node id",
                        "status": true
                    });
                });
            };

                options['fields']['target']['postRender'] = function(targetField) {
                    $('<button class="gitana-picker-button">Select Node...</button>').button({
                        icons: {
                            primary:'ui-icon-document'
                        }
                    }).click(function() {
                        $(".ui-dialog").remove();
                        $('div.gitana-picker').show().dialog({
                            title : "<div><img src='" + Gitana.Utils.Image.buildImageUri('objects', 'node', 20) + "'/>Cloud CMS Node Picker</div>",
                            resizable: true,
                            width: 900,
                            height: 600,
                            modal: true
                        }).height('auto');
                    }).insertAfter($('input:text',targetField.outerEl));
                };

            /*options['fields']['_type']['dataSource'] = function(field, callback) {
                
                var firstOption;
                self.branch().listDefinitions('association').each(function(key,val,index) {
                    field.selectOptions.push({
                        "value": this.get('_qname'),
                        "text": this.get('_qname')
                    });
                    if (index == 0) {
                        firstOption = this.get('_qname');
                    }
                }).then(function() {
                    if (callback) {
                        callback();
                        field.field.val(firstOption).change();
                    }
                });
            };*/

            return options;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/add/association", this.index);
        },

        targetObject: function() {
            return this.branch();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Node(this,"menu-associations"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Associations(this), [
                {
                    "text" : "New Association"
                }
            ]));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);
        },

        setupAssociationTypeForm : function (el, callback) {
            var self = this;

            $('body').undelegate('.type-picker select', 'change').delegate('.type-picker select', 'change', function() {
                var typeQName = $(this).val();
                if (typeQName) {
                    Chain(self.branch()).readDefinition(typeQName).then(function() {
                        var selectedType = this;
                        self.definition(selectedType);
                        self.clearForm();
                        $('.form-picker select').empty().append($("<option></option>")
                                .attr("value", "")
                                .text("None"));
                        var formIds = [];
                        var formLookup = {};
                        var formReverseLookup = {};

                        this.listFormAssociations().each(function() {
                            var formKey = this.getFormKey();
                            var formId = this.getTargetNodeId();
                            formIds.push(formId);
                            formLookup[formId] = {
                                "key" : formKey
                            };
                            formReverseLookup[formKey] = formId;
                        }).then(function() {
                            this.subchain(self.branch()).queryNodes({
                                "_doc" : {
                                    "$in" : formIds
                                }
                            }).each(function() {
                                var formNode = this;
                                formLookup[this.getId()]['title'] = this.getTitle() ?  this.getTitle() : formLookup[this.getId()]['key'];
                            });

                            this.then(function() {
                                this.each(function() {
                                    var formKey = this.getFormKey();
                                    var formId = this.getTargetNodeId();
                                    $('.form-picker select').append($("<option></option>")
                                        .attr("value", formKey)
                                        .text(formLookup[formReverseLookup[formKey]]['title']));
                                }).then(function() {

                                    if ($('.form-picker .ui-multiselect').length > 0) {
                                        $('.form-picker select').multiselect("refresh");
                                    } else {
                                        $('.form-picker select').multiselect({
                                            minWidth: '300',
                                            multiple: false,
                                            selectedList: 1,
                                            header: "Select Form"
                                        }).multiselectfilter();
                                    }

                                    $('body').trigger('swap',[this]);
                                });
                            });
                        });
                    });
                }
            });

            $('body').undelegate('.form-picker select', 'change').delegate('.form-picker select', 'change', function() {
                var formKey = $(this).val();
                if (formKey) {
                    Chain(self.definition()).readForm(formKey).then(function() {
                        self.form(this);
                    });
                } else {
                    self.clearForm();
                }
            });

            $('#form-pick', $(el)).alpaca({
                "schema": {
                    "type" : "object",
                    "properties" : {
                        "_type" : {
                            "title": "Association Type",
                            "type" : "string",
                            "default" : "n:node",
                            "required" : true
                        },
                        "_form" : {
                            "title": "Form",
                            "type" : "string"
                        }
                    }
                },
                "options": {
                    "fields" : {
                        "_type" : {
                            "type": "select",
                            "fieldClass" : "type-picker",
                            "dataSource" : function(field, callback) {
                                var firstOption;
                                self.branch().listDefinitions('association', {
                                    "limit": Gitana.Console.LIMIT_NONE
                                }).each(
                                    function(key, val, index) {
                                        var value = this.getQName();
                                        var text = value;
                                        if (this.getTitle()) {
                                            text += " - " + this.getTitle();
                                        }
                                        field.selectOptions.push({
                                            "value": value,
                                            "text": text
                                        });
                                        if (index == 0) {
                                            firstOption = this.getQName();
                                        }
                                    }).then(function() {
                                        if (callback) {
                                            callback();
                                            field.field.val(firstOption).change();
                                        }

                                        field.field.multiselect({
                                            minWidth: '300',
                                            multiple: false,
                                            selectedList: 1,
                                            header: "Select Association Type"
                                        }).multiselectfilter();
                                    });
                            }
                        },
                        "_form" : {
                            "type": "select",
                            "fieldClass" : "form-picker"
                        }
                    }
                },
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form);

                    callback();

                }
            });
        },

        setupAssociationAddForm : function (el, callback) {
            var self = this;

            var schema = self.schema();

            if (self.definition() && self.definition().object.properties) {
                schema = _mergeObject(schema, {
                    "properties" : self.definition().properties
                });
            }

            var options = self.options();

            if (self.form()) {
                options = _mergeObject(options, self.form());
            }

            $('#association-add',$(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "schema": schema,
                "options": options,
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'association-add-create', true);

                    // Add Buttons
                    $('#association-add-create',$(el)).click(function(){

                        var formVal = form.getValue();

                        formVal['_type'] = $('.type-picker select').val();

                        if ($('.form-picker select').val()) {
                           formVal[Gitana.CMS.NodeFormKey] = $('.form-picker select').val();
                        }

                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Association...");

                            var targetNodeId = formVal['target'];
                            var direction = formVal['direction'];
                            delete formVal['target'];
                            delete formVal['direction'];

                            var undirected = direction == "MUTUAL" ? true: false;

                            if (direction != "INCOMING") {
                                self.node().associate(targetNodeId,formVal,undirected).then(function() {
                                    var link = self.LINK().call(self,this);
                                    var callback = function() {
                                        self.app().run("GET", link);
                                    };
                                    Gitana.Utils.UI.unblock(callback);
                                });
                            } else {
                                self.branch().readNode(targetNodeId).associate(self.node(),formVal).then(function() {
                                    var link = self.LINK().call(self, self.node());
                                    var callback = function() {
                                        self.app().run("GET", link);
                                    };
                                    Gitana.Utils.UI.unblock(callback);
                                });
                            }
                        }
                    });

                    callback();
                }
            });
        },

        setupForms : function (el, callback)
        {
            var self = this;

            self.setupAssociationTypeForm(el, function() {
                self.setupAssociationAddForm(el, function() {
                    self.subscribe('form', function() {
                        self.setupAssociationAddForm(el);
                    });

                    callback();
                });
            });
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return Alpaca.merge(this.base(),{
                "type" : [""]
            });
        },

        filterFormToJSON: function (formData,renderedField) {
            var query = this.base();
            var allOptions = function() {
                var typeControl = renderedField.getControlByPath('type');
                var typeQNames = [];
                $.each(typeControl.selectOptions, function() {
                    typeQNames.push(this['value']);
                });
                query['_type'] = {
                    "$in" : typeQNames
                };
            };
            if (! Alpaca.isValEmpty(formData)) {
                var json_query = _safeParse(formData.query);
                if (Alpaca.isValEmpty(json_query)) {
                    query['_doc'] = {
                        "$ne" : this.node().getId()
                    };
                    if (formData['type']) {
                        if (formData['type'].length ==  1 && formData['type'][0] == "") {
                            // no type selected then all types
                            var typeControl = renderedField.getControlByPath('type');
                            var typeQNames = [];
                            $.each(typeControl.selectOptions, function() {
                                typeQNames.push(this['value']);
                            });
                            query['_type'] = {
                                "$in" : typeQNames
                            };
                        } else {
                            query['_type'] = {
                                "$in" : formData['type']
                            };
                        }
                    } else {
                       allOptions();
                    }
                }
            } else {
                allOptions();
            }
            return query;
        },

        filterSchema: function () {
            return _mergeObject(this.base(), {
                "properties" : {
                    "type" : {
                        "title": "Type",
                        "type" : "string"
                    }
                }
            });
        },

        filterOptions: function() {

            var self = this;

            var options = _mergeObject(this.base(), {
                "helper" : "Query nodes by id, title, description, date range, type or full query.",
                "fields" : {
                    "type" : {
                        "type" : "select",
                        "multiple": true,
                        "helper": "Select one or multiple types."
                    }
                }
            });

            options['fields']['type']['dataSource'] = function(field, callback) {
                self.branch().listDefinitions('type', {
                    "limit": Gitana.Console.LIMIT_NONE
                }).each(function(key, definition, index) {
                    field.selectOptions.push({
                        "value": definition.getQName(),
                        "text": definition.getQName()
                    });
                 }).then(function() {
                    if (callback) {
                        callback();
                    }
                });
            };

            options['fields']['type']['postRender'] = function(renderedField) {
                var el = renderedField.getEl();
                $('select',$(el)).css({
                    "width" : "370px"
                }).multiselect().multiselectfilter();
                var val = renderedField.getValue();
                // Make sure we don't check the None checkbox
                if (!Alpaca.isValEmpty(val) && val.length == 1 && val[0] == "") {
                    $('select',$(el)).multiselect("uncheckAll");
                }
            };

            return options;
        },

        filterView: function() {
            return _mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "type" : "column-1"
                    }
                }
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list.hideCheckbox = true;

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = "<a href='" + self.link(this) + "'>" + self.friendlyTitle(this) + "</a><br/>" + this.getId();
                        callback(title);
                    }
                },
                {
                    "title": "Type",
                    "type":"property",
                    "sortingExpression": "_type",
                    "property": function(callback) {
                        var type = this.get('_type') ? this.get('_type') : "";
                        callback(type);
                    }
                },
                {
                    "title": "Last Modified",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                },
                {
                    "title": "Action",
                    "property": function(callback) {
                        var nodeId = this.getId();
                        var value = "<a class='node-action node-select' data-targetnodeid='" + nodeId + "'><span>Select</span></a>";
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {

                var query = self.query();

                if (Alpaca.isValEmpty(query)) {

                    if (self.defaultQuery) {

                        self.branch().trap(function(error) {
                            return self.handlePageError(el, error);
                        }).queryNodes(self.defaultQuery, self.pagination(pagination)).then(function() {
                            callback.call(this);
                        });

                    } else {
                        self.defaultQuery = {
                            "_type" : {
                                "$in" : []
                            },
                            "_doc" : {
                                "$ne" : this.node().getId()
                            }
                        };
                        self.branch().trap(function(error) {
                            return self.handlePageError(el, error);
                        }).listDefinitions('type', {
                            "limit": Gitana.Console.LIMIT_NONE
                        }).each(function(key, definition, index) {

                            self.defaultQuery["_type"]["$in"].push(definition.getQName());

                        }).then(function() {

                            self.branch().queryNodes(self.defaultQuery, self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });

                        });
                    }
                } else {
                    self.branch().trap(function(error) {
                        return self.handlePageError(el, error);
                    }).queryNodes(query, self.pagination(pagination)).then(function() {
                        callback.call(this);
                    });
                }
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        processList: function(el) {
            var self = this;
            $("body").undelegate(".node-select", "click").delegate(".node-select", "click", function() {
                $('.ui-icon-closethick').click();
                var control = $(this);
                $('.target-node-id input:text').val(control.attr('data-targetnodeid')).focus();
            })
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Association",
                "description" : "Create a new association for node " + this.friendlyTitle(this.node()) + ".",
                "listTitle" : "Node List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'node', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "forms" :[
                    {
                        "id" : "form-pick",
                        "title" : "Select Association Type and Form",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 24)
                    },
                    {
                        "id" : "association-add",
                        "title" : "Create A New Association",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'association-add', 24),
                        "buttons" :[
                            {
                                "id" : "association-add-create",
                                "title" : "Create Association",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AssociationAdd);

})(jQuery);