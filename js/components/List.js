(function($) {
    Gitana.CMS.Components.List = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/list",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        selectedItems: function() {
            return this._observable("selectedItems", arguments,{});
        },

        clearSelectedItems: function() {
            this.observable("selectedItems").clear();
        },

        itemsCount : function(obj) {

            if (!obj) {
                return 0;
            }

            var count = 0, key;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count++;
                }
            }
            return count;
        },

        firstItem : function(obj) {

            if (!obj) {
                return null;
            }

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    return obj[key];
                }
            }
        },

        onSelectedItems: function() {
            var self = this;
            var toolbarName = self.subscription == 'list' ? 'toolbar' : self.subscription + "-toolbar";
            var toolbar = self._observable(toolbarName,[]);
            if (toolbar && toolbar.items) {
                var displayedItemCounter = 0;
                $.each(toolbar.items, function(key, item) {

                    item["visibility"] = item.requiredAuthorities ? false : true;

                    if (item.requiredAuthorities) {
                        var selectedItemsRequiredAuthorities = [];
                        $.each(self.selectedItems(),function(i,v) {
                            if ($.isArray(item.requiredAuthorities)) {
                                $.each(item.requiredAuthorities,function() {
                                    var permissioned = this['permissioned'] ? this['permissioned'] : v;
                                    if ($.isFunction(permissioned)) {
                                       permissioned = permissioned(v);
                                    }
                                    selectedItemsRequiredAuthorities.push({
                                        "permissioned" : permissioned,
                                        "permissions" : this['permissions']
                                    });
                                })
                            } else {
                                var permissioned = item.requiredAuthorities['permissioned'] ? item.requiredAuthorities['permissioned'] : v;
                                if ($.isFunction(permissioned)) {
                                    permissioned = permissioned(v);
                                }
                                selectedItemsRequiredAuthorities.push({
                                    "permissioned" : item.requiredAuthorities['permissioned'] ? item.requiredAuthorities['permissioned'] : v,
                                    "permissions" : item.requiredAuthorities['permissions']
                                });
                            }
                        });
                        self.checkAuthorities(function(isEntitled) {
                            if (isEntitled) {
                                if (item.selection && item.selection == 'single') {
                                    if (self.itemsCount(self.selectedItems()) == 1) {
                                        $('#toolbar-item-' + key).show();
                                        displayedItemCounter ++;
                                    }
                                }
                                if (item.selection && item.selection == 'multiple') {
                                    if (self.itemsCount(self.selectedItems()) >= 1) {
                                        $('#toolbar-item-' + key).show();
                                        displayedItemCounter ++;
                                    }
                                }
                            }
                            item["visibility"] = isEntitled;
                        }, selectedItemsRequiredAuthorities);
                    }

                    if (item.selection && item.selection == 'single') {
                        if (self.itemsCount(self.selectedItems()) == 1 && item["visibility"]) {
                            $('#toolbar-item-'+key).show();
                            displayedItemCounter ++;
                        } else {
                            $('#toolbar-item-'+key).hide();
                        }
                    }
                    if (item.selection && item.selection == 'multiple') {
                        if (self.itemsCount(self.selectedItems()) >= 1 && item["visibility"]) {
                            $('#toolbar-item-'+key).show();
                            displayedItemCounter ++;
                        } else {
                            $('#toolbar-item-'+key).hide();
                        }
                    }
                });

                var options = $.browser.msie ? {
                    "left" : "-270px",
                    "width" : "225px",
                    "z-index" : "999",
                    "border" : "1px solid #25333c",
                    "display" : "block",
                    "position" : "absolute"
                } : {
                    "left" : "-280px",
                    "width" : "225px",
                    "z-index" : "999",
                    "border": "1px solid #25333c",
                    "border-radius": "5px 5px 5px 5px",
                    "box-shadow": "0 0 5px rgba(0, 0, 0, 0.5)"
                };

                $('.list-toolbar').css(options).stickySidebar();

                if (displayedItemCounter == 0) {
                    $('.list-toolbar').css({
                        "border": "0px none"
                    });
                }

            }
        },

        processActions: function(list) {
            var self = this;
            if (list.actions) {
                var toolbarName = self.subscription == 'list' ? 'toolbar' : self.subscription + "-toolbar";
                var toolbar = this._observable(toolbarName,[]);
                for (var action in list.actions) {
                    var actionObject = list.actions[action];
                    var actionTitle = actionObject.title;
                    var actionClick = actionObject.click;
                    var actionIcon = actionObject.icon ? actionObject.icon : "";
                    var actionSelection = actionObject.selection ? actionObject.selection : 'single';
                    // CREATE
                    var button = {
                        "id": action,
                        "title": actionTitle,
                        "icon": actionIcon,
                        "selection" : actionSelection,
                        "click": function(actionClick) {
                            return function(event) {
                                if (this.selection == 'single') {
                                    if (self.itemsCount(self.selectedItems()) == 1) {
                                        actionClick.call(self, self.firstItem(self.selectedItems()), self.oTable);
                                    }
                                } else if (this.selection == 'multiple') {
                                    if (self.itemsCount(self.selectedItems()) >= 1) {
                                        actionClick.call(self, self.selectedItems(), self.oTable);
                                    }
                                } else if (this.selection == 'none') {
                                    actionClick.call(self, self.oTable);
                                }
                            };
                        }(actionClick)
                    };
                    if (actionObject.requiredAuthorities) {
                        button.requiredAuthorities = actionObject.requiredAuthorities;
                    }
                    toolbar.items[button.id] = button;
                }
                this.observable(toolbarName).set( toolbar);
            }
        },

        index: function(el) {
            var self = this;

            // detect changes to the list and redraw when they occur
            // this.subscribe(this.subscription, this.refresh);

            if (this.filterSubscription) {
                this.subscribe(this.filterSubscription, this.refresh);
            }

            self.clearSelectedItems();

            // list model
            var list = this.model(el);

            if (list) {
                // render
                self.renderTemplate(el, self.TEMPLATE, function(el) {

                    // a local map of key/value pairs for rendered items that we can reference to recover
                    // the original object (like a repository)
                    // this gets to the map after it is loaded
                    var map = null;

                    // data table
                    var tableConfig = {
                        "bPaginate": true,
                        "bFilter": false,
                        "bSort": true,
                        "bInfo": true,
                        "bAutoWidth": false,
                        "oLanguage": {
                            "sLengthMenu": "Display _MENU_ records per page",
                            "sZeroRecords": "Nothing found - sorry",
                            "sInfo": "Showing _START_ to _END_ of _TOTAL_ records",
                            "sInfoEmpty": "Showing 0 to 0 of 0 records",
                            "sInfoFiltered": "(filtered from _MAX_ total records)",
                            "sSearch": "Filter:"
                        }
                    };
                    tableConfig["bJQueryUI"] = true;
                    tableConfig["sPaginationType"] = "full_numbers";
                    var tableExists = ($(el).find(".display").length > 0);
                    if (tableExists) {
                        tableConfig.bDestroy = tableExists;
                    }

                    tableConfig["bProcessing"] = true;
                    tableConfig["bServerSide"] = true;

                    //tableConfig["sDom"] = "frtiS";
                    //tableConfig["sScrollY"] = "100%";
                    //tableConfig["sScrollX"] = "100%";

                    tableConfig["fnServerData"] = function(sSource, aoData, fnCallback) {

                        // create key value map for facility of looking up DataTables values
                        var keyValues = {};
                        for (var i = 0; i < aoData.length; i++) {
                            keyValues[aoData[i].name] = aoData[i].value;
                        }

                        // build pagination
                        var pagination = {
                            "skip": keyValues["iDisplayStart"],
                            "limit": keyValues["iDisplayLength"]
                        };
                        // apply sort to pagination
                        var sortColIndex = keyValues["iSortCol_0"];
                        if (sortColIndex > 1) {
                            var sortColProperty = list.columns[sortColIndex - 2].property;
                            pagination["sort"] = { };
                            var direction = keyValues["sSortDir_0"] == 'asc' ? 1 : -1;
                            if (Gitana.isString((sortColProperty))) {
                                pagination["sort"][sortColProperty] = direction;
                            }
                            if (Gitana.isFunction(sortColProperty) && list.columns[sortColIndex - 2].sortingExpression) {
                                pagination["sort"][list.columns[sortColIndex - 2].sortingExpression] = direction;
                            }
                        }

                        // build query or keep empty if no search term
                        var query = {};
                        if (keyValues["sSearch"]) {
                            // plug in a query
                            query["$or"] = [];

                            for (var i = 0; i < list.columns.length; i++) {
                                var property = list.columns[i].property;
                                if (Gitana.isFunction(property)) {
                                    property = property.call();
                                }

                                var obj = {};
                                obj[property] = {"$regex": "^" + keyValues["sSearch"] };

                                query["$or"].push(obj);
                            }
                        }

                        // build json that we'll pass into data tables
                        var json = {};
                        json["sEcho"] = keyValues["sEcho"];
                        json["aaData"] = [];

                        // this function gets called for each row to build out "aaData"
                        var rowHandler = function() {
                            //
                            // LINK URI
                            //
                            var linkUri = null;
                            if (list.linkUri) {
                                if (Gitana.isFunction(list.linkUri)) {
                                    uri = list.linkUri.call(this);
                                }
                                else {
                                    uri = list.linkUri;
                                }
                            }
                            else {
                                // DEFAULT - no link
                            }

                            //
                            // build data
                            //
                            var data = {
                                "DT_RowId": this.getId(),
                                "DT_RowClass": "row_" + this.getId()
                            };
                            var counter = 0;

                            // checkbox
                            var readonly = "";
                            if (list.isItemReadonly && list.isItemReadonly(this)) {
                                data["" + counter] = "";
                            } else {
                                data["" + counter] = "<input type='checkbox' class='gitanaselectbox' gitanatargetobjectid='" + this.getId() + "'>";
                            }
                            counter++;

                            // icon
                            if (list.iconUri) {
                                if (Gitana.isFunction(list.iconUri)) {
                                    list.iconUri.call(this, function(value, index) {
                                        var rowIndex = index ? "" + index : "1";
                                        data[rowIndex] = "<img src='" + value + "'>";
                                    });
                                }
                                else {
                                    data["" + counter] = "<img src='" + list.iconUri + "'>";
                                }
                            }
                            else {
                                // DEFAULT - try to guess an image to use
                                //data["" + counter] = "<img src='" + Gitana.CMS.imageUri(this, 48) + "'>";
                                data["" + counter] = "";
                            }
                            counter++;

                            // columns
                            for (var i = 0; i < list.columns.length; i++) {
                                var item = list.columns[i];

                                var type = item.type;
                                if (!type) {
                                    type = "property";
                                }
                                if (type == "property") {
                                    var property = item.property;
                                    if (Gitana.isFunction(property)) {
                                        property.call(this, function(value, index) {
                                            var rowIndex = index ? "" + index : "" + counter;
                                            data[rowIndex] = value;
                                        });
                                        //data["" + counter] = property.call(this);
                                    }
                                    else {
                                        if (property.indexOf(".") > -1) {
                                            // dot-notation
                                            var v = this.object;
                                            var x = -1;
                                            do
                                            {
                                                x = property.indexOf(".");
                                                if (x > -1) {
                                                    var p1 = property.substring(0, x);
                                                    property = property.substring(x + 1);

                                                    v = v[p1];
                                                }
                                            } while (x > -1);

                                            data["" + counter] = v;
                                        }
                                        else {
                                            // simple case (property name)
                                            data["" + counter] = this.get(property);
                                        }
                                    }
                                }
                                if (type == "titledesc") {
                                    var title = this.getTitle() ? this.getTitle() : "";
                                    var description = this.getDescription() ? this.getDescription() : "";

                                    data["" + counter] = "<a href='#" + uri + "'>" + title + "</a><br/>" + description;

                                }
                                if (type == "principaldesc") {
                                    var title = this.getPrincipalId();
                                    var description = this.getDescription() ? this.getDescription() : "";

                                    data["" + counter] = "<a href='#" + uri + "'>" + title + "</a><br/>" + description;
                                }
                                if (type == "qnamedesc") {
                                    var title = this.getQName();
                                    var description = this.getDescription() ? this.getDescription() : "";

                                    data["" + counter] = "<a href='#" + uri + "'>" + title + "</a><br/>" + description;
                                }
                                counter++;
                            }

                            json["aaData"].push(data);
                        };

                        // this function gets called by the custom "loadFunction" to handle the map
                        var loadHandlerCallback = function() {
                            var size = this.totalRows() == null ? 0 : this.totalRows() ;
                            json["iTotalDisplayRecords"] = size;
                            json["iTotalRecords"] = size;

                            // set map
                            map = this;

                            this.each(function() {
                                rowHandler.call(this);
                            }).then(function() {
                                fnCallback(json);
                            });
                        };

                        // invoke function
                        var loadFunction = list["loadFunction"];
                        if (!loadFunction) {
                            alert("Missing load function");
                        }
                        loadFunction.call(self, query, pagination, loadHandlerCallback)
                    };

                    tableConfig["fnRowCallback"] = function(nRow, aData, iDisplayIndex) {

                        // mouse over

                        $(nRow).mouseover(function() {

                            var mapObject = map.get(aData.DT_RowId);
                            //self.selectedItems(mapObject);

                            // clear other selected rows
                            $(".row_selected").removeClass("row_selected");

                            // mark ourselves selected
                            $(this).addClass("row_selected");

                        });

                        // bind the checkbox selections for this row
                        $(nRow).find(".gitanaselectbox").click(function(event) {

                            //self.clearSelectedItems();

                            //$(".gitanaselectbox").each(function() {

                            //    if ($(this).attr("checked"))
                            //    {
                            var targetObjectId = $(this).attr("gitanatargetobjectid");
                            var item = map.get(targetObjectId);
                            var chainedItem = Chain(item);

                            var currentSelectedItems = self.selectedItems();

                            if ($(this).attr("checked")) {
                                currentSelectedItems[targetObjectId] = chainedItem;
                                self.selectedItems(currentSelectedItems);
                            } else {
                                if (currentSelectedItems[targetObjectId]) {
                                    delete currentSelectedItems[targetObjectId];
                                };
                                self.selectedItems(currentSelectedItems);
                            }

                            // Un-select others

                            // $(".gitanaselectbox[gitanatargetobjectid!='" + targetObjectId + "']").attr('checked', false);


                            //    }
                            //});
                            // Enable or disable buttons
                            self.onSelectedItems();
                        });

                        return nRow;
                    };

                    tableConfig["aoColumns"] = [
                        {
                            // CHECKBOX
                            "bVisible": true,
                            "bSearchable": false,
                            "bSortable": false,
                            "sWidth": "10px",
                            "sTitle": "<input type='checkbox' class='table-overall-checkbox'/>"
                        },
                        {
                            // ICON
                            "bVisible": true,
                            "bSearchable": false,
                            "bSortable": false,
                            "sTitle": "Icon"
                        }
                    ];

                    // push for each column
                    for (var i = 0; i < list.columns.length; i++) {
                        var item = list.columns[i];

                        var columnSortable = item.sortingExpression ? true : false;

                        var config = {
                            "bVisible": true,
                            "bSearchable": true,
                            "bSortable": columnSortable
                        };
                        tableConfig["aoColumns"].push(config);
                    }

                    // callback fired when table finishes drawing
                    tableConfig["fnInitComplete"] = function() {
                        // TODO: anything?
                        this.fnAdjustColumnSizing();
                        this.fnDraw();
                        $('.dataTables_scrollBody').css('overflow','hidden');

                        if (list.initCompleteCallback) {
                            list.initCompleteCallback();
                        }
                    };

                    //tableConfig["sDom"] = "T<'clear'>lfrtip";
                    //tableConfig["sDom"] = '<"H"Tfr>t<"F"ip>';

                    if (list.tableConfig) {
                        $.extend(true, tableConfig, list.tableConfig);
                    }

                    if (list.hideCheckbox) {
                        tableConfig["aoColumns"][0]["bVisible"] = false;
                    }

                    if (list.hideIcon) {
                        tableConfig["aoColumns"][1]["bVisible"] = false;
                    }

                    self.oTable = $(el).find("table").dataTable(tableConfig);

                    if (el.uniform) {
                        $("select, input:checkbox, input:text, input:password, input:radio, input:file, textarea",$(el)).uniform();
                    }

                    // select/unselect-all checkbox
                    $('.table-overall-checkbox',$(el)).click(function() {
                        if ($(this).attr("checked")) {
                            $(".gitanaselectbox").each(function() {
                                if (! $(this).attr("checked")) {
                                    $(this).attr("checked",true);
                                }
                            });
                            self.clearSelectedItems();
                            var allItems = {};
                            $.each(map.map,function(key,val) {
                                if( $("input:checkbox[gitanatargetobjectid='" + key +"']").length > 0) {
                                    allItems[key] = Chain(val);
                                }
                            });
                            self.selectedItems(allItems);
                            self.onSelectedItems();
                        } else {
                            $(".gitanaselectbox").each(function() {
                                if ($(this).attr("checked")) {
                                    $(this).attr("checked",false);
                                }
                            });
                            self.clearSelectedItems();
                            self.onSelectedItems();
                        }
                    });

                    // special actions
                    self.processActions(list);

                    el.swap();

                });
            }
        }

    });

    Ratchet.GadgetRegistry.register("list", Gitana.CMS.Components.List);

})(jQuery);