function getRootWebSitePath() {
  var _location = document.location.toString();
  var applicationNameIndex = _location.indexOf(
    "/",
    _location.indexOf("://") + 3
  );
  var applicationName = _location.substring(0, applicationNameIndex) + "/";
  var webFolderIndex = _location.indexOf(
    "/",
    _location.indexOf(applicationName) + applicationName.length
  );
  var webFolderFullPath = _location.substring(0, webFolderIndex);

  return webFolderFullPath;
}
let user = JSON.parse(sessionStorage.user)

let storage = { ...localStorage }
let ip = storage.ip


const root = getRootWebSitePath();
let mailerSidebarUrl = ""
let mailerNavbarUrl = ""
if (root.includes('views')) {
  mailerSidebarUrl = `${root}/layout/mailer_sidebar.html`;
  mailerNavbarUrl = `${root}/layout/mailer_navbar.html`;
} else {
  mailerSidebarUrl = `${root}/views/layout/mailer_sidebar.html`;
  mailerNavbarUrl = `${root}/views/layout/mailer_navbar.html`;
}
const _location = document.location.toString();
let path = _location.replace(root, "");

fetch(mailerSidebarUrl)
  .then((response) => response.text())
  .then((html) => {
    $(".mailer-sidebar").html(html)
  })
  .then(() => {
    const imgUrlLogo = `${root}/assets/images/R.jpg`;
    const imgUrlUser = `${root}/assets/images/user.png`;

    const imgSrcLogo = document.querySelector(".logo");
    const imgSrcUser = document.querySelector(".user");

    imgSrcLogo.setAttribute("src", imgUrlLogo);
    imgSrcUser.setAttribute("src", imgUrlUser);
  })
  .then(() => {
    const home = document.querySelector(".home");
    const list = document.querySelector(".lists");
    const process = document.querySelector(".process");
    const compose = document.querySelector('.compose')

    if (path == "/mailer/") {
      home.classList.add("active");
      home.setAttribute("href", "./");
    } else if (path == "/mailer/process/") {
      home.setAttribute("href", "../");
      process.classList.add("active");
      process.setAttribute("href", "./");
      list.setAttribute("href", "../lists/");
      compose.setAttribute("href", "../compose/");
    } else if (path == "/mailer/lists/") {
      home.setAttribute("href", "../");
      list.classList.add("active");
      list.setAttribute("href", "./");
      process.setAttribute("href", "../process/");
      compose.setAttribute("href", "../compose/");
    } else if (path == "/mailer/compose/") {
      home.setAttribute("href", "../");
      compose.classList.add("active");
      compose.setAttribute("href", "./");
      process.setAttribute("href", "../process/");
      list.setAttribute("href", "../lists/");
    }
  });

fetch(mailerNavbarUrl)
  .then((response) => response.text())
  .then((html) => {
    const navbarContainer = document.querySelector(".mailer-navbar");
    navbarContainer.innerHTML = html;
  });

function msToMnSc(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);
  return (
    seconds == 60 ?
      (minutes + 1) + ":00" :
      minutes + ":" + (seconds < 10 ? "0" : "") + seconds
  );
}

const getData = $("#processDate").DataTable({
  order: [[1, 'desc']],

  responsive: true,
  destroy: true,
  autoWidth: false,
  ajax: {
    url: `http://${ip}:3000/process/mailer/${user.id_user}`,
    dataSrc: '',
  },
  columns: [
    {
      data: null,
      searchable: false,
      orderable: false,
      defaultContent: "",
      render: function (data, type, row) {
        return `<input type="checkbox" class="check" value="${row.id_process}" data-val="${row.action}">`
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
        return `<div class="card m-0 border-danger">
        <div class="card-body p-0 text-center text-danger text-capitalize">
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
            return `<div class="card status-p-${row.id_process} m-0 border-success">
                <div class="card-body p-0 text-center text-success">
                ${row.status}
                </div>
              </div>`
          case 'RUNNING':
            return `<div class="card status-p-${row.id_process} m-0 border-primary">
                  <div class="card-body p-0 text-center text-primary">
                  ${row.status}
                  </div>
                </div>`
          case 'PAUSED':
            return `<div class="card status-p-${row.id_process} m-0 border-warning">
                    <div class="card-body p-0 text-center text-warning">
                    ${row.status}
                     </div>
                  </div>`
          case 'STOPPED':
            return `<div class="card status-p-${row.id_process} m-0 border-danger">
                     <div class="card-body p-0 text-center text-danger">
                      ${row.status}
                      </div>
                    </div>`
          default:
            return `<div class="card status-p-${row.id_process} m-0 border-info">
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
        if (row.status == 'idel' || row.status == 'STOPPED') {
          return `${row.date_add} <span class="text-danger">(Create at)</span>`
        }
        let start_in = new Date(row.start_in)
        let start = `${start_in.toLocaleString()}`
        return start
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        if (row.end_in == null || row.status == 'STOPPED') {
          return `<i class="fas fa-minus"></i>`
        }
        let end_in = new Date(row.end_in)
        let start_in = new Date(row.start_in)
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
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
  <button type="button" class="btn btn-success" disabled data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Default tooltip"><i class="fas fa-check"></i></button>
  <button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
  <button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'RUNNING') {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-warning pause"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Pause process"><i class="fas fa-pause"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'PAUSED') {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-warning resume"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Resume process"><i class="fa fa-play"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'STOPPED') {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-success start"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Restart process"><i class="fas fa-redo"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" disabled data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off reset"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-success start"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Start process"><i class="fa fa-play"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" disabled data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action action"><i class="fas fa-edit"></i></button>`
        }
      },
    }
  ],
  drawCallback: function () {
    $('body').tooltip('dispose');
    $('[data-bs-toggle="tooltip"]').tooltip({ trigger: "hover" });
  }
})

const getDatalist = $("#listsDate").DataTable({
  responsive: true,
  deferRender: true,
  destroy: true,
  autoWidth: false,
  ajax: {
    url: `http://${ip}:3000/lists/${user.id_user}`,
    dataSrc: '',
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
        return `<div class="row gap-2 m-1 justify-content-center">
          <div class="bg-purple card m-0 col-md-auto">
            <div class="card-body p-0 text-center text-light">
            ${row.nom}
          </div>
          </div>
          <div class="b-action card m-0 col-md-auto">
            <div class="card-body p-0 text-center text-dark">
              ${row.login}
              </div>
            </div>
          </div>
         `
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

const getDataCompose = $("#composeData").DataTable({
  responsive: true,
  order: [[1, 'desc']],
  destroy: true,
  autoWidth: false,
  ajax: {
    url: `http://${ip}:3000/compose/mailer/${user.id_user}`,
    dataSrc: '',
  },
  columns: [
    {
      data: null,
      searchable: false,
      orderable: false,
      defaultContent: "",
      render: function (data, type, row) {
        return `<input type="checkbox" class="check" value="${row.id_process}" data-val="${row.action}">`
      }
    },
    { data: 'id_process', },
    {
      data: null,
      searchable: false,
      render: function (data, type, row) {
        return `<div class="card m-0 bg-info w-50">
          <div class="card-body p-0 text-center text-light">
          ${row.seedscount}
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
        return `<div class="card m-0 border-secondary" data-bs-toggle="tooltip" data-bs-title="Count : ${row.count}, Counter : ${row.counter}">
          <div class="card-body p-0 text-center text-dark">
          ${row.data}
          </div>
        </div>`
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        return `<div class="card m-0 border-secondary">
          <div class="card-body p-0 text-center text-dark">
          ${row.offer}
          </div>
        </div>`
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        return `<div class="card m-0 border-danger">
          <div class="card-body p-0 text-center text-danger text-capitalize">
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
            return `<div class="card status-p-${row.id_process} m-0 border-success ">
                <div class="card-body p-0 text-center text-success">
                ${row.status}
                </div>
              </div>`
          case 'RUNNING':
            return `<div class="card status-p-${row.id_process} m-0 border-primary">
                  <div class="card-body p-0 text-center text-primary">
                  ${row.status}
                  </div>
                </div>`
          case 'PAUSED':
            return `<div class="card status-p-${row.id_process} m-0 border-warning">
                    <div class="card-body p-0 text-center text-warning">
                    ${row.status}
                     </div>
                  </div>`
          case 'STOPPED':
            return `<div class="card status-p-${row.id_process} m-0 border-danger">
                     <div class="card-body p-0 text-center text-danger">
                      ${row.status}
                      </div>
                    </div>`
          default:
            return `<div class="card status-p-${row.id_process} m-0 border-info">
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
        return `<div class="card m-0" data-bs-toggle="tooltip" data-bs-title="${row.action}">
          <div class="card-body p-0 text-center text-dark">
          ${row.action.substring(0, 20)}...
          </div>
         </div>`
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        if (row.status == 'idel' || row.status == 'STOPPED') {
          return `${new Date(row.add_date).toLocaleString()} <span class="text-danger">(Create at)</span>`
        }
        let start_in = new Date(row.start_in)
        let start = `${start_in.toLocaleString()}`
        return start
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        if (row.end_in == null || row.status == 'STOPPED') {
          return `<i class="fas fa-minus"></i>`
        }
        let end_in = new Date(row.end_in)
        let start_in = new Date(row.start_in)
        let end = `${end_in.toLocaleString()} <span class="text-danger">[ ${msToMnSc(end_in - start_in)} ]</span>`
        return end
      }
    },
    {
      data: null,
      searchable: false,
      orderable: false,
      render: function (data, type, row) {
        if (row.status == 'FINISHED') {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
  <button type="button" class="btn btn-success" disabled data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Default tooltip"><i class="fas fa-check"></i></button>
  <button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
  <button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'RUNNING') {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-warning pause"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Pause process"><i class="fas fa-pause"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'PAUSED') {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-warning resume"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Resume process"><i class="fa fa-play"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'STOPPED') {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-success start"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Restart process"><i class="fas fa-redo"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" disabled data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off reset"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else {
          return `<button type="button" class="btn btn-primary status" data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="View status"><i class="far fa-eye"></i></button>
<button type="button" class="btn btn-success start"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Start process"><i class="fa fa-play"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" disabled data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action action"><i class="fas fa-edit"></i></button>`
        }
      },
    }
  ],
  drawCallback: function () {
    $('body').tooltip('dispose');
    $('[data-bs-toggle="tooltip"]').tooltip({ trigger: "hover" });
  }
})

if (path == "/mailer/lists/") {
  const select = document.querySelector("#l_isp_add");
  select.innerHTML = ""
  let isp = user.isp.split(',')
  console.log(isp);
  isp.forEach((elm) => {
    let option = document.createElement("option");
    option.innerHTML = elm.toUpperCase();
    option.setAttribute("value", elm);
    select.appendChild(option);
  });
  getDatalist
} else if (path.includes("/mailer/process/")) {
  document.querySelector("#add_process").addEventListener("click", () => {
    const select = document.querySelector("#p_list_add");
    select.innerHTML = ""
    fetch(`http://${ip}:3000/lists/${user.id_user}`, {
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
  getData
} else if (path.includes("/mailer/compose")) {
  const select = document.querySelector("#p_list_add");
  const dataAdd = document.querySelector("#p_data_add");
  const offersAdd = document.querySelector("#p_offers_add");
  let default_limit = document.querySelector('.default_limit')
  select.innerHTML = ""
  dataAdd.innerHTML = ""
  offersAdd.innerHTML = ""
  fetch(`http://${ip}:3000/compose/limit`, {
    method: "GET",
  }).then((response) => {
    return response.text();
  }).then((data) => {
    default_limit.innerHTML = data
  })
  fetch(`http://${ip}:3000/lists/${user.id_user}`, {
    method: "GET",
  }).then((response) => {
    return response.json();
  }).then((data) => {

    data.forEach((elm) => {
      let option = document.createElement("option");
      option.innerHTML = elm["name"];
      option.setAttribute("value", elm["id_list"]);
      select.appendChild(option);
    });
  })
  fetch(`http://${ip}:3000/compose/data`, {
    method: "GET",
  }).then((response) => {
    return response.json();
  }).then((data) => {
    if (data.length == 0) {
      let option = document.createElement("option");
      option.innerHTML = `No available data`
      dataAdd.appendChild(option);
    } else {
      data.forEach((elm) => {

        let option = document.createElement("option");
        option.innerHTML = `${elm['file']} / Count : ${elm['count']}`
        option.setAttribute("value", elm['file']);
        option.dataset.count = elm['count'];
        dataAdd.appendChild(option);
      });
    }
  })
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
  document.querySelector("#add_compose").addEventListener("click", () => {
    select.innerHTML = ""
    dataAdd.innerHTML = ""
    offersAdd.innerHTML = ""
    fetch(`http://${ip}:3000/compose/limit`, {
      method: "GET",
    }).then((response) => {
      return response.text();
    }).then((data) => {
      default_limit.innerHTML = data
    })
    fetch(`http://${ip}:3000/lists/${user.id_user}`, {
      method: "GET",
    }).then((response) => {
      return response.json();
    }).then((data) => {

      data.forEach((elm) => {
        let option = document.createElement("option");
        option.innerHTML = elm["name"];
        option.setAttribute("value", elm["id_list"]);
        select.appendChild(option);
      });
    })
    fetch(`http://${ip}:3000/compose/data`, {
      method: "GET",
    }).then((response) => {
      return response.json();
    }).then((data) => {
      if (data.length == 0) {
        let option = document.createElement("option");
        option.innerHTML = `No available data`
        dataAdd.appendChild(option);
      } else {
        data.forEach((elm) => {

          let option = document.createElement("option");
          option.innerHTML = `${elm['file']} / Count : ${elm['count']}`
          option.setAttribute("value", elm['file']);
          option.dataset.count = elm['count'];
          dataAdd.appendChild(option);
        });
      }
    })
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
  getDataCompose
}
