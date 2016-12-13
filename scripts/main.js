document.addEventListener('DOMContentLoaded', function () {

    var buttonBlock = document.getElementsByClassName('buttonBlock')[0];

    /**
     *
     *  Function for count previous/next position of character.
     *
     */

    function count() {

        var counter = 1;

        return function (btn) {

            if (btn === 'prev') {
                if (counter <= 2) {
                    document.getElementsByClassName('prevButton')[0].disabled = true;
                }
                return --counter;

            } else if (btn === 'next') {
                if (counter === 88) {
                    counter = 1;
                    return counter;
                }
                document.getElementsByClassName('prevButton')[0].disabled = false;
                counter++;
                return counter;
            }
        }
    }

    var countClosure = count();

    /**
     *
     *  Function for clear columns of character old information.
     *
     */

    function clearColumn() {

        document.getElementsByClassName('episodes')[0].textContent = '';
        document.getElementsByClassName('anthropometry')[0].textContent = '';

    }

    /**
     *
     *  Listener for previous/next buttons.
     *
     */

    buttonBlock.addEventListener('click', function (event) {

        clearColumn();

        if (event.target.getAttribute('data-btn') === 'prev') {

            retrieveCharacterInfo(countClosure('prev'));

        } else if (event.target.getAttribute('data-btn') === 'next') {

            retrieveCharacterInfo(countClosure('next'));
        }

    });

    /**
     *
     *  Function for show spinner
     *
     */

    function spinnerShow() {

        var spinner = document.createElement('div'),
            sp = document.createElement('div'),
            cube1 = document.createElement('div'),
            cube2 = document.createElement('div'),
            container = document.getElementsByClassName('container')[0],
            h2 = document.getElementById('headerTitle');
        spinner.className = 'spinner';
        sp.className = 'sp';
        cube1.className = 'double-bounce1';
        cube2.className = 'double-bounce1';
        spinner.appendChild(cube1);
        spinner.appendChild(cube2);
        sp.appendChild(spinner);
        container.insertBefore(sp, h2);

    }

    /**
     *
     *  Function for hide spinner
     *
     */

    function spinnerHide() {

        var spinnerCover = document.getElementsByClassName('sp')[0];
        spinnerCover.remove();
    }

    /**
     *
     *  Function for get anthropometry data of character add info to DOM
     *  accept
     *      response - object that returns after parsing (json) data
     *                 from server.
     *
     */

    function getAnthropometry(response) {

        var ulAnthropometry = document.getElementsByClassName('anthropometry')[0],
            objKeys = {
            'name': 'Name: ',
            'height': 'Height: ',
            'mass': 'Mass: ',
            'hair_color': 'Hair Color: ',
            'skin_color': 'Skin Color: ',
            'eye_color': 'Eye Color: ',
            'birth_year': 'Birth Year: ',
            'gender': 'Gender: '
        };

        for (var key in objKeys) {

            var li = document.createElement('li');
            li.textContent = objKeys[key] + response[key];
            ulAnthropometry.appendChild(li);
        }
    }

    /**
     *
     *  Function for get films data of character and add info to DOM
     *  accept
     *      response - object that returns after parsing (json) data
     *                 from server.
     *
     */

    function getFilms(response) {

        var allFilms = response.films,
            ulEpisodes = document.getElementsByClassName('episodes')[0];;

        for (var i = 0; i < allFilms.length; i++) {

            spinnerShow();

            fetch(allFilms[i]
            ).then(function (response) {

                return response.json();

            }).then(function (response) {

                var li = document.createElement('li');
                li.textContent = 'Episode ' + response.episode_id + ': ' + response.title;
                ulEpisodes.appendChild(li);
                spinnerHide();

            })
        }
    }

    /**
     *
     *  Function for retrieve  data of character
     *  accept
     *      index - position of character in base
     *
     */

    function retrieveCharacterInfo(index) {

        spinnerShow();

        fetch('http://swapi.co/api/people/' + index + '/'
        ).then(function (response) {
            return response.json();

        }).then(function (response) {

            getAnthropometry(response);

            setTimeout(function () {
                spinnerHide();
            },1000);

            getFilms(response);

        }).catch(function () {
            throw new Error('Something wrong!');
        });

    }

    retrieveCharacterInfo(1);

});





