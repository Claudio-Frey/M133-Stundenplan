$.get("http://sandbox.gibm.ch/berufe.php", function (data) {
    console.log(data);
    data.forEach(beruf => {
        if (beruf.beruf_name == '') return;

        $("#beruf")
            .append('<option value="' + beruf.beruf_id + '">' + beruf.beruf_name + '</option>')
    });
});

$("#beruf").change(function (event) {
    console.log("klasse.select:", $(this).val())
    $.get("http://sandbox.gibm.ch/klassen.php?beruf_id=" + $(this).val(), function (data) {
        console.log(data);

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
            if (klasse.klasse_name == '');

            $("#klasse")
                .append('<option value="' + klasse.klasse_id + '">' + klasse.klasse_name + '</option>')
        });
    });
})

$.get("http://sandbox.gibm.ch/tafel.php?klasse_id=", function (data) {
    console.log(data);
    data.forEach(tafel => {
        if (tafel.tafel_name == '') return;

        $("#beruf")
            .append('<option value="' + beruf.beruf_id + '">' + beruf.beruf_name + '</option>')
    });
});