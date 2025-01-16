const Menureader = function () {

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    let currentIndex = 0;
    let unifrData = "";
    let hefrData = {};
    let mozaikData = "";

    let _allMenus = function () {
        weekdays.forEach(weekday => {
            _websiteDaily(`/data/heia/${weekday}.html`, _callbackHEFR, weekday);
        })

        _website("/data/www.unifr.ch/mensa/fr/index.html", _callbackUniFR);
        _website("/data/mozaik-fr.sv-restaurant.ch/fr/plan-des-menus/index.html", _callbackMozaik);
    }

    let _setWeekday = function (index) {
        _activateButton(index);
        $('.menu-content').html("");
        _callbackUniFR("", index);
        _callbackHEFR("", index);
        _callbackMozaik("", index);
    }

    let _activateButton = function (index) {
        $('.btn-weekday').removeClass('active');
        $('.btn-weekday:nth-child(' + (index + 1) + ')').addClass('active');
    }

    let _displaySV = function (data, id) {
        data = DOMPurify.sanitize(data);

        // get the first day in the list
        let firstDayIndex = 0;
        const firstDay = $('.day-nav .day', data)[0].innerText

        switch (firstDay) {
            case 'Ma':
                firstDayIndex = 1;
                break;
            case 'Me':
                firstDayIndex = 2;
                break;
            case 'Je':
                firstDayIndex = 3;
                break;
            case 'Ve':
                firstDayIndex = 4;
                break;
        }

        // start filling unavailable days with "not available" text
        let code = '<div class="row">';

        // compute the number of tabs with data based on the first day in the header
        let tabs = 5 - firstDayIndex;
        if ($('#menu-plan-tab' + (currentIndex + 1 - (5 - tabs)) + ' .menu-item', data).length === 0)
            code += '<div class="col mb-3 text-center"><h3>Not available</h3></div>';

        // create entries for the menus that are available
        for(const menu of $('#menu-plan-tab' + (currentIndex + 1 - (5 - tabs)) + ' .menu-item', data)) {
            code += '<div class="col-lg-4 col-md-6"><div class="card text-center mb-3">\n' +
                '  <div class="card-body">\n' +
                '    <h5 class="card-title">' + $('.menu-title', menu).html() + '</h5>\n';

            if ($('.price', menu).html() !== undefined) code += '    <p class="card-text">' + $('.price', menu).html() + '</p>\n';

            code += '  </div>\n' +
                '  <ul class="list-group list-group-flush">\n' +
                '    <li class="list-group-item">' + $('.menu-description', menu).html() + '</li>';

            if ($('.menu-labels', menu).html() !== "" && $('.menu-labels', menu).html() !== undefined)
                code += '    <li class="list-group-item">' + $('.menu-labels', menu).html() + '</li>';
            if ($('.menu-provenance', menu).html() !== "")
                code += '    <li class="list-group-item">' + $('.menu-provenance', menu).html() + '</li>';
            code += '  </ul>\n' +
                '</div></div>';
        }

        code += '</div></div>';
        $(id).append(code);
    }

    let _displaySVDailyData = function (data, id) {
        if (hefrData[weekdays[currentIndex]]) {

            // start new container
            let code = '<div class="row">';

            data = DOMPurify.sanitize(hefrData[weekdays[currentIndex]], {
                CUSTOM_ELEMENT_HANDLING: {
                    tagNameCheck: /^(mat|app|td)-.*/,
                }
            });


            // create entries for the menus that are available
            for(const menu of $('.menu-wrapper app-category', data)) {
                code += '<div class="col-lg-4 col-md-6"><div class="card text-center mb-3">\n' +
                    '  <div class="card-body">\n' +
                    '    <h5 class="card-title">' + $('h3', menu).html() + '</h5>\n';

                if ($('.price', menu).html() !== undefined) code += '    <p class="card-text">' + $('.price', menu).html() + '</p>\n';

                code += '  </div>\n' +
                    '  <ul class="list-group list-group-flush">\n' +
                    '    <li class="list-group-item">' + $('.name-column', menu).html() + '</li>';

                if ($('.allergen-column', menu).html() !== "" && $('.allergen-column', menu).html() !== undefined)
                    code += '    <li class="list-group-item">' + $('.allergen-column', menu).html() + '</li>';

                code += '  </ul>\n' +
                    '</div></div>';
            }


            code += '</div></div>';
            $(id).html(code);

        } else {
            let code = '<div class="row">';
            code += '<div class="col mb-3 text-center"><h3>Not available</h3></div>';
            code += '</div>'
            $(id).html(code)
        }
    }

    let _displayUniFR = function () {
        let sites = $('.col-md-4', unifrData[currentIndex]);
        let code = '<div class="row">';

        for (let i = 0; i < sites.length; i++) {
            code += '<div class="col-lg-4 col-md-6">';
            code += '<hr class="mt-3"><h2 class="text-center">' + $('h3', sites[i]).html() + '</h2>';
            let counter = 1;

            if ($('.box', sites[i]).length > 0) {
                code += '<div class="card text-center mb-3">\n' +
                    '  <div class="card-body">\n' +
                    '    <h5 class="card-title">' + $('.box.bg-branded', sites[i]).html() + '</h5>\n' +
                    '  </div>\n' +
                    '</div></div>';

                continue;
            }

            $('.menu-item', sites[i]).each(function () {
                code += '<div class="card text-center mb-3">\n' +
                    '  <div class="card-body">\n';

                if ($('h5 img', this).length) code += '    <div class="img-left">' + $('h5 img', this)[0].outerHTML + '</div>\n';

                code += '    <h5 class="card-title">Menu ' + counter + ': ' + $('h4', this).html() + '</h5>\n' +
                    '    <p class="card-text">' + $('h5 small', this).html() + ' CHF</p>\n' +
                    '  </div>\n' +
                    '  <ul class="list-group list-group-flush">\n';

                for (let k = 0; k < $('.list-group-item-text', this).length; k++) {
                    code += '<li class="list-group-item">' + $('.list-group-item-text', this)[k].innerHTML + "</li>";
                }

                code += '  </ul>\n' +
                    '</div>';

                counter++;
            });

            code += '</div>';
        }

        code += '</div>'


        $('#unifr-content').append(code);
    }

    let _callbackUniFR = function (data, index) {
        data = DOMPurify.sanitize(data);
        if (data !== "") unifrData = $('.accordion .row', data);
        currentIndex = (index > -1) ? index : _currentDat();

        _activateButton(currentIndex);

        _displayUniFR();
    }

    let _callbackHEFR = function (data, index, weekday) {
        if (data !== "") hefrData[weekday] = data;
        currentIndex = (index > -1) ? index : _currentDat();

        _activateButton(currentIndex);
        _displaySVDailyData(hefrData, '#hefr-content', weekday);
    }

    let _callbackMozaik = function (data, index) {
        if (data !== "") mozaikData = data;
        currentIndex = (index > -1) ? index : _currentDat();

        _activateButton(currentIndex);

        _displaySV(mozaikData, '#mozaik-content');
    }

    let _websiteDaily = function (url, successEvent, weekday) {
        $.ajax({
            url: url,
            success: function (data, textStats, jqXHR) {
                successEvent(data, textStats, weekday)
            },
        });
    }

    let _website = function (url, successEvent) {
        $.ajax({
            url: url,
            success: successEvent,
        });
    }

    let _currentDat = function () {
        let dayOfWeek = (new Date).getDay() - 1;
        if (dayOfWeek > 4) dayOfWeek = 0;
        return dayOfWeek;
    }

    return {
        allMenus: _allMenus,
        setWeekday: _setWeekday
    }
}();

$(document).ready(function () {
    Menureader.allMenus();
});