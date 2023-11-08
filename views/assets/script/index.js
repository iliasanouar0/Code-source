const userData = JSON.parse(sessionStorage.user);
console.log(userData);

let userName = `${userData.f_name} ${userData.l_name}`;
console.log(navigator.userAgent);

$(document).on("click", ".info a", function () {
    $("#f_name").val(userData.f_name);
    $("#l_name").val(userData.l_name);
    $("#login").val(userData.login);
    $("#type").val(userData.type);
    $(".user_data").modal("show");
});

$(document).on("click", "#logout", () => {
    $("#modal-danger").modal("show");
});

$(window).on("load", function () {
    console.log("window loaded");
    console.log('%c Reporting!!', 'font-weight: bold; font-size: 50px;color: white; text-shadow: 4px 4px 0 yellow,7px 7px 0 blue');
    console.log('%c TheOne', 'font-size: 20px; color: green;');
    $(".user_name").html(userName);
});

Date.prototype.toDateInputValue = function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
};

$(document).ready(function () {
    $("#e_update_date").val(new Date().toDateString())
    $("#e_add_date").val(new Date().toDateInputValue());
    $(".update").val(new Date().toDateInputValue());
});


console.log(root);
console.log(path);

if (path.includes('supervisor')) {
    switch (userData.type) {
        case 'IT':
            location.href='../../'
            break;
    
        default:
            location.href="./"
            break;
    }
}