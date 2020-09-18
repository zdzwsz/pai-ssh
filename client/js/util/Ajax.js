$.extend(
    {
        req: function (option) {

            if (option.url == "") return;
            option.data = option.data || {};
            $.ajax({
                'type': "POST",
                'url': option.url,
                'dataType': "json",
                'data': option.data,
                'success': function (msg) {
                    if (option.success && typeof (option.success) == "function") {
                        option.success(msg);
                    }
                },
                error: function (err) {
                    if (option.error && typeof (option.error) == "function") {
                        option.error(err);
                    }
                }
            });
        }
    }
);