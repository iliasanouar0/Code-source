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
        }).then(() => {
            getDataIP.ajax.reload(null, false)
        });
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