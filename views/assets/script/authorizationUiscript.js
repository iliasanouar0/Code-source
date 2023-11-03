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

$(document).on('click', '#add', () => {
    let ip_add = $('#ip_add').val()
    let type_add = $("#type_add").val();
    let entity_add = $("#entity_add").val();
    let note_add = $('#note_add')
    if (ip_add == '' || type_add == '' || entity_add == '' || note_add == '') {
        swal.fire('all felids required')
        return
    }
    
})