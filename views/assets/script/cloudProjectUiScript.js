

$(document).on('click', '#add_Project', e => {
    let settings = {
        url: `http://${ip}:3000/cloud/account/project`,
        method: "GET",
        timeout: 0,
        data: data,
    }
    $.ajax(settings).done(function (responseText) {
        let options = ''
        responseText.forEach(account => {
            options += `<option value="${account.id}">${account.login}</option>`
        });
        $('#cloudaccount').html(options)
    })
    $('#project_redirect').val('https://developers.google.com/oauthplayground')
    $('#project_scope').val('https://mail.google.com')
    $('#projectadd_title').html('Add Project')
    $('.project_name').removeClass('d-none')
    $('.cloudaccount').removeClass('d-none')
    $('.project_modal_bnt').html('Submit')
    $('.project_modal_bnt').attr("id", "project_add");
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
    let settings = {
        url: `http://${ip}:3000/cloud/project/${id}`,
        method: "GET",
        timeout: 0,
        data: data,
    }
    $.ajax(settings).done(function (responseText) {
        $('#projectadd_title').html('Edit Project')
        $('.project_name').addClass('d-none')
        $('.cloudaccount').addClass('d-none')
        $('#project_clientId').val(responseText[0].client_id)
        $('#project_clientSecret').val(responseText[0].client_secret)
        $('#project_redirect').val(responseText[0].redirect_url)
        $('#project_scope').val(responseText[0].scope)
        $('.project_modal_bnt').html('Update')
        $('.project_modal_bnt').attr("id", "Project_update");
        $('.project_modal_bnt').attr("data-id", id);
        $('.add_Project').modal('show')
    })
})

$(document).on('hide.bs.modal', '.add_Project', () => {
    $('.add_Project input').val('')
})

$(document).on('click', '#Project_update', e => {
    let id = $(e.target).data("id")
    console.log(id);
    let client_id = $('#project_clientId').val()
    let client_secret = $('#project_clientSecret').val()
    let redirect_url = $('#project_redirect').val()
    let scope = $('#project_scope').val()

    if (client_id == '' || client_secret == '' || redirect_url == '' || scope == '') {
        Swal.fire('All fields required')
    }
    let obj = {
        client_id: `${client_id}`,
        client_secret: `${client_secret}`,
        redirect_url: `${redirect_url}`,
        scope: `${scope}`,
    }
    updateProject(obj)
})

const updateProject = (data) => {
    let settings = {
        url: `http://${ip}:3000/cloud/project/`,
        method: "PUT",
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

$(document).on('click', '.delete', event => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'black',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let id = $(event.target).data('id')
            fetch(`http://${ip}:3000/cloud/project/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers":
                        "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
                    "Access-Control-Allow-Methods":
                        "GET, HEAD, POST, PUT, DELETE, OPTIONS",
                },
            }).then((response) => {
                return response.text();
            }).then((data) => {
                Swal.fire({
                    title: "Deleted !!",
                    text: data,
                    icon: "warning",
                    confirmButtonText: "ok",
                })
            }).then(() => {
                getDataCloudProject.ajax.reload(null, false)
            });
        } else if (result.isDismissed) {
            console.log("cancelled");
        }
    })
});