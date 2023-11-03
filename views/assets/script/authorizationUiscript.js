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