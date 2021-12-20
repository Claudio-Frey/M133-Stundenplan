$.get("http://sandbox.gibm.ch/berufe.php", function (data) {
    console.log(data);
    data.forEach(beruf => {
        if (beruf.beruf_name == '') return;

        $("#beruf")
            .append('<option value="' + beruf.beruf_id + '">' + beruf.beruf_name + '</option>')
    });
});

$("#beruf").change(function (event) {
    console.log("klasse.select:",$(this).val())
    $.get("http://sandbox.gibm.ch/klassen.php?beruf_id=" + $(this).val(), function (data) {
    console.log(data);
    data.forEach(klasse => {
        if (klasse.klasse_name == '');

        $("#klasse")
            .append('<option value="' + klasse.klasse_id + '">' + klasse.klasse_name + '</option>')
    });
});
})