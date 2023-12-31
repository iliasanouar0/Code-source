const user = JSON.parse(sessionStorage.user);
const wssUri = `ws://${ip}:7073/wss?id=${user.id_user}`;
const websocket_s = new WebSocket(wssUri);

websocket_s.onmessage = (event) => {
    let data = event.data
    console.log(data);
    switch (data) {
        case 'reload':
            $('body .tooltip').removeClass('show');
            getData.ajax.reload(null, false)
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

$(document).on("click", "#add_process", () => {
    $(".add_process").modal("show");
});

$(document).ready(function () {
    $("#p_update_date").val(new Date().toDateString())
    $("#p_add_date").val(new Date().toDateInputValue());
    $(".update").val(new Date().toDateInputValue());
});

$(document).on('click', '.edit', event => {
    let id = $(event.target).data('id')
    $('#edit_action').modal('show')
    $('#p_a_add').data('id', id)
})

const addProcess = data => {
    fetch(`http://${ip}:3000/process/`, {
        method: 'POST',
        body: `${JSON.stringify(data)}`,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    }).then(response => {
        return response.text()
    }).then(data => {
        Swal.fire({
            title: data,
            timer: 1500,
            showConfirmButton: false,
            icon: 'success'
        }).then(() => {
            $('.add_process input:text').val('')
            $('.add_process input:checkbox').prop("checked", false)
            $(".add_process").modal("hide");
            getData.ajax.reload(null, false)
        })
    })
}

$(document).on('click', "#p_add", () => {
    let p_max_open = $('#max_open').val()
    let p_subject = $('#p_subject').val()
    let p_max_pages = $("#max_pages").val()
    let p_list_add = $('#p_list_add').val()
    let p_status = $('#p_status').val()
    let p_add_date = new Date().toLocaleString();
    let p_update_date = new Date().toLocaleString();
    let selected = $('.actions input:checked')
    let login_selected = $('.login_options input:checked').val()
    console.log(login_selected);
    if (p_list_add == "" || p_status == "" || p_add_date == "" || p_update_date == "" || selected.length == 0 || login_selected == undefined) {
        Swal.fire('Please fill all fields')
        return
    }

    let valueSelect = []
    let selected_spam = $('.spam input:checked')
    let selected_inbox = $('.inbox input:checked')
    let selected_other = $('.others input:checked')

    if (selected_spam != 0) {
        for (let i = 0; i < selected_spam.length; i++) {
            valueSelect.push(selected_spam[i].value)
        }
    }

    if (selected_inbox != 0) {
        for (let i = 0; i < selected_inbox.length; i++) {
            valueSelect.push(selected_inbox[i].value)
        }
    }

    if (selected_other != 0) {
        for (let i = 0; i < selected_other.length; i++) {
            valueSelect.push(selected_other[i].value)
        }
    }

    let action = `${valueSelect}`

    if (p_subject != "") {
        action += `,subject:${p_subject}`
    }

    if (p_max_pages > 1) {
        action += `,pages:${p_max_pages}`
    }

    if (p_max_open != '' || p_max_open != 0) {
        action += `,count:${p_max_open}`
    }

    action += `,option:${login_selected}`

    const data = {
        "name": `test`,
        "action": action,
        "status": `${p_status}`,
        "date_add": `${p_add_date}`,
        "date_update": `${p_update_date}`,
        "id_user": `${userData['id_user']}`,
        "id_list": `${p_list_add}`
    };
    addProcess(data)
});

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
            getData.ajax.reload(null, false)
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
            url: `http://${ip}:3000/process/seeds/${id}`,
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
                    return `${row.statusdetails}`
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
        order: [[3, 'asc']]
    })

    $('#modal-process-view').modal('show')
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
        $('#modal-process-view').modal('hide')
    })
    $('#modal-process-view').on('hide.bs.modal', () => {
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
        <li>we stop all the running process</li>
        <li>we remove all existing process</li>
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
        "url": `http://${ip}:3000/process/actions/${data.id_process}`,
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
        getData.ajax.reload(null, false)
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
            fetch(`http://${ip}:3000/process/`, {
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
                getData.ajax.reload(null, false)
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
 * ! inbox :
 */

// open 
$('#btn-check-open').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (!status) {
        $('#btn-check-verify').prop("checked", false);
        $('#btn-check-proxy').prop("checked", false);
        $('#btn-check-m-imp').prop("checked", false);
        $('#btn-check-m-started').prop("checked", false);
        $('#btn-check-c-link').prop("checked", false);
        $('#btn-check-du-inbox').prop("checked", false);
        $('#btn-check-dr-inbox').prop("checked", false);
    } else {
        $('#btn-check-verify').prop("checked", false);
        $('#btn-check-proxy').prop("checked", false);
        $('#btn-check-du-inbox').prop("checked", false);
        $('#btn-check-dr-inbox').prop("checked", false);
        $('#btn-check-m-read').prop("checked", false);
        $('#btn-check-m-unread').prop("checked", false);
        $('#btn-check-m-spam').prop("checked", false);
        $('#btn-check-m-archive').prop("checked", false);
    }
})

// mark as important
$('#btn-check-m-imp').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('#btn-check-open').prop("checked", true);
        $('#btn-check-verify').prop("checked", false);
        $('#btn-check-proxy').prop("checked", false);
        $('#btn-check-du-inbox').prop("checked", false);
        $('#btn-check-dr-inbox').prop("checked", false);
    }
})

// mark as started
$('#btn-check-m-started').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('#btn-check-open').prop("checked", true);
        $('#btn-check-verify').prop("checked", false);
        $('#btn-check-proxy').prop("checked", false);
        $('#btn-check-du-inbox').prop("checked", false);
        $('#btn-check-dr-inbox').prop("checked", false);
    }
})

// click inbox
$('#btn-check-c-link').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('#btn-check-open').prop("checked", true);
        $('#btn-check-verify').prop("checked", false);
        $('#btn-check-proxy').prop("checked", false);
        $('#btn-check-du-inbox').prop("checked", false);
        $('#btn-check-dr-inbox').prop("checked", false);
    }
})

// delete unread
$('#btn-check-du-inbox').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// delete read
$('#btn-check-dr-inbox').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// mark as read
$('#btn-check-m-read').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// mark as unread
$('#btn-check-m-unread').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// archive
$('#btn-check-m-archive').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// mark as spam
$('#btn-check-m-spam').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

/**
 * ~check options  
 * ! spam :
 */

// Open spam
$('#btn-check-o-spam').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (!status) {
        $('#btn-check-c-spam').prop("checked", false);
        $('#btn-check-verify').prop("checked", false);
        $('#btn-check-proxy').prop("checked", false);
        $('#btn-check-du-inbox').prop("checked", false);
        $('#btn-check-dr-inbox').prop("checked", false);
    } else {
        $('#btn-check-verify').prop("checked", false);
        $('#btn-check-proxy').prop("checked", false);
    }
})

// click spam
$('#btn-check-c-spam').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('#btn-check-o-spam').prop("checked", true);
        $('#btn-check-verify').prop("checked", false);
        $('#btn-check-proxy').prop("checked", false);
        $('#btn-check-du-inbox').prop("checked", false);
        $('#btn-check-dr-inbox').prop("checked", false);
    }
})

// delete spam
$('#btn-check-d-spam').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.spam .btn-check').prop("checked", false);
        $('.others .btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// move to inbox
$('#btn-check-n-spam').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.spam .btn-check').prop("checked", false);
        $('.others .btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// open bulk
$('#btn-check-ob-spam').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.spam .btn-check').prop("checked", false);
        $('.others .btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// move to inbox open
$('#btn-check-no-spam').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.spam .btn-check').prop("checked", false);
        $('.others .btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

/**
 * ~check options  
 * ! others :
 */

// verify
$('#btn-check-verify').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})

// check proxy
$('#btn-check-proxy').change(event => {
    let status = $(event.target).is(":checked") ? true : false;
    if (status) {
        $('.btn-check').prop("checked", false);
        $(event.target).prop("checked", true);
    }
})