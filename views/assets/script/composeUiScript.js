const user = JSON.parse(sessionStorage.user);
const wssUri = `ws://${ip}:7072/wss?id=${user.id_user}`;
const websocket_s = new WebSocket(wssUri);

websocket_s.onmessage = (event) => {
    let data = event.data
    console.log(data);
    switch (data) {
        case 'reload':
            $('body .tooltip').removeClass('show');
            getDataCompose.ajax.reload(null, false)
            break;
        case 'location reload':
            location.reload()
            break
        default:
            console.log(data);
            break;
    }
}

Date.prototype.toDateInputValue = function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
};

$(document).on("click", "#add_compose", () => {
    $('#c_update').addClass('d-none')
    $('#c_add').removeClass('d-none')
    $('.composeEditTitle').html('Create new compose')
    $(".add_compose").modal("show");
});

$(document).ready(function () {
    $("#p_update_date").val(new Date().toDateString())
    $("#p_add_date").val(new Date().toDateInputValue());
    $(".update").val(new Date().toDateInputValue());
});

$(document).on('click', '.edit', event => {
    let id = $(event.target).data('id')
    $('#c_update').data('id', id)
    $('#c_update').removeClass('d-none')
    $('#c_add').addClass('d-none')
    $('.composeEditTitle').html('Update compose')
    fetch(`http://${ip}:3000/compose/one/${id}`, {
        method: "GET",
    }).then(response => {
        return response.json()
    }).then(json => {
        let t =
            [
                {
                    "id_process": 50,
                    "id_list": 17,
                    "id_user": 20,
                    "action": "compose,subject:test compose 666,to:iliasanouar0@gmail.com,limit:30,Fixed:true",
                    "data": "test.txt",
                    "offer": "test11.html",
                    "status": "FINISHED",
                    "count": 69,
                    "counter": 60,
                    "add_date": "2023-12-06T08:28:35.798Z",
                    "update_date": "2023-12-06T08:28:35.798Z",
                    "start_in": "2023-12-06T03:28:54.410-05:00",
                    "end_in": "2023-12-06T03:31:03.738-05:00"
                }
            ]
        let list = $('#p_list_add').children()
        for (let i = 0; i < list.length; i++) {
            if ($(list[i]).val() == json[0].id_list) {
                $(list[i]).attr('selected', true)
                break
            }
        }
        let data = $('#p_data_add').children()
        for (let i = 0; i < data.length; i++) {
            if ($(data[i]).val() == json[0].data) {
                $(data[i]).attr('selected', true)
                break
            }
        }
        let actions = json[0].action.split(',')
        console.log(actions);
        for (let i = 0; i < array.length; i++) {
            switch (actions[i]) {
                case "compose":
                    $('#btn-check-compose').prop("checked", true);
                    $('.send_message').removeClass('d-none');
                    break;
                case "verify":
                    $('#btn-check-verify').prop("checked", true);
                    $('.send_message').addClass('d-none');
                    break;
                case "checkProxy":
                    $('#btn-check-verify').prop("checked", true);
                    $('.send_message').addClass('d-none');
                    break;
                default:
                    break;
            }
        }


    })
    $('.add_compose').modal('show')
})

/**
 * ~composing
 * ! form :
 */

$(document).on('click', '.erase', () => {
    $('#messageBody').val('')
})

const handleImageUpload = event => {
    const files = $('#messageBody')[0].files
    const formData = new FormData()
    formData.append('File', files[0])

    fetch(`http://${ip}:3000/compose/offers/upload/`, {
        method: 'POST',
        body: formData
    }).then(response => response.json()).then(data => {
        console.log(data.path)
    }).catch(error => {
        console.error(error)
    })
    $('#messageBody').val('')
}

$(document).on('click', '.upload', event => {
    const offersAdd = document.querySelector("#p_offers_add");
    offersAdd.innerHTML = ""
    handleImageUpload(event)
    fetch(`http://${ip}:3000/compose/offers`, {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.length == 0) {
            let option = document.createElement("option");
            option.innerHTML = `No available offers`
            option.setAttribute("value", '');
            offersAdd.appendChild(option);
        } else {
            let option = document.createElement("option");
            option.innerHTML = `--SELECT OFFER--`
            option.setAttribute("value", '');
            offersAdd.appendChild(option);
            data.forEach((elm) => {
                let option = document.createElement("option");
                option.innerHTML = `${elm['file']}`
                option.setAttribute("value", elm['file']);
                offersAdd.appendChild(option);
            });
        }
    })
})

const addCompose = data => {
    var settings = {
        "url": "http://project1.gm2reporting.com:3000/compose/",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(data),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        Swal.fire({
            title: response,
            timer: 1500,
            showConfirmButton: false,
            icon: 'success'
        }).then(() => {
            $('.add_compose input:text').val('')
            $('.add_compose input:checkbox').prop("checked", false)
            $(".add_compose").modal("hide");
            getDataCompose.ajax.reload(null, false)
        })
    });
}

$('#p_offers_add').change(event => {
    let value = $(event.target).val()
    if (value == '') {
        $('#body').removeClass('d-none')
        $('#preview').addClass('d-none')
    } else {
        var settings = {
            "url": `http://${ip}:3000/compose/offerdata?offer=${value}`,
            "method": "GET",
            "timeout": 0,
        };
        $.ajax(settings).done(function (response) {
            $('#body').addClass('d-none')
            $('#preview').removeClass('d-none')
            $('#preview').html(response)
        });
    }
})

$('#auto_limit').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    $('#limit_send').prop("disabled", status);
    if (status) {
        $('#limit_fixed').prop("checked", false);
        $('#limit_send').val(0);
    } else {
        $('#limit_send').val('');
    }
})

$('#limit_fixed').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    $('#limit_send').prop("disabled", !status);
    if (status) {
        $('#auto_limit').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

$(document).on('click', '#c_add', () => {
    let composingList = $('#p_list_add').val()
    let data = $('#p_data_add').val()
    let count = $('#p_data_add option:selected').data('count')
    let limit = $('#limit_send').val()
    let selected = $('.actions input:checked')
    if (data == 'No available data' || selected.length == 0) {
        swal.fire('all fields requirer')
        return
    }
    let action = selected[0].value
    let dataComposing
    switch (action) {
        case 'checkProxy':
            dataComposing = {
                "name": `test`,
                "action": action,
                "status": `idel`,
                "id_user": `${user['id_user']}`,
                "id_list": `${composingList}`,
                "offer": `none`,
                "data": `none`,
                "count": 0,
            };
            console.log(dataComposing);
            addCompose(dataComposing)
            break;
        case 'verify':
            dataComposing = {
                "name": `test`,
                "action": action,
                "status": `idel`,
                "id_user": `${user['id_user']}`,
                "id_list": `${composingList}`,
                "offer": `none`,
                "data": `none`,
                "count": 0,
            };
            addCompose(dataComposing)
            break;
        case 'compose':
            let offerAdd
            let subject = $('#subject').val()
            let body = $('#body').val()
            let to = $('#to').val()
            if (subject == '' || to == '') {
                swal.fire('subject and mailto are required')
                return
            }
            if (body == '') {
                offerAdd = $('#p_offers_add option:selected').val()
                if (offerAdd == '') {
                    swal.fire('Select or upload offer !!')
                    return
                }
            } else {
                offerAdd = `${subject.substring(0, 3)}${user['id_user']}offer.html`
                fetch(`http://${ip}:3000/compose/offers?offer=${offerAdd}`, {
                    method: 'POST',
                    body: `${JSON.stringify({ data: body })}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
                        'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
                    }
                }).then(r => {
                    return r.text()
                }).then(d => {
                    console.log(d);
                })
            }
            action += `,subject:${subject},to:${to}`
            if (limit != '' && limit != '0') {
                action += `,limit:${limit}`
            } else {
                action += `,limit:auto`
            }
            if ($(limit_fixed).is(":checked")) {
                action += `,Fixed:true`
            }
            dataComposing = {
                "name": `test`,
                "action": action,
                "status": `idel`,
                "id_user": `${user['id_user']}`,
                "id_list": `${composingList}`,
                "offer": `${offerAdd}`,
                "data": `${data}`,
                "count": `${count}`,
            };

            addCompose(dataComposing)
            break;
        default:
            break;
    }
})

$(document).on('click', '.start', event => {
    const id = $(event.target)[0].attributes[2].value
    const status = "RUNNING"
    const start_in = new Date()
    let obj = {
        id_process: `${id}`,
        status: `${status}`,
        start_in: start_in,
    }
    let socketState = websocket_s.readyState
    if (socketState !== websocket_s.CLOSED) {
        var settings = {
            "url": `http://${ip}:3000/entity/${user.id_entity}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
        };
        $.ajax(settings).done(function (response) {
            websocket_s.send(JSON.stringify({ request: "start", id_process: id, data: obj, entity: response[0].nom }))
            getDataCompose.ajax.reload(null, false)
            $('body .tooltip').removeClass('show');
        });
    } else {
        swal.fire({
            title: 'connection lost !',
            text: 'it\'s looks like your connection is off reload page',
            icon: 'warning',
            confirmButtonText: 'reload page',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        }).then(result => {
            if (result.isConfirmed) {
                location.reload()
            }
        })
    }
})

$(document).on('click', '.pause', event => {
    const id = $(event.target)[0].attributes[2].value
    const status = "PAUSED"
    let obj = {
        id_process: `${id}`,
        status: `${status}`,
    }
    let socketState = websocket_s.readyState
    if (socketState !== websocket_s.CLOSED) {
        $('body').tooltip('dispose');
        websocket_s.send(JSON.stringify({ request: "pause", id_process: id, data: obj }))
    } else {
        swal.fire({
            title: 'connection lost !',
            text: 'it\'s looks like your connection is off reload page',
            icon: 'warning',
            confirmButtonText: 'reload page',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        }).then(result => {
            if (result.isConfirmed) {
                location.reload()
            }
        })
    }
})

$(document).on('click', '.resume', event => {
    const id = $(event.target)[0].attributes[2].value
    const status = "RUNNING"
    let obj = {
        id_process: `${id}`,
        status: `${status}`,
    }

    let socketState = websocket_s.readyState
    if (socketState !== websocket_s.CLOSED) {
        $('body').tooltip('dispose');
        websocket_s.send(JSON.stringify({ request: "resume", id_process: id, data: obj }))
    } else {
        swal.fire({
            title: 'connection lost !',
            text: 'it\'s looks like your connection is off reload page',
            icon: 'warning',
            confirmButtonText: 'reload page',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        }).then(result => {
            if (result.isConfirmed) {
                location.reload()
            }
        })
    }
})

function msToMnSc(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

$(document).on('click', '.status', event => {
    $('body').tooltip('dispose');
    let id = $(event.target).data('id')
    let children = $(event.target).parent().parent()[0].children
    $('.count').html(children[2].innerHTML)
    $('.status_bg').html($(`.status-p-${id}`).prop('outerHTML'))
    $('#p_s').html(id)
    $('#process_result').DataTable({
        responsive: true,
        deferRender: true,
        destroy: true,
        autoWidth: false,
        ajax: {
            url: `http://${ip}:3000/compose/seeds/${id}`,
            dataSrc: '',
        },
        columns: [
            {
                data: null,
                render: function (row) {
                    return `<div class="card m-0">
                    <div class="card-body p-1 text-center text-dark">
                    ${row.gmail}
                    </div>
                   </div>`
                }
            },
            {
                data: null,
                render: function (row) {
                    let proxy
                    if (row.proxy == 'undefined') {
                        proxy = 'none'
                    } else {
                        proxy = row.proxy
                    }
                    return `<div class="card m-0">
                    <div class="card-body p-1 text-center text-dark">
                    ${proxy}
                    </div>
                   </div>`
                }
            },
            {
                data: null,
                render: function (row) {
                    return `<div class="card m-0">
                        <div class="card-body p-1 text-center text-dark">
                            ${row.isp}
                        </div>
                    </div>`
                }
            },
            {
                data: null,
                render: function (row) {
                    let status
                    if (row.rstatus == 'running') {
                        status = `<div class="d-flex justify-content-center">
                        <div class="spinner-border spinner-border-sm text-primary m-auto" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>`
                    } else if (row.rstatus === null && row.pstatus != 'STOPPED') {
                        status = 'idel'
                    } else if (row.rstatus === null && row.pstatus === 'STOPPED') {
                        status = `<span class="text-danger">${row.pstatus}</span>`
                    } else if (row.rstatus == 'finished') {
                        return `<div class="p-0 text-center f-action">
                                ${row.rstatus}
                            </div>`
                    } else if (row.rstatus == 'failed') {
                        return `<div class="p-0 text-center fr-action">
                            ${row.rstatus}
                        </div>`
                    } else {
                        status = row.rstatus
                    }
                    return status
                }
            },
            {
                data: null,
                render: function (row) {
                    if (row.statusdetails == null || row.statusdetails == "" || row.statusdetails == undefined || row.statusdetails == 'undefined') {
                        return `<p>&#9940;</p>`
                    }
                    if (row.statusdetails.includes('limit')) {
                        return `<div class="card m-0" data-bs-toggle="tooltip" data-bs-title="${row.statusdetails}">
                        <div class="card-body p-1 text-center text-dark">Limit reached !!</div></div>`
                    } else if (row.statusdetails.includes('blocked')) {
                        return `<div class="card m-0" data-bs-toggle="tooltip" data-bs-title="${row.statusdetails}">
                        <div class="card-body p-1 text-center text-dark">Blocked !!</div></div>`
                    } else if (row.statusdetails.includes('Address not found')) {
                        return `<div class="card m-0" data-bs-toggle="tooltip" data-bs-title="${row.statusdetails}">
                        <div class="card-body p-1 text-center text-dark">Address not found !!</div></div>`
                    }


                }
            },
            {
                data: null,
                render: function (row) {
                    let duration
                    if (row.start_in == null || row.end_in == '0') {
                        duration = '00:00:00'
                    } else {
                        let start = new Date(row.start_in)
                        let end = new Date(row.end_in)
                        duration = msToMnSc(end - start)
                    }
                    return duration
                }
            },
            {
                data: null,
                searchable: false,
                orderable: false,
                render: function (row) {
                    return `<button type="button" class="btn btn-dark details" data-id="${row.id_seeds}" data-id_process="${id}"><i class="fas fa-eye"></i></button>`
                }
            }
        ],
        order: [[3, 'asc']],
        drawCallback: function () {
            $('body').tooltip('dispose');
            $('[data-bs-toggle="tooltip"]').tooltip({ trigger: "hover" });
        }
    })
    $('#modal-compose-view').modal('show')
    /**
     * * Websocket connection :
     * ? opening => get data from database render the view. 
     * ! closing on modal hide
     */
    const wsUri = `ws://${ip}:7074/wss`;
    const websocket = new WebSocket(wsUri);
    websocket.onopen = (e) => {
        $('.w_seeds').html(0)
        $('.a_seeds').html(0)
        $('.f_seeds').html(0)
        $('.ff_seeds').html(0)
        websocket.send(`${id}`)
    }

    websocket.onmessage = function (event) {
        let data = JSON.parse(event.data)
        if (data.length == 0) {
            return
        } else {
            $('#process_result').DataTable().ajax.reload(null, false)
            $('.w_seeds').html(data[0].waiting)
            $('.a_seeds').html(data[0].active)
            $('.f_seeds').html(data[0].finished)
            $('.ff_seeds').html(data[0].failed)
            $('.status_bg').html($(`.status-p-${id}`).prop('outerHTML'))
        }
    };
    websocket.onclose = () => {
        console.log('closed');
    }
    $('.btn-close').on('click', () => {
        websocket.close()
        $('#modal-compose-view').modal('hide')
    })
    $('#modal-compose-view').on('hide.bs.modal', () => {
        websocket.close()
    })
})

$(document).on('click', '.details', event => {
    $('body').tooltip('dispose');
    let id = $(event.target).data('id')
    let id_process = $(event.target).data('id_process')
    fetch(`http://${ip}:3000/result/feedback/${id}?id_process=${id_process}`).then(response => {
        return response.json()
    }).then(data => {
        if (data.length == 0) {
            Swal.fire({
                title: 'NO feedback yet !!',
                icon: 'info'
            })
            return
        }
        let feedBack = data[0].feedback.split(', ')
        if (feedBack[0] == '0') {
            Swal.fire({
                title: 'NO feedback yet !!',
                icon: 'info'
            })
            return
        }
        let variables
        let card = ""
        let c = 0
        feedBack.forEach(element => {
            variables = element.split('-')
            if (variables[2] == 'AUTO_LOGIN' && c === 0) {
                card += `<div class="col">
                <div class="card">
                <a class="size">
                <img src="../../assets/images/process_result/AUTO.png" class="card-img-top" alt="feedback">
                </a>
                <div class="card-body">
                    <h5 class="card-title">login</h5>
                    <p class="card-text">${variables[0]}@gmail.com</p>
                </div>
                </div>
            </div>`
                c++
            } else if (variables[2] != 'AUTO_LOGIN') {
                card += `<div class="col">
                <div class="card">
                <a class="size">
                <img src="../../assets/images/process_result/${element}" class="card-img-top" alt="feedback">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${variables[2]}</h5>
                    <p class="card-text">${variables[0]}@gmail.com</p>
                </div>
                </div>
            </div>`
            }
        });
        $('.feedback').html(card)
        $('#Refresh').data('id', id)
        $('#Refresh').data('id_process', id_process)
        $('#modal-result-view').modal('show')
    })
})

$(document).on('click', '#Refresh', event => {
    $('#Refresh').html(`<div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading</span></div>`)
    let id = $(event.target).data('id')
    let id_process = $(event.target).data('id_process')
    fetch(`http://${ip}:3000/result/feedback/${id}?id_process=${id_process}`).then(response => {
        return response.json()
    }).then(data => {
        if (data.length == 0) {
            Swal.fire({
                title: 'NO feedback yet !!',
                icon: 'info'
            })
            return
        }
        let feedBack = data[0].feedback.split(', ')
        if (feedBack[0] == '0') {
            Swal.fire({
                title: 'NO feedback yet !!',
                icon: 'info'
            })
            return
        }
        let variables
        let card = ""
        feedBack.forEach(element => {
            variables = element.split('-')
            if (variables[2] == 'AUTO_LOGIN') {
                card += `<div class="col">
                <div class="card">
                <a class="size">
                <img src="../../assets/images/process_result/AUTO.png" class="card-img-top" alt="feedback">
                </a>
                <div class="card-body">
                    <h5 class="card-title">login</h5>
                    <p class="card-text">${variables[0]}@gmail.com</p>
                </div>
                </div>
            </div>`
            } else {
                card += `<div class="col">
                <div class="card">
                <a class="size">
                <img src="../../assets/images/process_result/${element}" class="card-img-top" alt="feedback">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${variables[2]}</h5>
                    <p class="card-text">${variables[0]}@gmail.com</p>
                </div>
                </div>
            </div>`
            }
        });
        $('.feedback').html(card)
        $('#Refresh').html('Refresh')
        $('#Refresh').data('id', id)
        $('#Refresh').data('id_process', id_process)
    })
})

$(document).on('click', '.size', event => {
    let img = $(event.target).contents().prevObject[0]
    const fullPage = document.querySelector('#fullpage');
    // fullPage.style.backgroundImage = 'url(' + img.src + ')';
    $('#feedback-img').prop('src', `${img.src}`)
    fullPage.style.display = 'flex';
})

function randomRange(myMin, myMax) {
    return Math.floor(
        Math.random() * (Math.ceil(myMax) - Math.floor(myMin) + 1) + myMin
    );
}

$(document).on('click', '.stop', event => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'black',
        confirmButtonText: 'Yes, restart it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let id = $(event.target).data('id')
            const status = "STOPPED"
            let end_in = new Date()
            let obj = {
                id_process: `${id}`,
                end_in: end_in,
                status: `${status}`,
            }
            let socketState = websocket_s.readyState
            if (socketState !== websocket_s.CLOSED) {
                websocket_s.send(JSON.stringify({ request: "reset", id_process: id, data: obj }))
            } else {
                swal.fire({
                    title: 'connection lost !',
                    text: 'it\'s looks like your connection is off reload page',
                    icon: 'warning',
                    confirmButtonText: 'reload page',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                }).then(result => {
                    if (result.isConfirmed) {
                        location.reload()
                    }
                })
            }
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

var h1 = document.getElementsByTagName('q')[0];
var sec = 0;
var min = 0;
var hrs = 0;
var t;

function tick() {
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hrs++;
        }
    }
}

function add() {
    tick();
    h1.textContent = (hrs > 9 ? hrs : "0" + hrs)
        + ":" + (min > 9 ? min : "0" + min)
        + ":" + (sec > 9 ? sec : "0" + sec);
    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

$(document).on('click', '.why', () => {
    let modal = `<div class="modal fade why-info" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Why we restart</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <h6>By clicking on "Restart App" :</h6>
        <ol>
        <li>we clean the browser</li>
        <li>we stop all the running compose</li>
        <li>we remove all existing compose</li>
        <li>Get better performance for the app</li>
        </ol>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>`
    $('footer').after(modal)
    Swal.close()
    $('.why-info').modal('show')
})

$(document).on('hide.bs.modal', '.why-info', () => {
    $('.why-info').remove()
})

$(document).on('click', '#restart_s', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this!`,
        html:
            `<button class="btn btn-info why">why we do restarting</button>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'black',
        confirmButtonText: 'Yes, Restart app!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { value: formValues } = await Swal.fire({
                title: "Login",
                confirmButtonColor: 'black',
                html: `<input id="swal-input1" class="swal2-input" placeHolder="enter your login">`,
                focusConfirm: false,
                preConfirm: () => {
                    let login = document.getElementById("swal-input1").value
                    return { login: login }
                }
            });
            if (formValues) {
                if (formValues.login == "") {
                    Swal.fire("empty values was provided, operation canalled");
                    return
                }
                if (formValues.login != user.login) {
                    Swal.fire("Invalid login, operation canalled");
                    return
                }
                let socketState = websocket_s.readyState
                if (socketState !== websocket_s.CLOSED) {
                    websocket_s.send(JSON.stringify({ request: "restart", login: formValues.login }))
                    $('#restart').modal('show')
                    timer()
                } else {
                    swal.fire({
                        title: 'connection lost !',
                        text: 'it\'s looks like your connection is off reload page',
                        icon: 'warning',
                        confirmButtonText: 'reload page',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                    }).then(result => {
                        if (result.isConfirmed) {
                            location.reload()
                        }
                    })
                }
            }
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

const editActions = (data) => {
    console.log(data);
    var settings = {
        "url": `http://${ip}:3000/compose/actions/${data.id_process}`,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "actions": `${data.actions}`
        }),
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        $('#edit_action').modal('hide')
        swal.fire({
            title: response,
            icon: 'success'
        })
        getDataCompose.ajax.reload(null, false)
    });
}

$(document).on('click', '#p_a_add', event => {
    let id = $(event.target).data('id')
    let selected = $('.actions input:checked')
    if (selected.length == 0) {
        swal.fire({
            title: 'NO action selected',
            icon: 'error'
        })
        return
    }
    let valueSelect = []
    for (let i = 0; i < selected.length; i++) {
        valueSelect.push(selected[i].value)
    }
    let data = {
        id_process: `${id}`,
        actions: `${valueSelect}`
    }
    editActions(data)
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
    let check = $("#Process_data input:checked")
    let allCheck = $("#Process_data input:checkbox")
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
            let check = $("#Process_data input:checked")
            const ides = []
            for (let i = 0; i < check.length; i++) {
                let ID = check[i].value
                let action = $(check[i]).data('val')
                ides.push({ id: ID, action: action, login: user.login })
            }
            fetch(`http://${ip}:3000/compose/`, {
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
                getDataCompose.ajax.reload(null, false)
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

/**
 * ~check options  
 * ! others :
 */

// verify
$('#btn-check-verify').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.actions .btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
        $('.send_message').addClass('d-none');
    }
})

// check proxy
$('#btn-check-proxy').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.actions .btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
        $('.send_message').addClass('d-none');

    }
})

// compose
$('#btn-check-compose').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.actions .btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
        $('.send_message').removeClass('d-none');
    } else {
        $('.send_message').addClass('d-none');
    }
})

const data = $('#edit_offers').DataTable({
    responsive: true,
    deferRender: true,
    destroy: true,
    autoWidth: false,
    ajax: {
        url: `http://${ip}:3000/compose/offers`,
        dataSrc: '',
    },
    columns: [
        {
            data: 'file',
        },
        {
            data: null,
            render: (row) => {
                return `<button type="button" class="btn btn-danger delete_offer" data-offer="${row.file}"><i class="far fa-trash-alt"></i></button>`
            }
        },
    ]
})

$(document).on('click', '.manage_offers', () => {
    data.ajax.reload(null, false)
    $('.edit_offers').modal('show')
})

$(document).on('click', '.delete_offer', event => {
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
            let offer = $(event.target).data('offer')
            console.log(offer);
            fetch(`http://${ip}:3000/compose/offer/${offer}`, {
                method: "DELETE",
            }).then(res => {
                return res.text()
            }).then(() => {
                data.ajax.reload(null, false)
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

$(document).on('hide.bs.modal', '.edit_offers', () => {
    const offersAdd = document.querySelector("#p_offers_add");
    offersAdd.innerHTML = ''
    fetch(`http://${ip}:3000/compose/offers`, {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.length == 0) {
            let option = document.createElement("option");
            option.innerHTML = `No available offers`
            option.setAttribute("value", '');
            offersAdd.appendChild(option);
        } else {
            let option = document.createElement("option");
            option.innerHTML = `--SELECT OFFER--`
            option.setAttribute("value", '');
            offersAdd.appendChild(option);
            data.forEach((elm) => {
                let option = document.createElement("option");
                option.innerHTML = `${elm['file']}`
                option.setAttribute("value", elm['file']);
                offersAdd.appendChild(option);
            });
        }
    })
})



