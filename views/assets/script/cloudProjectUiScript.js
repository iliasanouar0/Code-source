

$(document).on('click', '#add_Project', e => {
    let settings = {
        url: `http://${ip}:3000/cloud/account/project`,
        method: "GET",
        timeout: 0,
        data: data,
    }
    $.ajax(settings).done(function (responseText) {
        console.log(responseText);
        let options = ''
        responseText.forEach(account => {
            options += `<option value="${account.id}">${account.login}</option>`
        });
        $('#cloudaccount').html(options)
    })
    $('.add_Project').modal('show')
})