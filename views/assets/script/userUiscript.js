$(document).on('click', '.password_show', event => {
    $(event.target).toggleClass("blur")
})

$(document).on('click', '#add_user', () => {
    $('#entity_add').html('')
    fetch(`http://${ip}:3000/entity`, {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).then((data) => {
        data.forEach((elm) => {
            let option = document.createElement("option");
            option.innerHTML = elm["nom"];
            option.setAttribute("value", elm["id_entity"]);
            $('#entity_add').append(option);
        });
    }).then(() => {
        $(".add_user").modal("show");
    })
})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const addUser = (data) => {
    var settings = {
        url: `http://${ip}:3000/users`,
        method: "POST",
        timeout: 0,
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
            "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
        },
    };
    $.ajax(settings).done(function (responseText) {
        Swal.fire({
            title: "user added successfully!",
            text: responseText,
            icon: "success",
            confirmButtonText: "ok",
        }).then(() => {
            getDataUser()
        });
    });
};

const loginGenerate = (f_name_add, l_name_add, uniqNumber) => {
    if (f_name_add == "" || l_name_add == "") {
        Swal.fire("Please fill all fields");
        return;
    }
    return `${f_name_add[0] + l_name_add + uniqNumber}`;
};

const passwordGenerate = (f_name_add, uniqNumber) => {
    if (f_name_add == "" || l_name_add == "") {
        Swal.fire("Please fill all fields");
        return;
    }
    return `${f_name_add}@${uniqNumber}`;
};

$(document).on("click", "#add", () => {
    let f_name_add = $("#f_name_add").val();
    let l_name_add = $("#l_name_add").val();
    let type_add = $("#type_add").val();
    let entity_add = $("#entity_add").val();
    let login_add
    if ($("#login_add").val() == '') {
        login_add = loginGenerate(f_name_add, l_name_add, getRndInteger(10, 99));
    } else {
        login_add = $("#login_add").val();
    }
    let add_date = new Date().toDateInputValue();
    let add_update = new Date().toDateInputValue();
    let password = passwordGenerate(f_name_add, getRndInteger(10000, 99999));
    let isp_add = $("#isp_add option:selected");
    let isp = []
    for (let i = 0; i < isp_add.length; i++) {
        isp.push(isp_add[i].value)
    }
    if (
        f_name_add == "" ||
        l_name_add == "" ||
        type_add == "" ||
        entity_add == "" ||
        isp.length <= 0
    ) {
        Swal.fire("Please fill all fields");
        return;
    }
    const data = {
        f_name: `${f_name_add}`,
        l_name: `${l_name_add}`,
        login: `${login_add}`,
        type: `${type_add}`,
        password: `${password}`,
        status: `active`,
        date_add: `${add_date}`,
        date_update: `${add_update}`,
        id_entity: `${entity_add}`,
        isp: `${isp}`,
    };
    addUser(data);
    $(".add_user").modal("hide");
});

$(document).on('click', '.delete', event => {
    let id = $(event.target).data('id')
    fetch(`http://${ip}:3000/users/${id}`, {
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
            title: "User deleted successfully!",
            text: data,
            icon: "warning",
            confirmButtonText: "ok",
        })
    }).then(() => {
        getDataUser()
    });
});

$(document).on('click', '.edit', event => {
    $('#e_entity_add').html('')
    fetch(`http://${ip}:3000/entity`, {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).then((data) => {
        data.forEach((elm) => {
            let option = document.createElement("option");
            option.innerHTML = elm["nom"];
            option.setAttribute("value", elm["id_entity"]);
            $('#e_entity_add').append(option);
        });
    })

    let id = $(event.target).data('id')
    fetch(`http://${ip}:3000/users/${id}`, {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
            "Access-Control-Allow-Methods":
                "GET, HEAD, POST, PUT, DELETE, OPTIONS",
        },
    }).then((response) => {
        return response.json();
    }).then(data => {
        $("#e_f_name_add").val(data[0].f_name)
        $("#e_l_name_add").val(data[0].l_name)
        let options = document.querySelector("#e_type_add").children;
        let optionsE = document.querySelector("#e_entity_add").children;
        for (let i = 0; i < options.length; i++) {
            if (options.item(i).value == data[0].type) {
                options.item(i).setAttribute("selected", "true");
            }
        }
        for (let i = 0; i < optionsE.length; i++) {
            if (optionsE.item(i).value == data[0].id_entity) {
                optionsE.item(i).setAttribute("selected", "true");
            }
        }
        $('#edit').data('id', id)
    }).then(() => {
        $(".edit_user").modal("show");
    })
})

$(document).on('click', '#edit', event => {
    id = $(event.target).data('id')
    let update = new Date()
    let f_name_add = $("#e_f_name_add").val();
    let l_name_add = $("#e_l_name_add").val();
    let type_add = $("#e_type_add").val();
    let entity_add = $("#e_entity_add").val();
    let add_update = update;
    let isp_add = $("#e_isp_add option:selected");
    let ispA = []
    for (let i = 0; i < isp_add.length; i++) {
        ispA.push(isp_add[i].value)
    }
    if (
        f_name_add == "" ||
        l_name_add == "" ||
        type_add == "" ||
        entity_add == "" ||
        ispA.length <= 0
    ) {
        Swal.fire("Please fill all fields");
        return;
    }
    const data = {
        f_name: `${f_name_add}`,
        l_name: `${l_name_add}`,
        type: `${type_add}`,
        status: `active`,
        date_update: `${add_update}`,
        id_entity: `${entity_add}`,
        isp: `${ispA}`,
    };
    fetch(`http://${ip}:3000/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
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
            title: "User Updated successfully!",
            text: data,
            icon: "success",
            confirmButtonText: "ok",
        })
    }).then(() => {
        $(".edit_user").modal("hide");
        getDataUser()
    });
});

$(document).on('click', '.update_pass', event => {
    let id = $(event.target).data('id')
    $('.save_pass').data('id', id)
    $('#change-password-m').modal('show')
})

$(document).on('click', '.save_pass', event => {
    let id = $(event.target).data('id')
    console.log(id);
    let old_pass = $('#o_pass_update').val()
    let new_pass = $('#n_pass_update').val()
    let c_new_pass = $('#c_pass_update').val()
    if (old_pass == '' || new_pass == '' || c_new_pass == '') {
        Swal.fire({
            title: 'All felids required !!',
            icon: 'warning'
        })
        return
    }
    console.log(old_pass);
    console.log(new_pass);
    console.log(c_new_pass);
    fetch(`http://${ip}:3000/users/${id}`, {
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(data => {
        let new_check_state = new_pass == c_new_pass
        let old_check_state = old_pass == data[0].password
        console.log(new_check_state);
        console.log(old_check_state);
    })
})