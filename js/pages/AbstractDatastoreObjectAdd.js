(function($) {
    Gitana.CMS.Pages.AbstractDatastoreObjectAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        buildPage : function(type, name)
        {
            return {
                "title" : "New " + name,
                "description" : "Create a new " + name,
                "forms" :[
                    {
                        "id" : type + "-add",
                        "title" : "Create A New " + name,
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', type + '-add', 24),
                        "buttons" :[
                            {
                                "id" : type + "-add-create",
                                "title" : "Create a " + name,
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };
        }

    });

})(jQuery);