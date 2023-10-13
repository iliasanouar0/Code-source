
Date.prototype.toDateInputValue = function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
};

$(document).ready(function () {
    $("#p_update_date").val(new Date().toDateString())
    $("#p_add_date").val(new Date().toDateInputValue());
    $(".update").val(new Date().toDateInputValue());
});

const Process_data = document.querySelector('#Process_data')

// const createRowProcess = data => {
//     let rows = []
//     data.forEach(element => {
//         let tds =
//             `<td>${element.id_process}</td>
//       <td>${element.count}</td>
//       <td>${element.f_name} ${element.l_name}</td>
//       <td>${element.list_name}</td>
//       <td>${element.isp}</td>
//       <td>${element.status}</td>
//       <td>${element.action}</td>
//       <td>${element.start_in}</td>
//       <td class="text-center">${element.end_in}</td>
//       <td>
//       <button type="button" class="btn btn-primary status" data-id="${element.id_process}"><i class="far fa-eye"></i></button>
//       <button type="button" class="btn btn-success start"  data-id="${element.id_process}"><i class="fas fa-play"></i></button>
//       <button type="button" class="btn btn-info edit"  data-id="${element.id_process}"><i class="fas fa-edit"></i></button>
//       </td>`
//         let tr = document.createElement('tr')
//         tr.innerHTML = tds
//         rows.push(tr)
//     });
//     return rows
// }

const createRowProcess = data => {
    let rows = ""
    data.forEach(element => {
        if (element.status == "RUNNING") {
            let tr =
                `<tr><td>${element.id_process}</td>
          <td>${element.count}</td>
          <td>${element.f_name} ${element.l_name}</td>
          <td>${element.list_name}</td>
          <td>${element.isp}</td>
          <td>${element.status}</td>
          <td>${element.action}</td>
          <td>${element.start_in}</td>
          <td class="text-center">${element.end_in}</td>
          <td>
          <button type="button" class="btn btn-primary status" data-id="${element.id_process}"><i class="far fa-eye"></i></button>
          <button type="button" class="btn btn-danger stop"  data-id="${element.id_process}"><i class="fa fa-stop"></i></button>
          <button type="button" class="btn btn-info edit"  data-id="${element.id_process}"><i class="fas fa-edit"></i></button>
          </td></tr>`
            rows += tr
        } else {
            let tr =
                `<tr><td>${element.id_process}</td>
      <td>${element.count}</td>
      <td>${element.f_name} ${element.l_name}</td>
      <td>${element.list_name}</td>
      <td>${element.isp}</td>
      <td>${element.status}</td>
      <td>${element.action}</td>
      <td>${element.start_in}</td>
      <td class="text-center">${element.end_in}</td>
      <td>
      <button type="button" class="btn btn-primary status" data-id="${element.id_process}"><i class="far fa-eye"></i></button>
      <button type="button" class="btn btn-success start"  data-id="${element.id_process}"><i class="fa fa-play"></i></button>
      <button type="button" class="btn btn-info edit"  data-id="${element.id_process}"><i class="fas fa-edit"></i></button>
      </td></tr>`
            rows += tr
        }
    });
    return rows
}

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
            location.reload()
        })
    })
}

$(document).on('click', "#p_add", () => {
    let p_name = $('#p_name').val().toString()
    let p_list_add = $('#p_list_add').val().toString()
    let p_status = $('#p_status').val().toString()
    let p_add_date = $('#p_add_date').val().toString()
    let p_update_date = $('#p_update_date').val().toString()
    let selected = $('.actions input:checked')
    if (p_name == "" || p_list_add == "" || p_status == "" || p_add_date == "" || p_update_date == "" || selected.length == 0) {
        Swal.fire('Please fill all fields')
        return
    }
    let valueSelect = []
    for (let i = 0; i < selected.length; i++) {
        valueSelect.push(selected[i].value)
    }
    const data = {
        "name": `${p_name}`,
        "action": `${valueSelect}`,
        "status": `${p_status}`,
        "date_add": `${p_add_date}`,
        "date_update": `${p_update_date}`,
        "id_user": `${userData['id_user']}`,
        "id_list": `${p_list_add}`
    };
    addProcess(data)
})

$(document).on('click', '.start', event => {
    const id = $(event.target)[0].attributes[2].value
    const status = "RUNNING"
    const start_in = new Date().toDateInputValue()
    let obj = {
        id_process: `${id}`,
        status: `${status}`,
        start_in: `${start_in}`,
    }
    function sendMessage(message, ws) {
        ws.send(message);
    }
    let pingInterval
    const wsUri = `ws://${ip}:7072/wss`;
    const websocket = new WebSocket(wsUri);
    socketUpdate(websocket, sendMessage, obj, pingInterval);
    const wssUri = `ws://${ip}:7073/wss`;
    const websocket_s = new WebSocket(wssUri);
    // fetch(`http://209.170.73.224:3000/process/seeds/${id}`, { method: "GET" }).then(response => {
    //     return response.json()
    // }).then(data => {
    //     websocket_s.onopen = (e) => {
    //         websocket_s.send(data)
    //     }
    //     websocket_s.onmessage = (message) => {
    //         console.log(message);
    //     }
    // })

    let settings = {
        "url": `http://209.170.73.224:3000/process/seeds/${id}`,
        "method": "GET",
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    }
    $.ajax(settings).done(function (responseText) {
        if (websocket_s.OPEN == 1) {
            websocket_s.send(JSON.stringify({ request: "start", data: responseText, id_process: id }))
        }
    })
    websocket_s.onmessage = (event) => {
        console.log(event);
        console.log(event.data);
        let data = JSON.parse(event.data)
        console.log(data);
    }
})

function socketUpdate(websocket, sendMessage, obj, pingInterval) {
    websocket.onopen = (e) => {
        sendMessage(JSON.stringify(obj), websocket);
        const Process_data = document.querySelector('#Process_data');
        fetch(`http://${ip}:3000/process/admin`, {
            method: "GET",
        }).then((response) => {
            return response.json();
        }).then((data) => {
            Process_data.innerHTML = createRowProcess(data)
        }).then(() => {
            websocket.close()
        })
    };
    websocket.onclose = (e) => {
        clearInterval(pingInterval);
    };
    websocket.onerror = (e) => {
        console.log(`ERROR: ${e.data}`);
    };
}

$(document).on('click', '.stop', event => {
    const id = $(event.target)[0].attributes[2].value
    const status = "STOPPED"
    let obj = {
        id_process: `${id}`,
        status: `${status}`,
    }
    let pingInterval
    const wsUri = `ws://${ip}:7072/wss`;
    const websocket = new WebSocket(wsUri);
    function sendMessage(message, ws) {
        ws.send(message);
    }
    socketUpdate(websocket, sendMessage, obj, pingInterval);
})

const createRowProcessSeeds = data => {
    let rows = ""
    data.forEach(element => {
        let tr =
            `<tr>
            <td>${element.gmail}</td>
            <td>${element.proxy}</td>
            <td>${element.isp}</td>
            <td>${element.status}</td>
            <td></td>
            <td>00:00:00</td>
            <td class="text-center">
                <button type="button" class="btn btn-dark details" data-id="${element.id_seeds}"><i class="fas fa-eye"></i></button>
            </td>
      </tr>`
        rows += tr
    });
    return rows
}

$(document).on('click', '.status', event => {
    const id = $(event.target)[0].attributes[2].value
    let children = $(event.target).parent().parent()[0].children
    $('.count').html(children[1].innerHTML)
    if (children[5].innerHTML == "RUNNING") {
        $('.status_bg').removeClass("bg-success bg-danger bg-info")
        $('.status_bg').addClass("badge bg-success")
        $('.status_bg').html(children[5].innerHTML)
    } else if (children[5].innerHTML == "STOPPED") {
        $('.status_bg').removeClass("bg-success bg-danger bg-info")
        $('.status_bg').addClass("badge bg-danger")
        $('.status_bg').html(children[5].innerHTML)
    } else {
        $('.status_bg').removeClass("bg-success bg-danger bg-info")
        $('.status_bg').addClass("badge bg-info")
        $('.status_bg').html(children[5].innerHTML)
    }
    $('#p_s').html(id)
    fetch(`http://209.170.73.224:3000/process/seeds/${id}`, { method: "GET" }).then(response => {
        return response.json()
    }).then(data => {
        $('#pagination-container').pagination({
            dataSource: data,
            pageSize: 10,
            showGoInput: true,
            showGoButton: true,
            showSizeChanger: true,
            showNavigator: true,
            formatNavigator: '<%= rangeStart %>-<%= rangeEnd %> of <%= totalNumber %> items',
            callback: function (data, pagination) {
                var html = createRowProcessSeeds(data);
                $('#seeds_result').html(html);
            }
        })
    }).then(() => {
        $('#modal-process-view').modal('show')
    })
    // const INTERVAL = 2000;
    // const URL = `ws://${ip}:7074/wss`;

    // connect(URL, id);

    const wsUri = `ws://${ip}:7074/wss`;
    const websocket = new WebSocket(wsUri);
    // websocket.onopen = (e) => {
    //     websocket.send(`${id}`)
    // }
    let pingInterval
    websocket.onopen = (e) => {
        websocket.send(`${id}`)
        console.log(`send : ${id}`);
        pingInterval = setInterval(async () => {
            websocket.send(`${id}`)
            console.log(`send : ${id}`);
        }, randomRange(500, 2000));
    }
    websocket.onmessage = function (event) {
        let data = JSON.parse(event.data)
        console.log(data);
        $('.w_seeds').html(data[0].waiting)
        $('.a_seeds').html(data[0].active)
        $('.f_seeds').html(data[0].finished)
        $('.ff_seeds').html(data[0].failed)
    };
    websocket.onclose = () => {
        alert('closed')
    }
    if ($('#modal-process-view').modal('hide') == true) {
        websocket.close()
    }
})

function randomRange(myMin, myMax) {
    return Math.floor(
        Math.random() * (Math.ceil(myMax) - Math.floor(myMin) + 1) + myMin
    );
}
// function connect(addr, id) {
//     let connection = new WebSocket(addr);
//     connection.onopen = function () {
//         connection.send(`${id}`)
//     };
//     connection.onmessage = function (event) {
//         let data = JSON.parse(event.data)
//         console.log(data);
//         $('.w_seeds').html(data[0].waiting)
//         $('.a_seeds').html(data[0].active)
//         $('.f_seeds').html(data[0].finished)
//         $('.ff_seeds').html(data[0].failed)
//         connection.close();
//         setTimeout(function () { connect(addr, id); }, 2000);
//     };

// }