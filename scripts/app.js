(function () {
    'use strict';

    let totalLength = 0;

    $('#name').keyup(function (e) {
       totalLength = $(this).val().length + $('#message').val().length;
       if (totalLength > 200) {
           let name = $(this).val();
           let length = 200 - $('#message').val().length;
           name = name.substr(0, length);
           totalLength = totalLength - 1;
           $(this).val(name);
       }
        let counterMessage = totalLength + ' caractère(s) / 200';
        $('#counter').text(counterMessage);
    });

    $('#message').keyup(function (e) {
        totalLength = $('#name').val().length + $(this).val().length;;
        if (totalLength > 200) {
            let message = $(this).val();
            let length = 200 - $('#name').val().length;
            message = message.substr(0, length);
            totalLength = totalLength - 1;
            $(this).val(message);
        }
        let counterMessage = totalLength + ' caractère(s) / 200';
        $('#counter').text(counterMessage);
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            });
    }
})();
