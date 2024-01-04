

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
            title: "Entity added successfully!",
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
    let obg = {
        login: `${login}`,
        password: `${password}`
    }
    addAccount(data)
})