(function($) {
    Gitana.Utils.UI = {
        /**
         * Used to launch a modal blocking dialog with message.
         *
         * @param message
         */
        block: function(message) {
            $.blockUI({
                css: {
                    'background': 'url("' + "css/images/themes/" + Gitana.Apps.THEME + '/console/misc/shine-effect.png") repeat-x scroll 0 0 rgba(33, 40, 44, 0.7)',
                    'border': '1px solid #25333C',
                    'border-radius': '5px 5px 5px 5px',
                    'box-shadow': '0 0 5px rgba(0, 0, 0, 0.5)',
                    'padding': '8px'
                },
                message: '<div class="block-content"><br/><h2>' + message + '</h2><br/><br/><img src="' + "css/images/themes/" + Gitana.Apps.THEME + '/console/misc/ajax-loader.gif" /><br/><br/><br/></div>'
            });
        },

        /**
         * Closes the modal blocking dialog
         */
        unblock: function(callback) {
            if (callback) {
                $.unblockUI({
                    "onUnblock" : callback
                });
            } else {
                $.unblockUI();
            }
        },

        /**
         * Fixes jQuery UI data picker issue with DOM swapping by ratchet.
         */
        jQueryUIDatePickerPatch: function() {
            $('body').bind('swap', function(event, param) {
                $('.hasDatepicker').removeClass('hasDatepicker').datepicker();
                $.datepicker.initialized = false;
            });
        },

        /**
         * Provides cross-browser unified view of form controls.
         * @param el
         */
        uniform : function(el) {
            if (el.uniform && $('.alpaca-controlfield-file',el).length == 0) {
                // remove select
                $("input:checkbox, input:text, input:password, input:radio, input:file, textarea", el).uniform();
            }
        },

        /**
         * Generates box-style chrome for default theme.
         * @param el
         */
        contentBox : function(el) {
            $("body").undelegate(".block-border .block-header span", "click").delegate(".block-border .block-header span", "click", function() {
                if ($(this).hasClass('closed')) {
                    $(this).removeClass('closed');
                } else {
                    $(this).addClass('closed');
                }

                $(this).parent().parent().children('.block-content').slideToggle();
            });
        },

        /**
         * Generates auto-resize breadcrumb using xBreadcrumbs library.
         * @param el
         */
        processBreadcrumb: function(el) {
            $('body').bind('swap', function(event, param) {
                if ($('#breadcrumbs').length > 0) {
                    $("#breadcrumbs li:last-child").addClass("last-breadcrumb-item");
                    $('#breadcrumbs').xBreadcrumbs({
                    });
                }
            });
        },

        /**
         * Automate form with focus on the first field and process enter key.
         * @param form
         */
        autoForm: function(form, buttonId) {
            if (form.children && form.children[0] && form.children[0].field) {
                var fieldId = $(form.children[0].field).attr('id');
                $('body').bind('swap', function(event, param) {
                    $('#' + fieldId).focus();
                });
                /*
                $.each(form.children,function(i,child) {
                   child.field.keypress(function(e) {
                        if (e.which == 13) {
                            if (buttonId) {
                                $('#' + buttonId).click();
                            }
                        }
                    });
                });
                */
            }
        },

        /**
         * Beautifies alpaca form.
         *
         * @param form
         * @param auto
         */
        beautifyAlpacaForm: function(form, buttonId, auto) {
            Gitana.Utils.UI.uniform(form.getEl());
            form.getEl().css('border', 'none');
            if (auto) {
                Gitana.Utils.UI.autoForm(form,buttonId);
            }
        },

        /**
         * Beautifies alpaca form with ASM Select.
         *
         * @param form
         */
        beautifyAlpacaFormWithASMSelect: function(form, buttonId, auto) {
            var el = form.getEl();
            if (el.uniform && $('.alpaca-controlfield-file',el).length == 0) {
                $("input:checkbox, input:text, input:password, input:radio, input:file, textarea", el).uniform();
            }
            form.getEl().css('border', 'none');
            if (auto) {
                Gitana.Utils.UI.autoForm(form,buttonId);
            }
        },

        /**
         * Enable tooltip.
         *
         */
        enableTooltip: function() {
            $('.tipsy').remove();
            $('a[rel=tooltip-html]').tipsy({
                fade: true,
                html: true,
                live: true
            });
            $('div[rel=tooltip-html]').tipsy({
                fade: true,
                html: true,
                live: true
            });
            $('input[rel=tooltip-html]').tipsy({
                fade: true,
                html: true,
                live: true
            });
        },

        modalSelector: function(config) {

            if (!config) {
                config = {};
            }

            html = "<div class='modal-selector'>";
            html += "<table class='modal-selector-table' cellpadding='1'>";

            if (config.items) {
                for (var i = 0; i < config.items.length; i++) {
                    var item = config.items[i];

                    var title = item.title ? item.title : "Unknown title";
                    var description = item.description ? item.description : "Unknown description";

                    html += "<tr class='modal-selector-table-row'>";

                    // icon
                    if (item.iconUrl) {
                        html += "<td class='modal-selector-table-column-icon' style='padding:10px;'><img src='" + item.iconUrl + "'></td>";
                    } else if (item.iconClass) {
                        html += "<td class='sprite-48 sprite-48-button " + item.iconClass + " modal-selector-table-column-icon'></td>";
                    } else {
                        html += "<td class='modal-selector-table-column-icon'></td>";
                    }

                    // selection text
                    html += "<td class='modal-selector-table-column-text model-selector-item-" + i + "' width='100%'><h3>";
                    html += title;
                    html += "</h3><p>" + description + "</p></td>";

                    html += "</tr>";
                }
            }

            html += "</table>";
            html += "</div>";
            html += "</div>";

            config.body = $(html);

            var dialog = Gitana.Utils.UI.modalOpen(config);

            if (config.items) {
                for (var i = 0; i < config.items.length; i++) {
                    var item = config.items[i];

                    $(dialog).find(".model-selector-item-" + i).click(function(dialog, link, click) {
                        return function() {
                            $(dialog).dialog('close');
                            $(dialog).bind("dialogclose", function() {

                                if (link) {
                                    window.location.href = link;
                                }
                                if (click) {
                                    click();
                                }
                            });
                        };
                    }(dialog, item.link, item.click));
                }
            }
        },

        modalOpen: function(config) {

            if (!config) {
                config = {};
            }

            var title = config.title ? config.title : "Unknown modal title";

            var dialog = $("<div title='" + title + "'></div");
            if (config.body) {
                $(dialog).append(config.body);
            }

            var width = config.width ? config.width : 500;

            var closeFunction = config.close ? config.close : function(event, ui) {
                $(this).dialog('destroy').remove();
            };

            // show the dialog
            var dialogConfig = {
                autoOpen:false,
                resizable: false,
                width: width,
                modal: true,
                closeOnEscape: true,
                center: true,
                position: 'middle',
                show: 'fade',
                hide: 'fade',
                close: function(event, ui) {
                    closeFunction.call(this, event, ui);
                }
            };
            if (config.buttons)
            {
                dialogConfig.buttons = config.buttons;
            }

            dialog.dialog(dialogConfig).height('auto');

            // open dialog
            dialog.dialog("open");

            return dialog;
        }
    }
})(jQuery);