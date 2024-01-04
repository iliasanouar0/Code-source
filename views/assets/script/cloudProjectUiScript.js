

$(document).on('click', '#add_Project', e => {
    let settings = {
        url: `http://${ip}:3000/cloud/account/project`,
        method: "GET",
        timeout: 0,
        data: data,
    }
    $.ajax(settings).done(function (responseText) {
        console.log(responseText);
    })
    // cloudaccount
    $('.add_Project').modal('show')
})