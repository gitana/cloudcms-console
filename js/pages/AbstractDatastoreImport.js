(function($) {
    Gitana.CMS.Pages.AbstractDatastoreImport = Gitana.Console.Pages.AbstractImport.extend(
        {
            setupToolbar: function()
            {
                var self = this;
                self.base();
                self.addButtons([
                ]);
            },

            buildPage : function(el, name)
            {
                var page = {
                    "title" : name + " Import",
                    "description" : "Import an archive to " + name + " " + this.friendlyTitle(this.targetObject()) + ".",
                    "listTitle" : "Archive List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'archive', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER,
                    "forms" :[
                        {
                            "id" : "import",
                            "title" : "Import Archive",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 24),
                            "buttons" :[
                                {
                                    "id" : "import-create",
                                    "title" : "Import Archive",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            }

        });

})(jQuery);