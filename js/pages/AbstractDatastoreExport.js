(function($) {
    Gitana.CMS.Pages.AbstractDatastoreExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        buildPage : function(el, name) {

            var page = {
                "title" : "Export " + name,
                "description" : "Export " + name + " " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export " + name,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[{
                        "id" : "export-create",
                        "title" : "Export " + name,
                        "isLeft" : true
                    }]
                }]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

})(jQuery);