
$(document).on('click', '#add_user', () => {
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
        $(".add_user").modal("show");
    })
})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const addUser = (data) => {
    var settings = {
        url: `http://${ip}:3000/users`,
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
        Swal.fire({
            title: "user added successfully!",
            text: responseText,
            icon: "success",
            confirmButtonText: "ok",
        }).then(() => {
            getDataUser()
        });
    });
};

const loginGenerate = (f_name_add, l_name_add, uniqNumber) => {
    if (f_name_add == "" || l_name_add == "") {
        Swal.fire("Please fill all fields");
        return;
    }
    return `${f_name_add[0] + l_name_add + uniqNumber}`;
};

const passwordGenerate = (f_name_add, uniqNumber) => {
    if (f_name_add == "" || l_name_add == "") {
        Swal.fire("Please fill all fields");
        return;
    }
    return `${f_name_add}@${uniqNumber}`;
};

$(document).on("click", "#add", () => {
    let f_name_add = $("#f_name_add").val();
    let l_name_add = $("#l_name_add").val();
    let type_add = $("#type_add").val();
    let entity_add = $("#entity_add").val();
    $("#login_add").val(
        loginGenerate(f_name_add, l_name_add, getRndInteger(10, 99))
    );
    let login_add = $("#login_add").val();
    let add_date = new Date().toDateInputValue();
    let add_update = new Date().toDateInputValue();
    let password = passwordGenerate(f_name_add, getRndInteger(10000, 99999));
    let isp_add = $("#isp_add option:selected");
    let isp = []
    for (let i = 0; i < isp_add.length; i++) {
        isp.push(isp_add[i].value)
    }
    if (
        f_name_add == "" ||
        l_name_add == "" ||
        type_add == "" ||
        entity_add == ""
    ) {
        Swal.fire("Please fill all fields");
        return;
    }
    const data = {
        f_name: `${f_name_add}`,
        l_name: `${l_name_add}`,
        login: `${login_add}`,
        type: `${type_add}`,
        password: `${password}`,
        status: `active`,
        date_add: `${add_date}`,
        date_update: `${add_update}`,
        id_entity: `${entity_add}`,
        isp: `${isp}`,
    };
    addUser(data);
    $(".add_user").modal("hide");
});

$(document).on('click', '.delete', event => {
    let id = $(event.target).data('id')
    fetch(`http://${ip}:3000/users/${id}`, {
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
            title: "User deleted successfully!",
            text: data,
            icon: "warning",
            confirmButtonText: "ok",
        })
    }).then(() => {
        getDataUser()
    });
});

let isp
$(document).on('click', '.edit', event => {
    $('#e_entity_add').html('')
    fetch(`http://${ip}:3000/entity`, {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).then((data) => {
        data.forEach((elm) => {
            let option = document.createElement("option");
            option.innerHTML = elm["nom"];
            option.setAttribute("value", elm["id_entity"]);
            $('#e_entity_add').append(option);
        });
    })

    let id = $(event.target).data('id')
    console.log(id);
    fetch(`http://${ip}:3000/users/${id}`, {
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
    }).then(data => {
        $("#e_f_name_add").val(data[0].f_name)
        $("#e_l_name_add").val(data[0].l_name)
        $("#e_login_add").val(data[0].login)
        $("#e_Password_add").val(data[0].password)
        let options = document.querySelector("#e_type_add").children;
        let optionsE = document.querySelector("#e_entity_add").children;
        for (let i = 0; i < options.length; i++) {
            if (options.item(i).value == data[0].type) {
                options.item(i).setAttribute("selected", "true");
            }
        }
        for (let i = 0; i < optionsE.length; i++) {
            if (optionsE.item(i).value == data[0].id_entity) {
                optionsE.item(i).setAttribute("selected", "true");
            }
        }
        isp = data[0].isp
    }).then(() => {
        $(".edit_user").modal("show");
    })
})




//           .then((data) => {
//             let date = data.date;
//             let id_user = data.id_user;
//             let isp = data.isp;
//             document.querySelector("#edit").addEventListener("click", () => {
//               let objectDate = new Date();
//               let day = objectDate.getDate();
//               let month = objectDate.getMonth();
//               let year = objectDate.getFullYear();
//               let update = `${year}-${month}-${day}`;
//               let f_name_add = $("#e_f_name_add").val();
//               let l_name_add = $("#e_l_name_add").val();
//               let type_add = $("#e_type_add").val();
//               let entity_add = $("#e_entity_add").val();
//               let login_add = $("#e_Password_add").val();
//               let add_update = update;
//               let add_date = date;
//               let result;
//               let isp_add = $("#e_isp_add option:selected").text();
//               let result1 = isp_add.split(/(?=[A-Z])/);
//               let result2 = null;
//               let dat = isp;
//               if (dat == null) {
//                 result = result1;
//               } else {
//                 result2 = dat.split(/(?=[A-Z])/);
//               }
//               if (result2 != null) {
//                 if (result1.length > result2.length) {
//                   result = result1;
//                 } else {
//                   result = result2;
//                 }
//               } else {
//                 result = result1;
//               }

//               let password = $("#e_Password_add").val();
//               if (
//                 f_name_add == "" ||
//                 l_name_add == "" ||
//                 type_add == "" ||
//                 entity_add == "" ||
//                 password == ""
//               ) {
//                 Swal.fire("Please fill all fields");
//                 return;
//               }
//               const data = {
//                 f_name: `${f_name_add}`,
//                 l_name: `${l_name_add}`,
//                 login: `${login_add}`,
//                 type: `${type_add}`,
//                 password: `${password}`,
//                 status: `active`,
//                 date_add: `${add_date}`,
//                 date_update: `${add_update}`,
//                 id_entity: `${entity_add}`,
//                 isp: `${result}`,
//               };
//               fetch(`http://${ip}:3000/users/${id_user}`, {
//                 method: "PUT",
//                 body: JSON.stringify(data),
//                 headers: {
//                   "Content-Type": "application/json",
//                   "Access-Control-Allow-Origin": "*",
//                   "Access-Control-Allow-Headers":
//                     "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
//                   "Access-Control-Allow-Methods":
//                     "GET, HEAD, POST, PUT, DELETE, OPTIONS",
//                 },
//               })
//                 .then((response) => {
//                   return response.text();
//                 })
//                 .then((data) => {
//                   Swal.fire({
//                     title: "entity Updated successfully!",
//                     text: data,
//                     icon: "success",
//                     confirmButtonText: "ok",
//                   }).then(() => {
//                     location.reload();
//                   });
//                 });
//             });
//           });
//       });
//     }
//   });