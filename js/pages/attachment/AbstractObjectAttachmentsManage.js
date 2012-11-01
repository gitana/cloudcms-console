(function($) {
    Gitana.Console.Pages.AbstractObjectAttachmentsManage = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        setupAttachmentAddForm : function (el) {
            var self = this;
            $('#add-attachments',$(el)).alpaca({
                "schema" : {
                    "type" : "object",
                    "properties" : {
                        "file": {
                            "type": "string",
                            "format": "uri"
                        }
                    }
                },
                "options" : {
                    "fields": {
                        "file": {
                            "type": "attachment",
                            "name": "attachment",
                            "helper": "Select file(s) and upload them as attachment(s).",
                            "context": self.targetObject(),
                            "renderAttachments" : function() {
                                self.observable(self.FILTER).set(self.observable(self.FILTER).get());
                            }
                        }
                    }
                },
                "postRender": function (renderedField) {
                    Gitana.Utils.UI.beautifyAlpacaForm(renderedField);
                    var el = renderedField.outerEl;
                    $(".fileupload-content",$(el)).css({
                        "min-width" : "600px",
                        "min-height" : "200px",
                        "display" : "block"
                    });
                    $(".files",$(el)).css({
                        "width" : "100%"
                    });
                }
            });
        },


        setupForms : function (el) {
            this.setupAttachmentAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "forms" :[{
                    "id" : "add-attachments",
                    "title" : "Attachment Manager",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 24),
                    "buttons" :[
                    ]
                }]
            };

            return Alpaca.mergeObject(page,this.base(el));
        }
    });

})(jQuery);