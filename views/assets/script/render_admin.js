function getRootWebSitePath() {
  var _location = document.location.toString();
  var applicationNameIndex = _location.indexOf("/", _location.indexOf("://") + 3);
  var applicationName = _location.substring(0, applicationNameIndex) + "/";
  var webFolderIndex = _location.indexOf("/", _location.indexOf(applicationName) + applicationName.length);
  var webFolderFullPath = _location.substring(0, webFolderIndex);
  return webFolderFullPath;
}

let storage = { ...localStorage }
let ip = storage.ip

let adminNavbarUrl = ""
let adminSidebarUrl = ""
const root = getRootWebSitePath();
if (root.includes('views')) {
  adminNavbarUrl = `${root}/layout/admin_navbar.html`;
  adminSidebarUrl = `${root}/layout/admin_sidebar.html`;
} else {
  adminNavbarUrl = `${root}/views/layout/admin_navbar.html`;
  adminSidebarUrl = `${root}/views/layout/admin_sidebar.html`;
}
const _location = document.location.toString();
let path = _location.replace(root, "");
fetch(adminSidebarUrl)
  .then((response) => response.text())
  .then((html) => {
    const sidebarContainer = document.querySelector(".admin-sidebar");
    sidebarContainer.innerHTML = html;
  })
  .then(() => {
    let imgUrlLogo
    let imgUrlUser
    if (root.includes('views')) {
      imgUrlLogo = `${root}/assets/images/R.jpg`;
      imgUrlUser = `${root}/assets/images/user.png`;
    } else {
      imgUrlLogo = `${root}/views/assets/images/R.jpg`;
      imgUrlUser = `${root}/views/assets/images/user.png`;
    }
    const imgSrcLogo = document.querySelector(".logo");
    const imgSrcUser = document.querySelector(".user");

    imgSrcLogo.setAttribute("src", imgUrlLogo);
    imgSrcUser.setAttribute("src", imgUrlUser);
  })
  .then(() => {
    const home = document.querySelector(".home");
    const entities = document.querySelector(".entities");
    const users = document.querySelector(".users");
    const process = document.querySelector(".process");
    const lists = document.querySelector(".lists");
    if (path.includes('views')) {
      if (path == "/views/admin/") {
        home.classList.add("active");
        home.setAttribute("href", "./");
      } else if (path == "/views/admin/entities/") {
        home.setAttribute("href", "../");
        entities.classList.add("active");
        entities.setAttribute("href", "./");
        users.setAttribute("href", "../users/");
        process.setAttribute('href', '../process/')
        lists.setAttribute('href', '../lists/')
      } else if (path == "/views/admin/users/") {
        home.setAttribute("href", "../");
        users.classList.add("active");
        users.setAttribute("href", "./");
        entities.setAttribute("href", "../entities/");
        process.setAttribute('href', '../process/')
        lists.setAttribute('href', '../lists/')
      } else if (path == "/views/admin/process/") {
        home.setAttribute("href", "../");
        process.classList.add("active");
        process.setAttribute("href", "./");
        entities.setAttribute("href", "../entities/");
        users.setAttribute("href", "../users/");
        lists.setAttribute('href', '../lists/')
      } else if (path == "/views/admin/lists/") {
        home.setAttribute("href", "../");
        lists.classList.add("active");
        lists.setAttribute("href", "./");
        entities.setAttribute("href", "../entities/");
        process.setAttribute('href', '../process/')
        users.setAttribute('href', '../users/')
      }
    } else {
      if (path == "/admin/") {
        home.classList.add("active");
        home.setAttribute("href", "./");
      } else if (path == "/admin/entities/") {
        home.setAttribute("href", "../");
        entities.classList.add("active");
        entities.setAttribute("href", "./");
        users.setAttribute("href", "../users/");
        process.setAttribute('href', '../process/')
        lists.setAttribute('href', '../lists/')
      } else if (path == "/admin/users/") {
        home.setAttribute("href", "../");
        users.classList.add("active");
        users.setAttribute("href", "./");
        entities.setAttribute("href", "../entities/");
        process.setAttribute('href', '../process/')
        lists.setAttribute('href', '../lists/')
      } else if (path == "/admin/process/") {
        home.setAttribute("href", "../");
        process.classList.add("active");
        process.setAttribute("href", "./");
        entities.setAttribute("href", "../entities/");
        users.setAttribute("href", "../users/");
        lists.setAttribute('href', '../lists/')
      } else if (path == "/admin/lists/") {
        home.setAttribute("href", "../");
        lists.classList.add("active");
        lists.setAttribute("href", "./");
        entities.setAttribute("href", "../entities/");
        process.setAttribute('href', '../process/')
        users.setAttribute('href', '../users/')
      }
    }
  });

fetch(adminNavbarUrl)
  .then((response) => response.text())
  .then((html) => {
    const navbarContainer = document.querySelector(".admin-navbar");
    navbarContainer.innerHTML = html;
  });

const user_data = document.querySelector("#user_data");
const entity_data = document.querySelector("#entity_data");
const list_data = document.querySelector("#list_data");
const Process_data = document.querySelector('#Process_data')

function msToMnSc(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);
  return (
    seconds == 60 ?
      (minutes + 1) + ":00" :
      minutes + ":" + (seconds < 10 ? "0" : "") + seconds
  );
}

const createRow = (data) => {
  let rows = [];
  data.forEach((elm) => {
    let tr = document.createElement("tr");
    for (let val in elm) {
      let td = document.createElement("td");
      td.innerText = elm[val];
      tr.appendChild(td);
    }
    for (let val in elm) {
      if (val.includes("id")) {
        let td_actions = document.createElement("td");
        td_actions.innerHTML = `<button type="button" class="btn btn-primary status" data-id="${elm[val]}"><i class="far fa-eye"></i></button>
                <button type="button" class="btn btn-success edit"  data-id="${elm[val]}"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger delete" data-id="${elm[val]}"><i class="far fa-trash-alt"></i></button>`;
        td_actions.classList.add("text-center");
        tr.appendChild(td_actions);
      }
      break;
    }
    rows.push(tr);
  });
  return rows;
};

function getData() {
  $("#example1").DataTable({
    responsive: true,
    deferRender: true,
    destroy: true,
    autoWidth: false,
    ajax: {
      url: `http://${ip}:3000/process/admin`,
      dataSrc: '',
    },
    columns: [
      {
        data: null,
        searchable: false,
        orderable: false,
        defaultContent: "",
        render: function (data, type, row) {
          return `<input type="checkbox" class="check" value="${row.id_process}">`
        }
      },
      { data: 'id_process' },
      {
        data: null,
        searchable: false,
        render: function (data, type, row) {
          return `<div class="card m-0 bg-info w-50">
          <div class="card-body p-0 text-center text-light">
          ${row.count}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="card m-0 border-dark">
          <div class="card-body p-0 text-center text-dark">
          ${row.login}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="card m-0 border-secondary">
          <div class="card-body p-0 text-center text-dark">
          ${row.list_name}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="card m-0 border-light">
          <div class="card-body p-0 text-center text-secondary">
          ${row.isp}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          switch (row.status) {
            case 'FINISHED':
              return `<div class="card m-0 border-success">
                <div class="card-body p-0 text-center text-success">
                ${row.status}
                </div>
              </div>`
            case 'RUNNING':
              return `<div class="card m-0 border-primary">
                  <div class="card-body p-0 text-center text-primary">
                  ${row.status}
                  </div>
                </div>`
            case 'PAUSED':
              return `<div class="card m-0 border-warning">
                    <div class="card-body p-0 text-center text-warning">
                    ${row.status}
                     </div>
                  </div>`
            case 'STOPPED':
              return `<div class="card m-0 border-danger">
                     <div class="card-body p-0 text-center text-danger">
                      ${row.status}
                      </div>
                    </div>`
            default:
              return `<div class="card m-0 border-info">
                      <div class="card-body p-0 text-center text-info">
                      ${row.status}
                      </div>
                    </div>`
          }
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${row.action}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          if (row.status == 'idel') {
            return row.date_add
          }
          let start_in = new Date(row.start_in)
          let start = `${start_in.toLocaleString()}`
          return start
        }

      },
      {
        data: null,
        render: function (data, type, row) {
          if (row.end_in == null) {
            return `<i class="fas fa-minus"></i>`
          }
          let end_in = new Date(row.end_in)
          let start_in = new Date(row.start_in)
          console.log(end_in);
          console.log(start_in);
          let end = `${end_in.toLocaleString()} <span class="text-danger">[ ${msToMnSc(end_in - start_in)} min ]</span>`
          return end
        }
      },
      {
        data: null,
        searchable: false,
        orderable: false,
        render: function (data, type, row) {
          if (row.status == 'FINISHED') {
            return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}"><i class="far fa-eye"></i></button>
  <button type="button" class="btn btn-success" disabled data-id="${row.id_process}"><i class="fas fa-check"></i></button>
  <button type="button" class="btn btn-danger stop"  data-id="${row.id_process}"><i class="fas fa-power-off"></i></button>
  <button type="button" class="btn btn-info edit"  data-id="${row.id_process}"><i class="fas fa-edit"></i></button>`
          } else if (row.status == 'RUNNING') {
            return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-warning pause"  data-id="${row.id_process}"><i class="fas fa-pause"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}"><i class="fas fa-edit"></i></button>`
          } else if (row.status == 'PAUSED') {
            return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-warning resume"  data-id="${row.id_process}"><i class="fa fa-play"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}"><i class="fas fa-edit"></i></button>`
          } else if (row.status == 'STOPPED') {
            return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-success start"  data-id="${row.id_process}"><i class="fas fa-redo"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}"><i class="fas fa-power-off reset"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}"><i class="fas fa-edit"></i></button>`
          } else {
            return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-success start"  data-id="${row.id_process}"><i class="fa fa-play"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}"><i class="fas fa-edit"></i></button>`
          }
        },
      }
    ],
  })
};

function getDatalist() {
  $("#listTable").DataTable({
    responsive: true,
    deferRender: true,
    destroy: true,
    autoWidth: false,
    ajax: {
      url: `http://${ip}:3000/lists`,
      dataSrc: '',
    },
    data: {
      "id_list": 1213,
      "name": "test-4",
      "isp": "gmail",
      "status": "active",
      "date_add": "2023-10-17T04:00:00.000Z",
      "date_update": "2023-10-17T04:00:00.000Z",
      "id_user": 1,
      "seeds_count": "3"
    },
    columns: [
      {
        data: null,
        searchable: false,
        orderable: false,
        defaultContent: "",
        render: function (data, type, row) {
          return `<input type="checkbox" class="check" value="${row.id_list}">`
        }
      },
      { data: 'id_list' },
      {
        data: null,
        searchable: false,
        render: function (data, type, row) {
          return `<div class="card m-0 bg-info">
          <div class="card-body p-0 text-center text-light">
          ${row.name}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="card m-0 border-dark">
          <div class="card-body p-0 text-center text-dark">
          ${row.isp}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="card m-0 border-secondary">
          <div class="card-body p-0 text-center text-dark">
          ${row.status}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          let add = new Date(row.date_add).toLocaleString()
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${add}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          let update = new Date(row.date_update).toLocaleString()
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${update}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${row.id_user}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${row.seeds_count}
          </div>
        </div>`
        }
      },
      {
        data: null,
        searchable: false,
        orderable: false,
        render: function (row) {
          return `<button type="button" class="btn btn-primary add_seeds" data-id="${row.id_list}"><i class="fa fa-plus"></i></button>
          <button type="button" class="btn btn-success edit" data-id="${row.id_list}"><i class="fas fa-edit"></i></button>
        <button type="button" class="btn btn-info view" data-id="${row.id_list}"><i class="fa fa-eye" disabled></i></button>`
        }
      }
    ],
  })
};

function getDataEntity() {
  $("#entityTable").DataTable({
    responsive: true,
    deferRender: true,
    destroy: true,
    autoWidth: false,
    ajax: {
      url: `http://${ip}:3000/entity/`,
      dataSrc: '',
    },
    columns: [
      { data: 'id_entity' },
      {
        data: null,
        searchable: false,
        render: function (data, type, row) {
          return `<div class="card m-0">
          <div class="card-body p-0 text-center">
          ${row.nom}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="card m-0 border-dark">
          <div class="card-body p-0 text-center text-dark">
          ${row.status}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          let add = new Date(row.date_add).toLocaleString()
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${add}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          let update = new Date(row.date_update).toLocaleString()
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${update}
          </div>
        </div>`
        }
      },
      {
        data: null,
        searchable: false,
        orderable: false,
        render: function (row) {
          return `<div class="text-center">
          <button type="button" class="btn btn-success edit"  data-id="${row.id_entity}"><i class="fas fa-edit"></i></button>
        <button type="button" class="btn btn-danger delete" data-id="${row.id_entity}"><i class="far fa-trash-alt"></i></button>
          </div>`
        }
      }
    ],
  })
};

function getDataUser() {
  $("#userTable").DataTable({
    responsive: true,
    deferRender: true,
    destroy: true,
    autoWidth: false,
    ajax: {
      url: `http://${ip}:3000/users/`,
      dataSrc: '',
    },
    data: {
      "id_user": 1,
      "f_name": "ilias",
      "l_name": "anouar",
      "login": "ianouar52",
      "type": "admin",
      "password": "ilias@24739",
      "status": "active",
      "date_add": "2023-10-09T04:00:00.000Z",
      "date_update": "2023-09-09T04:00:00.000Z",
      "id_entity": 1,
      "isp": "Gmail"
    },
    columns: [
      { data: 'id_user' },
      {
        data: null,
        searchable: false,
        render: function (data, type, row) {
          return `<div class="card m-0 border-dark">
          <div class="card-body p-0 text-center text-dark">
          ${row.f_name} ${row.l_name}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="card m-0 border-dark">
          <div class="card-body p-0 text-center text-dark">
          ${row.login}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${row.type}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="card m-0 bg-danger blur password">
          <div class="card-body p-0 text-center text-light">
          ${row.password}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (row) {
          switch (row.status) {
            case 'active':
              return `<div class="card m-0">
              <div class="card-body p-0 text-center text-success">
              ${row.status}
              </div>
            </div>`
            default:
              return `<span class="text-danger">non !!</span>`
          }

        }
      },
      {
        data: null,
        render: function (data, type, row) {
          let add = new Date(row.date_add).toLocaleString()
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${add}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          let update = new Date(row.date_update).toLocaleString()
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${update}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${row.entity_name}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<div class="bg-info card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${row.isp}
          </div>
        </div>`
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_user}"><i class="far fa-eye"></i></button>
          <button type="button" class="btn btn-success edit"  data-id="${row.id_user}"><i class="fas fa-edit"></i></button>
        <button type="button" class="btn btn-danger delete" data-id="${row.id_user}"><i class="far fa-trash-alt"></i></button>`
        }
      },

    ],
  })
};


if (path.includes("/admin/users/")) {
  document.querySelector("#add_user").addEventListener("click", () => {
    const select = document.querySelector("#entity_add");
    select.innerHTML = ""
    fetch(`http://${ip}:3000/entity`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.forEach((elm) => {
          let option = document.createElement("option");
          option.innerHTML = elm["nom"];
          option.setAttribute("value", elm["id_entity"]);
          select.appendChild(option);
        });
      });
  });
  // fetch(`http://${ip}:3000/users/`, {
  //   method: "GET",
  // })
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     let rows = createRow(data);
  //     rows.forEach((row) => {
  //       user_data.appendChild(row);
  //     });
  //   })
  //   .then(() => {
  //     const deleteBtn = document.querySelectorAll(".delete");
  //     return deleteBtn;
  //   })
  //   .then((buttons) => {
  //     for (let i = 0; i < buttons.length; i++) {
  //       buttons[i].addEventListener("click", () => {
  //         let id = buttons[i].dataset.id;
  //         fetch(`http://${ip}:3000/users/${id}`, {
  //           method: "DELETE",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "Access-Control-Allow-Origin": "*",
  //             "Access-Control-Allow-Headers":
  //               "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
  //             "Access-Control-Allow-Methods":
  //               "GET, HEAD, POST, PUT, DELETE, OPTIONS",
  //           },
  //         })
  //           .then((response) => {
  //             return response.text();
  //           })
  //           .then((data) => {
  //             Swal.fire({
  //               title: "User deleted successfully!",
  //               text: data,
  //               icon: "warning",
  //               confirmButtonText: "ok",
  //             }).then(() => {
  //               location.reload();
  //             });
  //           });
  //       });
  //     }
  //   })
  //   .then(() => {
  //     const editBtn = document.querySelectorAll(".edit");
  //     return editBtn;
  //   })
  //   .then((buttons) => {
  //     for (let i = 0; i < buttons.length; i++) {
  //       buttons[i].addEventListener("click", () => {
  //         const select = document.querySelector("#e_entity_add");
  //         fetch(`http://${ip}:3000/entity`, {
  //           method: "GET",
  //         })
  //           .then((response) => {
  //             return response.json();
  //           })
  //           .then((data) => {
  //             data.forEach((elm) => {
  //               let option = document.createElement("option");
  //               option.innerHTML = elm["nom"];
  //               option.setAttribute("value", elm["id_entity"]);
  //               select.appendChild(option);
  //             });
  //           });
  //         let id = buttons[i].dataset.id;
  //         fetch(`http://${ip}:3000/users/${id}`, {
  //           method: "Get",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "Access-Control-Allow-Origin": "*",
  //             "Access-Control-Allow-Headers":
  //               "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
  //             "Access-Control-Allow-Methods":
  //               "GET, HEAD, POST, PUT, DELETE, OPTIONS",
  //           },
  //         })
  //           .then((response) => {
  //             return response.json();
  //           })
  //           .then((data) => {
  //             document.querySelector("#e_f_name_add").value = data[0].f_name;
  //             document.querySelector("#e_l_name_add").value = data[0].l_name;
  //             document.querySelector("#e_login_add").value = data[0].login;
  //             document.querySelector("#e_Password_add").value =
  //               data[0].password;
  //             // let select = document.querySelector('#e_isp_add')
  //             let add_date = data[0].date_add;
  //             let options = document.querySelector("#e_type_add").children;
  //             let optionsE = document.querySelector("#e_entity_add").children;
  //             for (let i = 0; i < options.length; i++) {
  //               if (options.item(i).value == data[0].type) {
  //                 options.item(i).setAttribute("selected", "true");
  //               }
  //             }
  //             for (let i = 0; i < optionsE.length; i++) {
  //               if (optionsE.item(i).value == data[0].id_entity) {
  //                 optionsE.item(i).setAttribute("selected", "true");
  //               }
  //             }
  //             const myModal = new bootstrap.Modal(
  //               document.querySelector(".edit_user")
  //             );
  //             myModal.show();
  //             return {
  //               date: add_date,
  //               id_user: data[0].id_user,
  //               isp: data[0].isp,
  //             };
  //           })
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
  getDataUser()
} else if (path.includes("/admin/entities/")) {
  getDataEntity()
} else if (path.includes("/admin/process/")) {
  document.querySelector("#add_process").addEventListener("click", () => {
    const select = document.querySelector("#p_list_add");
    select.innerHTML = ""
    fetch(`http://${ip}:3000/lists`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.forEach((elm) => {
          let option = document.createElement("option");
          option.innerHTML = elm["name"];
          option.setAttribute("value", elm["id_list"]);
          select.appendChild(option);
        });
      });
  });
  getData()
} else if (path.includes("/admin/lists/")) {
  getDatalist()
}
