
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

    const wssUri = `ws://${ip}:7073/wss`;
    const websocket_s = new WebSocket(wssUri);

    websocket_s.onopen = (e) => {
        websocket_s.send(JSON.stringify({ request: "start", id_process: id, data: obj }))
        getData()
    }
    websocket_s.onmessage = (event) => {
        let data = event.data
        console.log(data);
        if (data == 'reload') {
            getData()
        }
    }
})


$(document).on('click', '.pause', event => {
    const id = $(event.target)[0].attributes[2].value
    const status = "PAUSED"
    let obj = {
        id_process: `${id}`,
        status: `${status}`,
    }
    const wssUri = `ws://${ip}:7073/wss`;
    const websocket_s = new WebSocket(wssUri);

    websocket_s.onopen = (e) => {
        websocket_s.send(JSON.stringify({ request: "pause", id_process: id, data: obj }))
    }

    websocket_s.onmessage = (event) => {
        let data = event.data
        if (data == 'reload') {
            getData()
        }
    }
})

$(document).on('click', '.resume', event => {
    const id = $(event.target)[0].attributes[2].value
    const status = "RUNNING"
    let obj = {
        id_process: `${id}`,
        status: `${status}`,
    }

    const wssUri = `ws://${ip}:7073/wss`;
    const websocket_s = new WebSocket(wssUri);

    websocket_s.onopen = (e) => {
        websocket_s.send(JSON.stringify({ request: "resume", id_process: id, data: obj }))
    }

    websocket_s.onmessage = (event) => {
        let data = event.data
        if (data == 'reload') {
            getData()
        }
    }
})

function msToMnSc(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return (
        seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
}


const createRowProcessSeeds = data => {
    let duration
    let status
    let rows = ""
    data.forEach(element => {
        if (element.start_in == null || element.end_in == '0') {
            duration = '00:00:00'
        } else {
            let start = new Date(element.start_in)
            let end = new Date(element.end_in)
            duration = msToMnSc(end - start)
        }
        if (element.status == 'running') {
            status = '<img src="../../assets/images/loader/load.gif" alt="loader" width="30px">'
        } else {
            status = element.status
        }
        let tr =
            `<tr>
            <td>${element.gmail}</td>
            <td>${element.proxy}</td>
            <td>${element.isp}</td>
            <td  class="text-center">${status}</td>
            <td></td>
            <td>${duration}</td>
            <td class="text-center">
                <button type="button" class="btn btn-dark details" data-id="${element.id_seeds}"><i class="fas fa-eye"></i></button>
            </td>
      </tr>`
        rows += tr
    });
    return rows
}

function getPages(totalPages, currentPage) {
    if (totalPages <= 5) return Array.from(Array(totalPages).keys()).map(r => { return r + 1 });
    let diff = 0;
    const result = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    if (result[0] < 3) {
        diff = 1 - result[0];
    }
    if (result.slice(-1) > totalPages - 2) {
        diff = totalPages - result.slice(-1);
    }
    return result.map(r => { return r + diff });
}
let cPage
let max = 10
$(document).on('click', '.status', event => {
    let id = $(event.target)[0].attributes[2].value
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
    fetch(`http://${ip}:3000/process/seeds/${id}?offset=0`, { method: "GET" }).then(response => {
        return response.json()
    }).then(data => {
        var html = createRowProcessSeeds(data);
        $('#seeds_result').html(html);
    }).then(() => {
        $('#modal-process-view').modal('show')
    })
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
            $('.w_seeds').html(data[0].waiting)
            $('.a_seeds').html(data[0].active)
            $('.f_seeds').html(data[0].finished)
            $('.ff_seeds').html(data[0].failed)
            let endIndex = cPage * max
            let startIndex = endIndex - max
            fetch(`http://209.170.73.224:3000/process/seeds/${id}?offset=${startIndex}`, { method: "GET" }).then(response => {
                return response.json()
            }).then(data => {
                pagination(id, cPage)
                var html = createRowProcessSeeds(data);
                $('#seeds_result').html(html);
            })
        }
    };
    websocket.onclose = () => {
        console.log('closed');
    }
    // ~~ pagination
    cPage = 1
    pagination(id, cPage)
    $('.page-item').on('click', async () => {
        console.log('page');
    })
    $('.btn-close').on('click', () => {
        cPage = 1
        $('#modal-process-view').modal('hide')
        websocket.close()
    })
})

$(document).on('click', '.seeds-page', event => {
    let max = 10
    let page = $(event.target).data('page')
    let id = $(event.target).data('id')
    cPage = page
    let endIndex = cPage * max
    let startIndex = endIndex - max
    fetch(`http://${ip}:3000/process/seeds/${id}?offset=${startIndex}`, { method: "GET" }).then(response => {
        return response.json()
    }).then(data => {
        pagination(id, cPage)
        var html = createRowProcessSeeds(data);
        $('#seeds_result').html(html);
    })
})

const pagination = (id, cPage) => {
    let pages
    let max = 10
    let pageNum = 0
    let list = ""
    fetch(`http://${ip}:3000/process/page/${id}`, { method: "GET" }).then(response => {
        return response.text()
    }).then(data => {
        return pageNum = (data % max) == 0 ? data / max : Math.ceil(data / max)
    }).then(() => {
        pages = getPages(pageNum, cPage)
        if (cPage == 1) {
            list += `<li class="page-item disabled"><a class="page-link">First</a></li>`
        } else {
            list += `<li class="page-item"><a class="page-link seeds-page" data-page="${1}" data-id="${id}"  >First</a></li>`
        }
        if (cPage == 1 || cPage == 2 || cPage == 3) {
            list += `<li class="page-item disabled"><a class="page-link">Previous</a></li>`
        } else {
            list += `<li class="page-item"><a class="page-link seeds-page" data-page="${cPage - 1}"data-id="${id}" >Previous</a></li>`
        }
        for (let i = 0; i < pages.length; i++) {
            if (pages[i] == cPage) {
                list += `<li class="page-item active"><a class="page-link seeds-page" data-page="${pages[i]}" data-id="${id}">${pages[i]}</a></li>`
            } else {
                list += `<li class="page-item"><a class="page-link seeds-page" data-page="${pages[i]}"data-id="${id}" >${pages[i]}</a></li>`
            }
        }
        if (cPage == pageNum) {
            list += `<li class="page-item disabled"><a class="page-link">next</a></li>`
            list += `<li class="page-item disabled"><a class="page-link">Last</a></li>`
        } else {
            list += `<li class="page-item"><a class="page-link seeds-page" data-page="${cPage + 1}" data-id="${id}">next</a></li>`
            list += `<li class="page-item"><a class="page-link seeds-page" data-page="${pageNum}" data-id="${id}">Last</a></li>`
        }
        $('.seeds-pagination').html(list)
    })
}

$(document).on('click', '.details', event => {
    let id = $(event.target).data('id')
    fetch(`http://${ip}:3000/result/feedback/${id}`).then(response => {
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
        });
        $('.feedback').html(card)
        $('#modal-result-view').modal('show')
    })
})

$(document).on('click', '.size', event => {
    let img = $(event.target).contents().prevObject[0]
    const fullPage = document.querySelector('#fullpage');
    fullPage.style.backgroundImage = 'url(' + img.src + ')';
    fullPage.style.display = 'block';
})
function randomRange(myMin, myMax) {
    return Math.floor(
        Math.random() * (Math.ceil(myMax) - Math.floor(myMin) + 1) + myMin
    );
}

$(document).on('click', '.stop', event => {
    let id = $(event.target).data('id')
    const status = "STOPPED"
    let obj = {
        id_process: `${id}`,
        start_in: null,
        end_in: null,
        status: `${status}`,
    }

    const wssUri = `ws://${ip}:7073/wss`;
    const websocket_s = new WebSocket(wssUri);

    websocket_s.onopen = (e) => {
        websocket_s.send(JSON.stringify({ request: "reset", id_process: id, data: obj }))
    }

    websocket_s.onmessage = (event) => {
        let data = event.data
        if (data == 'reload') {
            getData()
        }
    }
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
        getData()
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