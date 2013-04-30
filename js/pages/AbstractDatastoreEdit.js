(function($) {
    Gitana.CMS.Pages.AbstractDatastoreEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        buildButtonConfig: function(type, name)
        {
            return {
                "id": "edit",
                "title": "Edit " + name,
                "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        buildPageConfig: function(type, name)
        {
            return {
                "id" : type + "-edit",
                "title" : "Edit " + name,
                "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-edit', 24),
                "buttons" :[
                    {
                        "id" : type + "-edit-save",
                        "title" : "Save " + name,
                        "isLeft" : true
                    }
                ]
            };
        },

        buildPage: function(el, type, name)
        {
            var page = {
                "title" : "Edit " + name,
                "description" : "Edit " + name + " " + this.friendlyTitle(this.targetObject()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page, this.base(el)));
        }

    });

})(jQuery);