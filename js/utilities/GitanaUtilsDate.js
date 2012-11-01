(function($) {
    Gitana.Utils.Date = {

        dateToStr : function(date) {
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        },

        strToDate : function(str) {
            var items = str.split("/");
            return new Date(items[2], items[0] - 1, items[1]);
        },

        strToMs : function(str) {
            var val = 0;
            if (!Alpaca.isValEmpty(str)) {
                var items = str.split(":");
                var seconds = parseInt(items[0]) * 3600 + parseInt(items[1]) * 60 + parseInt(items[2]);
                val = seconds * 1000;
            }
            return val;
        }
    }
})(jQuery);