

$(document).on('click', '#add_Account', e => {
    $('.add_Account').modal('show')
})

const addAccount = (data) => {
    let settings = {
        url: `http://${ip}:3000/cloud/account/`,
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
        $(".add_Account input").val("");
        $(".add_Account").modal("hide");
        getDataCloudAccount.ajax.reload(null, false)
    });
}

$(document).on('click', '#add', e => {
    let login = $('#login_add').val()
    let password = $('#password_add').val()
    console.log(login);
    console.log(password);
    if (login == '' || password == '') {
        Swal.fire('All felids required !!')
        return
    }
    let obj = {
        login: `${login}`,
        password: `${password}`
    }
    addAccount(obj)
})


$(document).on('click', '.update_pass', event => {
    let id = $(event.target).data('id')
    $('.save_pass').data('id', id)
    $('#change-password-m').modal('show')
})

$(document).on('click', '.save_pass', event => {
    let id = $(event.target).data('id')
    let new_pass = $('#n_pass_update').val()
    let c_new_pass = $('#c_pass_update').val()
    if (new_pass == '' || c_new_pass == '') {
        Swal.fire({
            title: 'All felids required !!',
            icon: 'warning'
        })
        return
    }
    let new_check_state = new_pass == c_new_pass
    if (!new_check_state) {
        Swal.fire({
            title: 'The new password confirmation is wrong',
            icon: 'error'
        })
        return
    }
    let settings = {
        url: `http://${ip}:3000/cloud/account/`,
        method: "PUT",
        timeout: 0,
        data: { id: id, password: new_pass },
    }
    $.ajax(settings).done(function (responseText) {
        Swal.fire({
            title: 'updated',
            text: responseText,
            icon: 'success'
        })
    }).then(() => { $('#change-password-m input').val(''); $('#change-password-m').modal('hide'); getDataCloudAccount.ajax.reload(null, false) })
})