const userData = JSON.parse(sessionStorage.user)
let userName = `${userData.f_name} ${userData.l_name}`

$(document).on('click', '.info a', function () {
    $('#f_name').val(userData.f_name)
    $('#l_name').val(userData.l_name)
    $('#login').val(userData.login)
    $('#type').val(userData.type)
    $('.user_data').modal('show');
});

Date.prototype.toDateInputValue = (function () {
    let local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

$(window).on("load", function () {
    console.log("window loaded");
    console.log('%c Reporting!!', 'font-weight: bold; font-size: 50px;color: white; text-shadow: 4px 4px 0 yellow,7px 7px 0 blue');
    console.log('%c TheOne', 'font-size: 20px; color: green;');
    $('.info a').html(userName)
});

$(document).on('click', '#logout', () => {
    $('#modal-danger').modal('show');
})