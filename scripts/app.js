(function () {
    'use strict';

    let totalLength = 0;
    let counterMessage = '';
    let photo = null;
    let gpsCities = { // Coordonnées des magasins
        'Orleans' : ['47.9167', '1.9'],
        'Tours' : ['47.3833', '0.6833'],
        'Reims' : ['49.25', '4.0333'],
    };

    $('#location').click(function () {
        let position = $('#position');
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (location) {
                // Coordonnées de l'utilisateur
                let gpsPositions = [location.coords.latitude, location.coords.longitude];
                // Calcul de la distance entre les coordonnées de l'utilisateur et les coordonnées des magasins
                let city = distanceTo(gpsPositions, gpsCities);
                // Affichage du magasin le plus proche dans la liste déroulante
                $('#shop option').each(function () {
                    if ( $(this).val() === city) {
                        $(this).attr('selected', 'selected');
                    }
                });
            });
        } else {
            position.text('Geolocation API not supported.');
        }
    });

    /* Gestion du compteur de caractères */
    document.getElementById('name').onkeyup = function (e) {
        totalLength = $(this).val().length + $('#message').val().length;
        if (totalLength > 200) {
            let name = $(this).val();
            let length = 200 - $('#message').val().length;
            name = name.substr(0, length);
            totalLength = totalLength - 1;
            $(this).val(name);
        }
        counterMessage = totalLength + ' caractère(s) / 200';
        $('#counter').text(counterMessage);
    };

    document.getElementById('message').onkeyup = function (e) {
        totalLength = $('#name').val().length + $(this).val().length;;
        if (totalLength > 200) {
            let message = $(this).val();
            let length = 200 - $('#name').val().length;
            message = message.substr(0, length);
            totalLength = totalLength - 1;
            $(this).val(message);
        }
        counterMessage = totalLength + ' caractère(s) / 200';
        $('#counter').text(counterMessage);
    };
    /* Fin de gestion du compteur de caractères */

    // Affichage de la photo miniature sur sélection
    $('#photo').change(function (e) {
        let f = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                let span = document.createElement('span');
                photo = e.target.result;
                span.innerHTML = '<img class="img-fluid" src="' + photo + '">';

                // Suppression de la dernière image si elle existe
                if ($('.img-fluid').length)
                {
                    $('.img-fluid').remove();
                }

                document.getElementById('thumb').appendChild(span);
            }
        })(f);
        reader.readAsDataURL(f);
    });

    // Envoie du formulaire et génération du PDF
    $('#submit').click(function (e) {
        e.preventDefault();
        let shop = $('#shop').val();
        if (shop === '1') {
            shop = 'Orléans';
        } else if (shop === '2') {
            shop = 'Tours';
        } else if (shop === '3') {
            shop = 'Reims';
        }
        let name = $('#name').val();
        let message = $('#message').val();

        /* Génération du PDF */
        let doc = new jsPDF();
        doc.setFont('BrandonTextRegular');
        doc.text('Document généré le : ' + new Date(), 10, 10);
        doc.text('Nom du commercial : ' + name, 10, 20);
        doc.text('Magasin : ' + shop, 10, 30);
        doc.text('Message : ' + message, 10, 40);
        if (photo != null) {
            doc.addImage(photo, 'JPEG', 10, 60, 100, 100);
        }
        doc.save('CR.pdf');
        /* Fin de génération PDF */

        // Réinitialisation du compteur de caractère
        document.getElementById("form").reset();
        counterMessage = '0 caractère(s) / 200';
        $('#counter').text(counterMessage);
        // Suppression de la photo miniature dans la vue
        $("#thumb").empty();
    });

    // Appel au Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            });
    }

})();

// Fonction de calcul de distance
function distanceTo(gpsPosition, gpsCities)
{
    let results = [];

    let lat1 = gpsPosition[0];
    let long1 = gpsPosition[1];

    for (let city in gpsCities) {
        let position = gpsCities[city];

        let lat2 = position[0];
        let long2 = position[1];

        let lat1ToRadian = Math.PI * lat1/180;
        let lat2ToRadian = Math.PI * lat2/180;

        let theta = long1 - long2;
        let thetaToRadian = Math.PI * theta/180;

        let range = Math.sin(lat1ToRadian) * Math.sin(lat2ToRadian) + Math.cos(lat1ToRadian) * Math.cos(lat2ToRadian) * Math.cos(thetaToRadian);
        range = Math.acos(range);
        range = range * 180/Math.PI;
        range = range * 60 * 1.1515;

        range = range * 1.609344; // Distance en km

        results.push([city, range]);
    }

    let shortest = 0;
    let citySelect;

    for (let index in results) {
        let rows = results[index];
        if (rows[1] <= shortest || shortest === 0) {
            shortest = rows[1];
            citySelect = rows[0];
        }
    }

    return citySelect;
}


