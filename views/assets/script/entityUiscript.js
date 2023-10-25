Date.prototype.toDateInputValue = function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
};

$('#e_update_date').val(new Date().toDateInputValue())

$(document).on("click", "#add_entity", () => {
    $(".add_entity").modal("show");
});

const addEntity = (data) => {
    var settings = {
        url: `http://${ip}:3000/entity`,
        method: "POST",
        timeout: 0,
        data: data,
    };

    $.ajax(settings).done(function (responseText) {
        Swal.fire({
            title: "Entity added successfully!",
            text: responseText.message,
            icon: "success",
            confirmButtonText: "ok",
        }).then(() => {
            location.reload();
        });
    });
};

$(document).on("click", "#e_add", () => {
    let e_name = $("#e_name").val().toString();
    let e_status = $("#e_status").val().toString();
    let e_add_date = $("#e_add_date").val().toString();
    let e_update_date = $("#e_update_date").val().toString();
    if (
        e_name == "" ||
        e_status == "" ||
        e_add_date == "" ||
        e_update_date == ""
    ) {
        Swal.fire("Please fill all fields");
        return;
    }
    const data = {
        nom: `${e_name}`,
        status: `${e_status}`,
        date_add: `${e_add_date}`,
        date_update: `${e_update_date}`,
    };
    addEntity(data);
    $(".add_entity").modal("hide");
});

$(document).on('click', '.delete', event => {
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
            id = $(event.target).data('id')
            fetch(`http://${ip}:3000/entity/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers":
                        "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
                    "Access-Control-Allow-Methods":
                        "GET, HEAD, POST, PUT, DELETE, OPTIONS",
                },
            }).then((response) => {
                return response.text();
            }).then((data) => {
                Swal.fire({
                    title: "entity deleted successfully!",
                    text: data,
                    icon: "warning",
                    confirmButtonText: "ok",
                }).then(() => {
                    getDataEntity();
                });
            })
        } else if (result.isDismissed) {
            console.log("cancelled");
        }
    })
})
let date
$(document).on('click', '.edit', event => {
    let id = $(event.target).data('id')
    console.log(id);
    fetch(`http://${ip}:3000/entity/${id}`, {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
            "Access-Control-Allow-Methods":
                "GET, HEAD, POST, PUT, DELETE, OPTIONS",
        },
    }).then((response) => {
        return response.json();
    }).then((data) => {
        $("#e_e_name").val(data[0].nom)
        let add_date = data[0].date_add;
        let options = document.querySelector("#e_e_status").children;
        for (let i = 0; i < options.length; i++) {
            if (options.item(i).value == data[0].status) {
                options.item(i).setAttribute("selected", "true");
            }
        }
        $(".edit_entity").modal('show')
        date = add_date
    })
})


//                     .then((data) => {
//                         let date = data.data;
//                         let id_entity = data.id_entity;
//                         document
//                             .querySelector("#e_e_add")
//                             .addEventListener("click", () => {
//                                 let e_name = $("#e_e_name").val().toString();
//                                 let e_status = $("#e_e_status").val().toString();
//                                 let e_add_date = date;
//                                 let e_update_date = $("#e_e_update_date").val().toString();
//                                 if (
//                                     e_name == "" ||
//                                     e_status == "" ||
//                                     e_add_date == "" ||
//                                     e_update_date == ""
//                                 ) {
//                                     Swal.fire("Please fill all fields");
//                                     return;
//                                 }
//                                 const data = {
//                                     nom: `${e_name}`,
//                                     status: `${e_status}`,
//                                     date_add: `${e_add_date}`,
//                                     date_update: `${e_update_date}`,
//                                 };
//                                 fetch(`http://${ip}:3000/entity/${id}`, {
//                                     method: "PUT",
//                                     body: JSON.stringify(data),
//                                     headers: {
//                                         "Content-Type": "application/json",
//                                         "Access-Control-Allow-Origin": "*",
//                                         "Access-Control-Allow-Headers":
//                                             "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
//                                         "Access-Control-Allow-Methods":
//                                             "GET, HEAD, POST, PUT, DELETE, OPTIONS",
//                                     },
//                                 })
//                                     .then((response) => {
//                                         return response.text();
//                                     })
//                                     .then((data) => {
//                                         Swal.fire({
//                                             title: "entity Updated successfully!",
//                                             text: data,
//                                             icon: "success",
//                                             confirmButtonText: "ok",
//                                         }).then(() => {
//                                             location.reload();
//                                         });
//                                     });
//                             });
//                     });
//             });
//         }
//     });