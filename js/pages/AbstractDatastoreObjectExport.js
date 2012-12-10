(function($) {
    Gitana.CMS.Pages.AbstractDatastoreObjectExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        buildPage: function(type, name)
        {
            var self = this;

            return {
                "title" : "Export " + name,
                "description" : "Export " + name + " " + self.friendlyTitle(self.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export " + name,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export " + name,
                            "isLeft" : true
                        }
                    ]
                }]
            };
        }

    });

})(jQuery);