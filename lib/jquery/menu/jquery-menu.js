(function($) {
    /*
     * Accordion Menu
     */

    $.fn.initMenu = function() {
        return this.each(function() {
            var theMenu = $(this).get(0);

            $('li:has(ul)', this).each(function() {
                $('>a', this).append("<span class='arrow'></span>");
            });

            $('.sub', this).show();
            $('li.expand > .sub', this).show();
            $('li.expand > .sub', this).prev().addClass('active');
            $('li a', this).click(
                    function(e) {
                        e.stopImmediatePropagation();
                        var theElement = $(this).next();
                        var parent = this.parentNode.parentNode;
                        if ($(this).hasClass('active-icon')) {
                            $(this).addClass('non-active-icon');
                            $(this).removeClass('active-icon');
                        } else {
                            $(this).addClass('active-icon');
                            $(this).removeClass('non-active-icon');
                        }
                        if ($(parent).hasClass('noaccordion')) {
                            if (theElement[0] === undefined) {
                                window.location.href = this.href;
                            }
                            $(theElement).slideToggle('normal', function() {
                                if ($(this).is(':visible')) {
                                    $(this).prev().addClass('active');
                                }
                                else {
                                    $(this).prev().removeClass('active');
                                    $(this).prev().removeClass('active-icon');
                                }
                            });
                            return false;
                        }
                        else {
                            if (theElement.hasClass('sub') && theElement.is(':visible')) {
                                if ($(parent).hasClass('collapsible')) {
                                    $('.sub:visible', parent).first().slideUp('normal',
                                            function() {
                                                $(this).prev().removeClass('active');
                                                $(this).prev().removeClass('active-icon');
                                            }
                                            );
                                    return false;
                                }
                                return false;
                            }
                            if (theElement.hasClass('sub') && !theElement.is(':visible')) {
                                $('.sub:visible', parent).first().slideUp('normal', function() {
                                    $(this).prev().removeClass('active');
                                    $(this).prev().removeClass('active-icon');
                                });
                                theElement.slideDown('normal', function() {
                                    $(this).prev().addClass('active');
                                });
                                return false;
                            }
                        }
                    }
                    );
        });
    };

    /*
     * Sliding Entrys
     */
    $.fn.slideList = function(options) {
        return $(this).each(function() {
            var padding_left = $(this).css("padding-left");
            var padding_right = $(this).css("padding-right");

            $(this).hover(
                    function() {
                        // This is to make IE not complain about negative paddingRight value.
                        var paddingRight = (parseInt(padding_right) - parseInt(5) > 0) ? parseInt(padding_right) - parseInt(5) : 0;
                        $(this).animate({
                            paddingLeft:parseInt(padding_left) + parseInt(5) + "px",
                            paddingRight: paddingRight + "px"
                        }, 130);
                    },
                    function() {
                        bc_hover = $(this).css("background-color");
                        $(this).animate({
                            paddingLeft: padding_left,
                            paddingRight: padding_right
                        }, 130);
                    }
                    );
        });
    };
})(jQuery);