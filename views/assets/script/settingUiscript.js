const user = JSON.parse(sessionStorage.user);
console.log('welcome to settings');

$(document).on('click', '#add_table', () => {
    $('.add_table').modal('show')
})

$(document).on('click', '.switch_inp', () => {
    $('.input_way, .text_way').toggle(200)
    $('.switch_inp i').toggleClass(`fa-keyboard fa-list`)
})

$(function () {
    var availableTags = [
        "CREATE TABLE IF NOT EXIST --name-- (id SERIAL NOT NULL ,--column-name-- DATATYPE,...) ",
    ];
    $("#sqlCreateTable").autocomplete({
        source: availableTags
    });
});

$(document).on('change', '.default_type', event => {
    if ($('.default_type').val() == 'USER_DEFINED') {
        $('.default_value').css('display', 'block')
    } else {
        $('.default_value').css('display', 'none')
    }
})