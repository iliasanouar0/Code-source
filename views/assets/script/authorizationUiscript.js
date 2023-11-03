console.log('welcome to IP authorization');

$(document).on('click', '#add_ip', () => {
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
        $(".add_ip").modal("show");
    })
})

const addIp = (data) => {
    var settings = {
        url: `http://${ip}:3000/ip/`,
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
        console.log(responseText);
        Swal.fire({
            text: responseText,
            confirmButtonText: "ok",
        })
        getDataIP.ajax.reload(null, false)
        $(".add_ip").modal("hide");
        $('.add_ip input').val('');
    });
};

$(document).on('click', '#add', () => {
    let ip_add = $('#ip_add').val()
    let type_add = $("#type_add").val();
    let entity_add = $("#entity_add").val();
    let note_add = $('#note_add').val()
    if (ip_add == '' || type_add == '' || entity_add == '' || note_add == '') {
        swal.fire('all felids required')
        return
    }
    let data = {
        ip: `${ip_add}`,
        type: `${type_add}`,
        entity: `${entity_add}`,
        note: `${note_add}`,
        status: `idel`,
        created: `${new Date()}`,
        updated: `${new Date()}`
    }
    addIp(data)
})

$(".checkAll").change(function () {
    let status = $(this).is(":checked") ? true : false;
    $(".check").prop("checked", status);
    if (status) {
        let action = `<button type="button" class="btn btn-danger delete-all-this"><i class="far fa-trash-alt"></i></button>`
        $('#action').html(action)
    } else {
        $('#action').html('')
    }
});

$(document).on('click', '.check', () => {
    let check = $("#ip_data input:checked")
    let allCheck = $("#ip_data input:checkbox")
    console.log(check.length);
    if (check.length > 0) {
        let action = `<button type="button" class="btn btn-danger delete-all-this"><i class="far fa-trash-alt"></i></button>`
        $('#action').html(action)
    } else {
        $('#action').html('')
    }
    if (check.length == allCheck.length) {
        $(".checkAll").prop("checked", true);
    } else {
        $(".checkAll").prop("checked", false);
    }
})

$(document).on('click', '.delete-all-this', () => {
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
            let check = $("#ip_data input:checked")
            const ides = []
            for (let i = 0; i < check.length; i++) {
                let ID = check[i].value
                ides.push(ID)
            }
            fetch(`http://${ip}:3000/ip/`, {
                method: "PATCH",
                body: `${JSON.stringify(ides)}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
                    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH'
                }
            }).then(response => {
                return response.text()
            }).then(data => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: data,
                    showConfirmButton: false,
                    timer: 3000
                })
            }).then(() => {
                $('.checkAll')[0].checked = false
                $('#action').html('')
                getDataIP.ajax.reload(null, false)
            })
        } else if (result.isDismissed) {
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Cancelled',
                showConfirmButton: false,
                timer: 3000
            })
        }
    })
})

$(document).on('click', '.edit', ev => {
    $('#entity_edit').html('')
    fetch(`http://${ip}:3000/entity`, {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).then((data) => {
        data.forEach((elm) => {
            let option = document.createElement("option");
            option.innerHTML = elm["nom"];
            option.setAttribute("value", elm["id_entity"]);
            $('#entity_edit').append(option);
        });
    })
    let id = $(ev.target).data('id')
    var settings = {
        url: `http://${ip}:3000/ip/${id}`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
            "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
        },
    };
    $.ajax(settings).done(function (responseText) {
        $("#ip_edit").val(responseText[0].ip)
        $("#note_edit").val(responseText[0].note)
        let options = document.querySelector("#type_edit").children;
        let optionsE = document.querySelector("#entity_edit").children;
        for (let i = 0; i < options.length; i++) {
            if (options.item(i).value == responseText[0].type) {
                options.item(i).setAttribute("selected", "true");
            }
        }
        for (let i = 0; i < optionsE.length; i++) {
            if (optionsE.item(i).value == responseText[0].id_entity) {
                optionsE.item(i).setAttribute("selected", "true");
            }
        }
        $('#edit').data('id', id)
        $(".edit_ip").modal("show");
    });
})

const editIp = (data) => {
    var settings = {
        url: `http://${ip}:3000/ip/`,
        method: "PUT",
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
        console.log(responseText);
        Swal.fire({
            text: responseText,
            confirmButtonText: "ok",
        })
        getDataIP.ajax.reload(null, false)
        $(".edit_ip").modal("hide");
        $('.edit_ip input').val('');
    });
};

$(document).on('click', '#edit', ev => {
    let id = $(ev.target).data('id')
    let ip_edit = $('#ip_edit').val()
    let type_edit = $("#type_edit").val();
    let entity_edit = $("#entity_edit").val();
    let note_edit = $('#note_edit').val()
    if (ip_edit == '' || type_edit == '' || entity_edit == '' || note_edit == '') {
        swal.fire('all felids required')
        return
    }
    let data = {
        id: `${id}`,
        ip: `${ip_edit}`,
        type: `${type_edit}`,
        entity: `${entity_edit}`,
        note: `${note_edit}`,
        status: `idel`,
        created: `${new Date()}`,
        updated: `${new Date()}`
    }
    editIp(data)
})

$('#mode').change(() => {
    var settings = {
        url: `http://${ip}:3000/node/env/`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
            "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
        }
    };
    $.ajax(settings).done(function (responseText) {
        $('.mode').html(responseText)
    });
})