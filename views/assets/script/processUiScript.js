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

// let storage = { ...localStorage }
// console.log(storage);
// let ip = storage.ip

const Process_data = document.querySelector('#Process_data')

const createRowProcess = data => {
    let rows = []
    data.forEach(element => {
        let tds =
            `<td>${element.id_process}</td>
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
      <button type="button" class="btn btn-success start"  data-id="${element.id_process}"><i class="fas fa-play"></i></button>
      <button type="button" class="btn btn-info edit"  data-id="${element.id_process}"><i class="fas fa-edit"></i></button>
      </td>`
        let tr = document.createElement('tr')
        tr.innerHTML = tds
        rows.push(tr)
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
    console.log(id);
    $(event.target)[0].classList.toggle("stop", true);
    console.log($(event.target)[0]);
    const status = "RUNNING"
    const start_in = new Date().toDateInputValue()
    let obj = {
        id_process: `${id}`,
        status: `${status}`,
        start_in: `${start_in}`,
    }
    fetch(`http://${ip}:3000/process/`, {
        method: 'PUT',
        body: `${JSON.stringify(obj)}`,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    }).then(resp => {
        return resp.text()
    }).then(data => {
        Swal.fire({
            title: data,
            timer: 1500,
            showConfirmButton: false,
            icon: 'success'
        })
    }).then(() => {
        const Process_data = document.querySelector('#Process_data')
        // Process_data.innerHTML = ""
        fetch(`http://${ip}:3000/process/admin`, {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let rows = createRowProcess(data);
                rows.forEach((row) => {
                    Process_data.appendChild(row);
                });
            })
    })
})
