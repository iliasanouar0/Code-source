// const userData = JSON.parse(sessionStorage.user);
Date.prototype.toDateInputValue = function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
};

$(document).ready(function () {
    $("#e_update_date").val(new Date().toDateString())
    $("#e_add_date").val(new Date().toDateInputValue());
    $(".update").val(new Date().toDateInputValue());
});

$(document).on('click', '.add_seeds', event => {
    let id = $(event.target).data('id')
    $('#l_seeds_add').data('id', id)
    $('.bulk').data('id', id)
    $(".add_seeds_md").modal('show')
})

$(document).on('click', '.bulk', event => {
    $('.add_seeds_md').modal('hide');
    $('#modal-bulk-add').modal('show');
    let data = $(event.target).data('id')
    $('.preview').data("id", data)
})

$(document).on('click', '.switch_inp', () => {
    $('.input_way, .text_way').toggle(200)
    $('.switch_inp i').toggleClass(`fa-keyboard fa-list`)
})

$(document).on('click', "#info", () => {
    $('#info_bulk_update').modal('show')
})

$(document).on('click', '.updateOptions', event => {
    $('.submit_proxy')[0].dataset.id = $(event.target)[0].dataset.id
    $('.submit_proxy').val('Submit')
    $('.submit_bulk_edit')[0].dataset.id = $(event.target)[0].dataset.id
    $('.submit_bulk_edit').val('Submit')
    $('.list_s_u').html($(event.target)[0].dataset.id)
    $('#updateOptions').modal('show');
})

$(document).on('click', '#add_list', () => {
    $('.add_list').modal('show');
})

$(document).ready(function () {
    $('#l_add_date').val(new Date().toDateInputValue());
    $('.update').val(new Date().toDateInputValue());
});

$(".checkAll").change(function () {
    let status = $(this).is(":checked") ? true : false;
    $(".check").prop("checked", status);
    if (status) {
        let action = `<button type="button" class="btn btn-danger delete-all-this"><i class="far fa-trash-alt"></i></button>`
        $('#action').html(action)
    } else {
        $('#action').html('action')
    }
});

$(document).on('click', '.check', () => {
    let check = $("#list_data input:checked")
    let allCheck = $("#list_data input:checkbox")
    if (check.length > 0) {
        let action = `<button type="button" class="btn btn-danger delete-all-this"><i class="far fa-trash-alt"></i></button>`
        $('#action').html(action)
    } else {
        $('#action').html('Action')
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
            let check = $("#list_data input:checked")
            for (let i = 0; i < check.length; i++) {
                let ID = check[i].value
                fetch(`http://${ip}:3000/lists/${ID}`, {
                    method: "DELETE",
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
                        position: 'top-end',
                        icon: 'success',
                        title: data,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }).then(() => {
                    $('#action').html('Action')
                    getDatalist.ajax.reload(null, false)
                })
            }
        } else if (result.isDismissed) {
            console.log("cancelled");
        }
    })
})

const addList = (data) => {
    let settings = {
        "url": `http://${ip}:3000/lists`,
        "method": "POST",
        "timeout": 0,
        "data": JSON.stringify(data),
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    };

    $.ajax(settings).done(function (responseText) {
        Swal.fire({
            title: 'list added successfully!',
            text: responseText,
            icon: 'success',
            confirmButtonText: 'ok'
        }).then(() => {
            $('.add_list input').val('');
            $('.add_list').modal('hide');
            getDatalist.ajax.reload(null, false)
        })
    });
}

$(document).on('click', '.edit', event => {
    let children = $(event.target).parent().parent()[0].children
    let td = children[1].children[0].children[0]
    let name = td.innerText
    td.innerHTML = `<input type="text" class="form-control" id="list_new_name" value="${name}"/>`
    $(event.target).html('<i class="fas fa-check"></i>')
    $(event.target).toggleClass('save edit')
    let btn = document.createElement('button')
    btn.classList.add('cancel_name_update', 'btn', 'btn-secondary')
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.type = 'button'
    $(event.target).parent()[0].appendChild(btn)
    $('.add_seeds').prop("disabled", true);
    $('.view').prop("disabled", true);
    $('.edit').prop("disabled", true);
})

$(document).on('click', '.save', event => {
    let id = $(event.target).data('id')
    let name = $('#list_new_name').val()
    let settings = {
        "url": `http://${ip}:3000/lists/${id}?name=${name}`,
        "method": "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    }
    $.ajax(settings).done(function (responseText) {
        Swal.fire({
            title: 'list updated successfully!',
            text: responseText,
            icon: 'success',
            confirmButtonText: 'ok'
        })
    }).then(() => {
        getDatalist.ajax.reload(null, false)
    })
})

const addSeeds = (data) => {
    let settings = {
        "url": `http://${ip}:3000/seeds`,
        "method": "POST",
        "timeout": 0,
        "data": JSON.stringify(data),
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    };
    $.ajax(settings).done(function (responseText) {
        if (responseText.includes('already exists')) {
            Swal.fire({
                title: 'Duplicated!',
                text: responseText,
                icon: 'error',
                confirmButtonText: 'ok'
            })
        } else {
            $('#FormControlTextarea').val('');
            $('#modal-preview-data').modal('hide')
            $(".add_seeds_md").modal('hide')
            Swal.fire({
                title: 'seeds added successfully!',
                text: responseText,
                icon: 'success',
                confirmButtonText: 'ok'
            }).then(() => {
                $('#demo').val('')
                getDatalist.ajax.reload(null, false)
            })
        }
    });
    // })
}

$(document).on('click', "#l_add", () => {
    let e_name = $('#la_name').val()
    let e_add_date = $('#l_add_date').val()
    let e_update_date = $('#l_update_date').val()
    let l_isp_add = $('#l_isp_add').val()
    if (e_name == "" || e_add_date == "" || e_update_date == "" || l_isp_add == "") {
        Swal.fire('Please fill all fields')
        return
    }
    const data = {
        "nom": `${e_name}`,
        "isp": `${l_isp_add}`,
        "status": `active`,
        "date_add": `${e_add_date}`,
        "date_update": `${e_update_date}`,
        "id_user": `${userData.id_user}`,
        "count": `0`
    };
    addList(data)
})

$(document).on('click', '#l_seeds_add', event => {
    let listId = $(event.target).data('id')
    let data = $('#FormControlTextarea').val();
    if (data == '') {
        Swal.fire('no data provided')
        return
    }
    let seeds = []
    let obj = []
    let settings = {
        "url": `http://${ip}:3000/lists/isp/${listId}`,
        "method": "GET",
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    };
    $.ajax(settings).done(function (responseText) {
        let isp = responseText.isp
        let dataArray = data.split(`\n`);
        for (let i = 0; i < dataArray.length; i++) {
            let clean = dataArray[i].split(',')
            seeds.push(clean)
        }
        let date_add = new Date().toDateInputValue()
        let date_update = new Date().toDateInputValue()
        seeds.forEach(one => {
            let seed = {
                "email": `${one[0].toLowerCase()}`,
                "password": `${one[1]}`,
                "proxy": `${one[2]}`,
                "verification": `${one[3]}`,
                "id_list": `${listId}`,
                "date_add": `${date_add}`,
                "date_update": `${date_update}`,
                "status": `active`,
                "isp": `${isp}`
            }
            obj.push(seed)
        })
        addSeeds(obj)
    })

})

$('#modal-bulk-add').on('hide.bs.modal', () => {
    let progress = document.querySelector('.progress-bar')
    let btn = document.querySelector('.preview')
    btn.style.display = 'none'
    $('#modal-bulk-add input').val('');
    progress.style.width = '0%'
    progress.innerHTML = '0%'
})

document.getElementById("demo").onchange = evt => {
    var reader = new FileReader();
    reader.addEventListener("loadend", evt => {
        const progress = document.querySelector('.progress-bar')
        var workbook = XLSX.read(evt.target.result, { type: "binary" }),
            worksheet = workbook.Sheets[workbook.SheetNames[0]],
            range = XLSX.utils.decode_range(worksheet["!ref"]);
        console.log(range.s.r);
        console.log(range.e.r);
        let progression = (100 / (range.e.r))
        var data = [];
        let noData = false
        for (let row = range.s.r; row <= range.e.r; row++) {
            if (noData) {
                progress.style.width = '100%'
                progress.innerHTML = '100%'
                break
            }
            let i = data.length;
            let currentWidth = row * progression
            progress.style.width = `${currentWidth}%`
            progress.innerHTML = `${currentWidth}%`
            data.push([]);
            for (let col = range.s.c; col <= range.e.c; col++) {
                let cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
                if (cell != undefined) {
                    data[i].push(cell.v);
                } else {
                    noData = true
                    break
                }
            }
        }
        const objects = []
        data.shift()
        for (let i = 0; i <= data.length - 1; i++) {
            let obj = {
                "email": `${data[i][0]}`,
                "password": `${data[i][1]}`,
                "proxy": `${data[i][2]}`,
                "vrf": `${data[i][3]}`
            }
            objects.push(obj)
        }
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "your file added",
            showConfirmButton: false,
            timer: 1500
        })
        const btn = document.querySelector('.preview')
        btn.style.display = 'block'
        btn.addEventListener('click', () => {
            $('#modal-bulk-add input').val('');
            progress.style.width = '0%'
            progress.innerHTML = '0%'
            $('#modal-bulk-add').modal('hide');
            $('#modal-preview-data').modal('show')
            let tbody = $('#bulk_add_table')
            tbody.empty()
            let count = 0
            objects.forEach(object => {
                let tr = document.createElement('tr')
                count++
                for (let val in object) {
                    let td = document.createElement('td')
                    td.innerHTML = object[val]
                    tr.appendChild(td)
                }
                let td_action = document.createElement('td')
                td_action.innerHTML = '<button type="button" class="btn btn-danger remove-data">Remove</button>'
                td_action.classList.add('text-center')
                tr.appendChild(td_action)
                tbody.append(tr)
            })
            $('.count').html(count)
            let data = $(btn).data('id')
            console.log(data);
            $('.save-bulk-data').attr('data-id', data)
        })

        $(document).on('click', '.remove-data', evt => {
            let row = $(evt.target).parent().parent()
            let data = row.children()[0].innerHTML
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].email === data) {
                    objects.splice([i], [1])
                    break
                } else {
                    continue
                }
            }
            $('.count').html(objects.length)
            row.remove()
        })
        $(document).on('click', '.save-bulk-data', event => {
            let data = $(event.target).data('id')
            console.log(data);
            let obj = []
            let settings = {
                "url": `http://${ip}:3000/lists/isp/${data}`,
                "method": "GET",
                "headers": {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
                    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
                }
            };
            $.ajax(settings).done(function (responseText) {
                let isp = responseText.isp
                let date_add = new Date().toDateInputValue()
                let date_update = new Date().toDateInputValue()
                objects.forEach(one => {
                    let seed = {
                        "email": `${one.email.toLowerCase()}`,
                        "password": `${one.password}`,
                        "proxy": `${one.proxy}`,
                        "verification": `${one.vrf}`,
                        "id_list": `${data}`,
                        "date_add": `${date_add}`,
                        "date_update": `${date_update}`,
                        "status": `idel`,
                        "isp": `${isp}`
                    }
                    obj.push(seed)
                })
                progress.style.width = '0'
                progress.innerHTML = '0'
                addSeeds(obj)
            })
        })
    });
    reader.readAsArrayBuffer(evt.target.files[0]);
};

$(document).ready(function () {
    $("#search_preview").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#bulk_add_table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

const templateSeeds = (data) => {
    let tbody = $('#seeds')
    tbody.empty()
    data.forEach(object => {
        let tdCheck = document.createElement('td')
        tdCheck.innerHTML = `<input class="checkSeed" type="checkbox" value="${object.id_seeds}">`
        let tr = document.createElement('tr')
        tr.appendChild(tdCheck)
        for (let val in object) {
            if (object[val] == 'undefined' || object[val] == 'null' || object[val] == null || object[val] == '') {
                let td = document.createElement('td')
                td.innerHTML = 'none'
                tr.appendChild(td)
            } else {
                let td = document.createElement('td')
                td.innerHTML = object[val]
                tr.appendChild(td)
            }
        }
        let td_action = document.createElement('td')
        td_action.innerHTML =
            `<button data-id="${object.id_seeds}" type="button" class="btn btn-danger remove-this-seed"><i class="far fa-trash-alt"></button>`
        td_action.innerHTML += `<button data-id="${object.id_seeds}" type="button" class="btn btn-success edit-this-seed"><i class="fas fa-edit"></button>`
        td_action.classList.add('d-flex', 'gap-1', 'justify-content-center')
        tr.appendChild(td_action)
        tbody.append(tr)
    })
    return tbody
}

$(document).on('click', '.view', event => {
    let data = event.target.attributes[2].value
    let update = $('.updateOptions')[0].dataset.id = data
    $('#searchSeeds')[0].dataset.id = data
    let settings = {
        "url": `http://${ip}:3000/seeds/${data}`,
        "method": "GET",
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    }
    $.ajax(settings).done(function (responseText) {
        // let timerInterval
        // Swal.fire({
        //     title: 'loading !!',
        //     html: '<b></b>',
        //     timer: responseText.length,
        //     timerProgressBar: true,
        //     didOpen: () => {
        //         Swal.showLoading()
        //         const b = Swal.getHtmlContainer().querySelector('b')
        //         timerInterval = setInterval(() => {
        //             b.textContent = Swal.getTimerLeft()
        //         }, 100)
        //     },
        //     willClose: () => {
        //         clearInterval(timerInterval)
        //     }
        // }).then((result) => {
        //     if (result.dismiss === Swal.DismissReason.timer) {
        //         Swal.fire({
        //             title: 'done !',
        //             icon: 'success',
        //             timer: 1000,
        //             showConfirmButton: false
        //         })
        //     }
        // })
        $('#pagination-container').pagination({
            dataSource: responseText,
            pageSize: 10,
            showGoInput: true,
            showGoButton: true,
            showSizeChanger: true,
            showNavigator: true,
            formatNavigator: '<%= rangeStart %>-<%= rangeEnd %> of <%= totalNumber %> items',
            callback: function (data, pagination) {
                var html = templateSeeds(data);
                $('#data-container').html(html);
            }
        })
    }).then(() => {
        $('#modal-seeds-view').modal('show')
        $('#list_s').html(data)
    })
})

$(document).on('click', '.checkSeed', () => {
    let check = $("#seeds input:checked")
    let allCheck = $("#seeds input:checkbox")
    if (check.length > 0) {
        let action = `<button type="button" class="btn btn-danger  delete-seeds"><i class="far fa-trash-alt"></i></button>`
        $('#actionSeeds').html(action)
    } else {
        $('#actionSeeds').html('Action')
    }
    if (check.length == allCheck.length) {
        $(".checkAllSeeds").prop("checked", true);
    } else {
        $(".checkAllSeeds").prop("checked", false);
    }
})

$(".checkAllSeeds").change(function () {
    let status = $(this).is(":checked") ? true : false;
    $(".checkSeed").prop("checked", status);
    if (status) {
        let action = `<button type="button" class="btn btn-danger delete-seeds"><i class="far fa-trash-alt"></i></button>`
        $('#actionSeeds').html(action)
    } else {
        $('#actionSeeds').html('Action')
    }
});

$(document).on('click', '.delete-seeds', () => {
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
            let check = $("#seeds input:checked")
            const ides = []
            for (let i = 0; i < check.length; i++) {
                let ID = check[i].value
                ides.push(ID)
            }
            fetch(`http://${ip}:3000/seeds/`, {
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
                check.parent().parent().remove()
                $(".checkAllSeeds")[0].checked = false
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

$(document).on('click', '.remove-this-seed', event => {
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
            let data = $(event.target).data().id
            $(event.target).parent().parent().remove()
            fetch(`http://${ip}:3000/seeds/${data}`, {
                method: "DELETE",
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
                    position: 'top-end',
                    icon: 'success',
                    title: data,
                    showConfirmButton: false,
                    timer: 3000
                })
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

$(document).on('click', '.edit-this-seed', event => {
    let data = $(event.target).data().id
    let buttons = $(event.target).parent().html()
    let parent = $(event.target).parent().parent()
    let password = parent.children()[3]
    let proxy = parent.children()[4]
    let vrf = parent.children()[6]
    let c_pass = password.innerHTML
    let c_proxy = proxy.innerHTML
    let c_vrf = vrf.innerHTML
    password.innerHTML = `<input type="text" class="form-control pass_change" value="${c_pass}">`
    proxy.innerHTML = `<input type="text" class="form-control proxy_change" value="${c_proxy}">`
    vrf.innerHTML = `<input type="text" class="form-control vrf_change" value="${c_vrf}">`

    $(event.target).parent().html(`<button type="button" class="btn btn-success save_edit_seed" data-id="${data}">save</button><button type="button" class="btn btn-secondary cancel_edit_seed">Cancel</button>`)
    $('.save_edit_seed').on('click', event => {
        let n_pass = password.children[0].value
        let n_proxy = proxy.children[0].value
        let n_vrf = vrf.children[0].value
        let seed = {
            "id_seed": `${data}`,
            "password": `${n_pass}`,
            "proxy": `${n_proxy}`,
            "verification": `${n_vrf}`,
        }
        fetch(`http://${ip}:3000/seeds`, {
            method: "PUT",
            body: JSON.stringify(seed),
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
                position: 'top-end',
                icon: 'success',
                title: data,
                showConfirmButton: false,
                timer: 3000
            })
        }).then(() => {
            password.innerHTML = n_pass
            proxy.innerHTML = n_proxy
            vrf.innerHTML = n_vrf
            $(event.target).parent().html(buttons)
        })
    })
    $('.cancel_edit_seed').on('click', event => {
        let n_pass = password.children[0].value
        let n_proxy = proxy.children[0].value
        let n_vrf = vrf.children[0].value
        password.innerHTML = n_pass
        proxy.innerHTML = n_proxy
        vrf.innerHTML = n_vrf
        $(event.target).parent().html(buttons)
    })

})

const seedsViewRender = data => {
    let settings = {
        "url": `http://${ip}:3000/seeds/${data}`,
        "method": "GET",
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    }
    $.ajax(settings).done(function (responseText) {
        // let timerInterval
        // Swal.fire({
        //     title: 'loading !!',
        //     html: '<b></b>',
        //     timer: responseText.length,
        //     timerProgressBar: true,
        //     didOpen: () => {
        //         Swal.showLoading()
        //         const b = Swal.getHtmlContainer().querySelector('b')
        //         timerInterval = setInterval(() => {
        //             b.textContent = Swal.getTimerLeft()
        //         }, 100)
        //     },
        //     willClose: () => {
        //         clearInterval(timerInterval)
        //     }
        // }).then((result) => {
        //     if (result.dismiss === Swal.DismissReason.timer) {
        //         Swal.fire({
        //             title: 'done !',
        //             icon: 'success',
        //             timer: 1000,
        //             showConfirmButton: false
        //         })
        //     }
        // })
        $('#pagination-container').pagination({
            dataSource: responseText,
            pageSize: 10,
            showGoInput: true,
            showGoButton: true,
            showSizeChanger: true,
            showNavigator: true,
            formatNavigator: '<%= rangeStart %>-<%= rangeEnd %> of <%= totalNumber %> items',
            callback: function (data, pagination) {
                var html = templateSeeds(data);
                $('#data-container').html(html);
            }
        })
    })
}

const searchRender = (data, id) => {
    let settings = {
        "url": `http://${ip}:3000/seeds/search/${id}?gmail=${data}`,
        "method": "GET",
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'
        }
    }
    $.ajax(settings).done(function (responseText) {
        $('#pagination-container').pagination({
            dataSource: responseText,
            pageSize: 10,
            showGoInput: true,
            showGoButton: true,
            showSizeChanger: true,
            showNavigator: true,
            formatNavigator: '<%= rangeStart %>-<%= rangeEnd %> of <%= totalNumber %> items',
            callback: function (data, pagination) {
                var html = templateSeeds(data);
                $('#data-container').html(html);
            }
        })
    })
}

$(document).ready(function () {
    $("#searchSeeds").on("keyup", function () {
        let value = $(this).val()
        let data = $(this)[0].dataset.id
        searchRender(value, data)
    });
});

$(document).on('click', '.submit_proxy', event => {
    event.preventDefault()
    const data = $(event.target).data().id
    let inputM = document.querySelector('.input_way')
    let textM = document.querySelector('.text_way')
    if (textM.style.display == 'none') {
        let oldPVal = $('#oldProxy').val()
        let newPVal = $('#newProxy').val()
        if (oldPVal == "") {
            Swal.fire({
                title: 'Enter the old proxy value',
                icon: 'warning',
                showConfirmButton: true,
            })
            return
        } else if (newPVal == "") {
            Swal.fire({
                title: 'Enter the new proxy value',
                icon: 'warning',
                showConfirmButton: true,
            })
            return
        }
        fetch(`http://${ip}:3000/seeds/proxy/${data}?proxy=${oldPVal}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
                'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH'
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            let send = []
            if (json.length != 0 /*&& json.length == 1*/) {
                for (let i = 0; i < json.length; i++) {
                    let proxy = {
                        "id_list": `${data}`,
                        "proxy": `${newPVal}`,
                        "old": `${oldPVal}`,
                        "id_seed": `${json[i].id_seeds}`
                    }
                    send.push(proxy)
                }
                fetch(`http://${ip}:3000/seeds/proxy/`, {
                    method: "PUT",
                    body: JSON.stringify(send),
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
                        title: data,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1400
                    })
                }).then(() => {
                    $('#updateOptions input').val('')
                    $('#updateOptions textarea').val('')
                    $('#updateOptions').modal('hide')
                    seedsViewRender(data)
                })
            } else {
                Swal.fire({
                    title: 'This proxy not exist in this list',
                    icon: 'info',
                    showConfirmButton: true,
                })
            }
        })
    } else {
        let text = $("#proxyUpdateText").val()
        let proxy = []
        let dataArray = text.split(`\n`);
        dataArray.forEach(data => {
            let peer = data.split(",")
            proxy.push(peer)
        })
        let updateObjects = []
        for (let i = 0; i < proxy.length; i++) {
            let prxUp = {
                "id_list": `${data}`,
                "old": `${proxy[i][0]}`,
                "proxy": `${proxy[i][1]}`
            }
            updateObjects.push(prxUp)
        }
        fetch(`http://${ip}:3000/seeds/proxy/`, {
            method: "PUT",
            body: JSON.stringify(updateObjects),
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
                title: data,
                icon: 'success',
                showConfirmButton: false,
                timer: 1400
            })
        }).then(() => {
            $('#updateOptions input').val('')
            $('#updateOptions textarea').val('')
            $('#updateOptions').modal('hide')
            seedsViewRender(data)
        })
    }
})

$(document).on('click', '.submit_bulk_edit', event => {
    event.preventDefault()
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4},(\w{3,14}|none)\,((\d+\.\d+\.\d+\.\d+\:\d+)|\s{1}|none)\,(\w{3,14}|none)/i
    const data = $(event.target).data().id
    let text = $("#seedsUpdateText").val()
    if (text != "") {
        let textResult = [];
        $.each(text.split(`\n`), function (index, item) {
            let clean = item.replaceAll('***', '')
            if (clean.match(pattern)) {
                textResult.push(clean);
            }
            else {
                textResult.push(`***${clean}***`);
            }
        });
        let valid = false

        for (let i = 0; i < textResult.length; i++) {
            if (textResult[i].includes('***')) {
                valid = false
                break;
            } else {
                valid = true
            }
        }
        $('#seedsUpdateText').val(textResult.join(`\n`))
        if (valid) {
            const seeds = []
            textResult.forEach(result => {
                seeds.push(result.split(','))
            })
            let objects = []
            seeds.forEach(seed => {
                objects.push({
                    gmail: seed[0],
                    password: seed[1],
                    proxy: seed[2],
                    verification: seed[3]
                })
            });
            fetch(`http://${ip}:3000/seeds/bulk/`, {
                method: "PATCH",
                body: JSON.stringify(objects),
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
                    title: data,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                })
            }).then(() => {
                $('#updateOptions input').val('')
                $('#updateOptions textarea').val('')
                $('#updateOptions').modal('hide')
                seedsViewRender(data)
            })
        } else {
            Swal.fire({
                icon: "error",
                title: "Check invalid data",
                showConfirmButton: false,
                timer: 1500
            })
        }
    } else {
        Swal.fire({
            icon: "warning",
            title: "nothing to treat",
            showConfirmButton: false,
            timer: 700
        })
    }
})
