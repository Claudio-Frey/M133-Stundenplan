//document ready funtion umschliesst alle funktionen, damit das laden der funktionen erst beginnt wenn auch der DOM ist
$(document).ready(function () {
    //leerer aufruf der show_beruf funktion das beim Aufruf der Seite, die funktionen automatisch anlaufen können und somit 
    // auch alles vom Local Storage geladen werden kann
    show_beruf();

    // Speichert ob die Seite gerade aufgeruft wurde
    let initial_load = true;
    // Variabel Definition für die Dauer des Fade In und Out
    const animation_duration = 1000;
    // Array für die Wochentage anstelle von moments.js
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag',];
    // Variabel datum mit dem aktuellen Datum
    let date = new Date();
    // Variabel kw die mit der aktuellen kalenderwoche befüllt wird
    let kw = getWeekNumber(date);
    //EVENTLISTENERS:

    //EVENTLISTENER: überprüft ob der Beruf geändert wurde, wenn ja wird die function show_klasse aufgerufen, ausserdem wird 
    //$(this).val() ins Local Storage geschrieben und die Tabelle wird mit der function clear_tafel  gecleared
    $("#beruf").change(function (event) {
        show_klasse($(this).val());
        localStorage.setItem("berufid", $(this).val());
        clear_tafel();
    })

    //EVENTLISTENER: überprüft ob die Klasse geändert wurde, wenn ja wird die function show_tafel aufgerufen, ausserdem wird 
    //$(this).val() ins Local Storage geschrieben
    $("#klasse").change(function (event) {
        show_tafel($(this).val());
        localStorage.setItem("klasseid", $(this).val());
    })

    //EVENTLISTENER: Bei einem Klick auf den vorwärts Button wird der Datum Wert um -7 erhöht und die funktion show_tafel aufgerufen
    $("#zurueck").click(function (event) {
        date.setDate(date.getDate() - 7);
        kw = getWeekNumber(date);
        show_tafel($("#klasse").val());
    })

    //EVENTLISTENER: Bei einem Klick auf den vorwärts Button wird der Datum Wert um +7 erhöht und die funktion show_tafel aufgerufen  
    $("#vorwaerts").click(function (event) {
        date.setDate(date.getDate() + 7);
        kw = getWeekNumber(date);
        show_tafel($("#klasse").val());
    })

    //EVENTLISTENER: Lädt die aktuelle Kalenderwoche
    $("#aktuelle_kalenderwoche").click(function (event) {
        console.log(event);
    })
    // FUNCTIONS

    // function die den Beruf von der API ladet
    function show_beruf() {
        $.get("http://sandbox.gibm.ch/berufe.php", function (data) {

            $("#beruf")
                .html('')
                .append('<option value="0">Beruf wählen</option>');
            //console.log(data);
            data.forEach(beruf => {
                //if (beruf.beruf_name == '') return;

                $("#beruf")
                    .append('<option value="' + beruf.beruf_id + '">' + beruf.beruf_name + '</option>');

            });

            if (localStorage.getItem("berufid") && initial_load) {
                $("#beruf").val(localStorage.getItem("berufid"));
                show_klasse(localStorage.getItem("berufid"));
            }
        });
    }

    // function die die Klasse von der API ladet wenn ein Beruf ausgewählt wurde
    function show_klasse(beruf_id) {

        //console.log("klasse.select:", beruf_id)
        $.get("http://sandbox.gibm.ch/klassen.php?beruf_id=" + beruf_id, function (data) {
            console.log("klassen", data);

            if (data.length == 0) {
                $("#klasse")
                    .html('')
                    .append('<option value="-1">Keine Klassen gefunden</option>')
                    .prop("disabled", true);
                return
            }

            $("#klasse")
                .html('')
                .append('<option value="0">Klasse wählen</option>')
                .prop("disabled", false);


            data.forEach(klasse => {
                //if (klasse.klasse_name == '');

                $("#klasse")
                    .append('<option value="' + klasse.klasse_id + '">' + klasse.klasse_name + '</option>')
            });

            if (localStorage.getItem("klasseid") && initial_load) {
                $("#klasse").val(localStorage.getItem("klasseid"));
                show_tafel(localStorage.getItem("klasseid"));
            }
        });
    }

    // function die die Tabelle befüllt mit dem Stundenplan wenn die Klasse ausgewählt wurde
    function show_tafel(klasse_id) {
        console.log("klasse.select:", klasse_id)

        /*
        PROBLEM:
        let test;
        if (true) {
            test = "Bedingung wahr"
        } else {
            test = "Bedingung falsch"
        }
        
        Shorthand IF (ternärer Operator):
        let test = true ? "Bedingung wahr" : "Bedingung falsch"
        */
        $("#tafel").fadeOut(initial_load ? 0 : animation_duration, function () {
            $(".tafel_leeren").remove();

            $("#message").html('')
                .fadeOut(0);

            $.get("http://sandbox.gibm.ch/tafel.php?klasse_id=" + klasse_id + "&woche=" + kw, function (data) {
                console.log(data);


                if (data.length == 0) {
                    $("#message")
                        .html('Kein Unterricht')
                        .fadeIn(animation_duration);
                    return
                }

                $("#tafel").hide();

                data.forEach(tafel => {
                    //if (tafel.tafel_id == '') return;

                    $("#tafel")
                        .append(
                            `<tr class="tafel_leeren">
                    <td>${format_date(tafel.tafel_datum)}</td>
                    <td>${weekdays[tafel.tafel_wochentag]}</td>
                    <td>${(tafel.tafel_von).slice(0, -3)}</td>
                    <td>${(tafel.tafel_bis).slice(0, -3)}</td>
                    <td>${tafel.tafel_lehrer}</td>
                    <td>${tafel.tafel_fach}</td>
                    <td>${tafel.tafel_raum}</td>
                    </tr>`
                        )
                });
                $("#tafel").fadeIn(animation_duration);
                $('#aktuelle_kalenderwoche').text(`KW: ${kw}`)
            });
        });

        // Von jetzt an nur noch async Requests
        initial_load = false;
    }

    // function zum bereinigen der Tabelle wenn die Woche gewechselt wird oder eine neue Klase ausgewählt wird
    function clear_tafel() {
        $("#tafel").fadeOut(animation_duration, function () {
            $(".tafel_leeren").remove();
        }
        );
    }

    // function zum formatieren des Datums ohne moments.js
    function format_date(tafel_datum) {
        const d = new Date(tafel_datum);
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
    }

    //https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
    function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return `${weekNo}-${d.getUTCFullYear()}`;
    }
})
