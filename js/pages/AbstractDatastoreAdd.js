(function($) {
    Gitana.CMS.Pages.AbstractDatastoreAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        buildPage: function(el, type, name)
        {
            var page = {
                "title" : "New " + name,
                "description" : "Create a new " + name + ".",
                "forms" :[{
                    "id" : type + "-add",
                    "title" : "Create A New " + name,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-add', 24),
                    "buttons" :[
                        {
                            "id" : type + "-add-create",
                            "title" : "Create " + name,
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

})(jQuery);