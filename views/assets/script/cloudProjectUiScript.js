

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
    $('#project_redirect').val('https://developers.google.com/oauthplayground')
    $('#project_scope').val('https://mail.google.com')
    $('.add_Project').modal('show')
})

const addProject = (data) => {
    let settings = {
        url: `http://${ip}:3000/cloud/project/`,
        method: "POST",
        timeout: 0,
        data: data,
    }
    $.ajax(settings).done(function (responseText) {
        Swal.fire({
            title: "Added successfully!",
            text: responseText.message,
            icon: "success",
            confirmButtonText: "ok",
        })
    }).then(() => {
        $(".add_Project input").val("");
        $(".add_Project").modal("hide");
        getDataCloudProject.ajax.reload(null, false)
    });
}

$(document).on('click', '#project_add', e => {
    let name = $('#project_name').val()
    let account = $('#cloudaccount').val()
    let client_id = $('#project_clientId').val()
    let client_secret = $('#project_clientSecret').val()
    let redirect_url = $('#project_redirect').val()
    let scope = $('#project_scope').val()

    if (name == '' || account == '' || client_id == '' || client_secret == '' || redirect_url == '' || scope == '') {
        Swal.fire('All fields required')
    }
    let obj = {
        name: `${name}`,
        account: `${account}`,
        client_id: `${client_id}`,
        client_secret: `${client_secret}`,
        redirect_url: `${redirect_url}`,
        scope: `${scope}`,
    }
    addProject(obj)
})

$(document).on('click', '.edit', e => {
    let id = $(e.target).data('id')
    console.log(id);
    let settings = {
        url: `http://${ip}:3000/cloud/project/${id}`,
        method: "GET",
        timeout: 0,
        data: data,
    }
    $.ajax(settings).done(function (responseText) {
        console.log(responseText);
    })
})