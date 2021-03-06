(function($) {
    Gitana.CMS.Pages.AbstractNodeEditFormPageGadget = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        setupNodeTypeForm : function (el, callback) {
            var self = this;
            var currentFormKey = self.targetObject().get(Gitana.CMS.NodeFormKey);
            $('.form-picker select').empty().append($("<option></option>")
                .attr("value", "")
                .text("None"));
            Chain(self.definition()).listFormAssociations().each(function() {
                var formKey = this.getFormKey();
                var selected = currentFormKey && currentFormKey == formKey ? " selected" : "";
                $('.form-picker select').append($("<option" + selected + "></option>")
                    .attr("value", formKey)
                    .text(formKey));
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
                        "_form" : {
                            "title": "Form",
                            "type" : "string"
                        }
                    }
                },
                "options": {
                    "fields" : {
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

        setupEditPage: function(el, page) {
            if (this.isEditJSONUri(el)) {
                page['forms'].push({
                    "id" : "json-edit",
                    "title" : "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 24),
                    "buttons" :[
                        {
                            "id" : "json-edit-save",
                            "title" : "Save JSON",
                            "isLeft" : true
                        }
                    ]
                });
            } else {
                page['forms'].push({
                    "id" : "form-pick",
                    "title" : "Select Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form', 24)
                });
                page['forms'].push(this.editPageConfig());
            }
        },

        setupForms: function (el, callback)
        {
            var self = this;

            if (this.isEditJSONUri(el))
            {
                // this is handled in processForms after the swap
                callback();
            }
            else
            {
                this.setupNodeTypeForm(el, function() {

                    this.subscribe('form', function() {
                        self.setupEditForm(el);
                    });

                    this.setupEditForm(el, function() {
                        callback();
                    });
                });
            }
        },

        index: function(el, callback)
        {
            var self = this;

            this.tokens = el.tokens;

            // load context
            self.loadContext(el, function() {

                var typeQName = self.targetObject().getTypeQName();
                var currentFormKey = self.targetObject().get(Gitana.CMS.NodeFormKey);
                Chain(self.branch()).readDefinition(typeQName).then(function() {
                    var selectedType = this;
                    self.definition(selectedType);
                    self.clearForm();
                    if (currentFormKey) {
                        this.readForm(currentFormKey).then(function() {
                            self.form(this);
                        });
                    }
                    this.then(function() {
                        // check authorities
                        self.checkAuthorities(function(isEntitled, error) {
                            if (isEntitled) {
                                // set up menu
                                self.setupMenu();

                                // set up breadcrumb
                                self.setupBreadcrumb(el);

                                // set up toolbar
                                // self.setupToolbar(el);

                                // set up the page
                                self.setupPage(el);

                                // detect changes to the list and redraw when they occur
                                self.setupRefreshSubscription(el);

                                // list model
                                var page = self.model(el);

                                // render layout
                                self.renderTemplate(el, self.TEMPLATE, function(el) {

                                    Gitana.Utils.UI.contentBox($(el));

                                    Gitana.Utils.UI.jQueryUIDatePickerPatch();

                                    self.setupForms(el, function() {

                                        el.swap(function(swappedEl) {

                                            Gitana.Utils.UI.enableTooltip();

                                            Gitana.Utils.UI.processBreadcrumb();

                                            self.processForms(el, swappedEl, function() {

                                                if (callback)
                                                {
                                                    callback();
                                                }

                                            });

                                        });
                                    });
                                });
                            } else {
                                self.handleUnauthorizedPageAccess(el, error);
                            }
                        });
                    })
                });

            });
        }
    });

})(jQuery);