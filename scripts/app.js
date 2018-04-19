(function () {
    'use strict';

    let totalLength = 0;
    let photo = null;

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

    //affichage de la miniature sur sélection de la photo
    $('#photo').change(function (e) {
        let f = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                let span = document.createElement('span');
                photo = e.target.result;
                span.innerHTML = '<img class="img-fluid" src="' + photo + '">';

                //suppression de la dernière image si elle existe
                if ($('.img-fluid').length)
                {
                    $('.img-fluid').remove();
                }

                document.getElementById('thumb').appendChild(span);
            }
        })(f);
        reader.readAsDataURL(f);
    });

    $('#submit').click(function (e) {
        e.preventDefault();
        let shop = $('#shop').val();
        let name = $('#name').val();
        let message = $('#message').val();

        let doc = new jsPDF();

        doc.text(name, 10, 10);
        doc.text(message, 10, 40);
        if (photo != null) {
            doc.addImage(photo, 'JPEG', 10, 60, 50, 50);
        }

        doc.save('CR.pdf');

    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            });
    }
})();
