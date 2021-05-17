
$(function () {
    var calculatorLayout = $('[data-layout]');
    var file = 'layout/' + calculatorLayout.data('layout') + '.html';
    calculatorLayout.load(file);

    console.log(calculatorLayout.data('content-file'));

    /*jQuery.get('layout/head.html', function (data) {
        $("head").append(data);
    });*/

    setTimeout(function () {
        var includes = $('[data-include]')
        $.each(includes, function () {
            var file = 'layout/' + $(this).data('include') + '.html';
            $(this).load(file);
        })

        var calculatorContentFile = 'data/calculators/' + calculatorLayout.data('content-file') + '.html';
        $('[calculator-include-file]').load(calculatorContentFile);

        $('[calculator-title]').html(calculatorLayout.data('title'));

        setTimeout(function () {
            $('[calculator-breadcrumb]').html(calculatorLayout.data('breadcrumb'));
        }, 500);

    }, 500);

})



function Fnslideup() {
    jQuery("html, body").animate({ scrollTop: 0 }, 800);
}

/*
$(function () {
    var includes = $('[data-include]')
    $.each(includes, function () {
        var file = 'layout/' + $(this).data('include') + '.html'
        $(this).load(file, { name: 'bill' },)
    })
})*/
