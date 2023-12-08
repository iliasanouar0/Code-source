function getRootWebSitePath() {
  var _location = document.location.toString();
  var applicationNameIndex = _location.indexOf("/", _location.indexOf("://") + 3);
  var applicationName = _location.substring(0, applicationNameIndex) + "/";
  var webFolderIndex = _location.indexOf("/", _location.indexOf(applicationName) + applicationName.length);
  var webFolderFullPath = _location.substring(0, webFolderIndex);
  return webFolderFullPath;
}
if (sessionStorage.auth == undefined) {
  location.href = '/'
}
let auth = JSON.parse(sessionStorage.auth)
if (auth == 0 || auth == 'undefined') {
  location.href = '/'
}

let user = JSON.parse(sessionStorage.user)


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
    const compose = document.querySelector('.compose')
    const entities = document.querySelector(".entities");
    const users = document.querySelector(".users");
    const process = document.querySelector(".process");
    const lists = document.querySelector(".lists");
    const settings = document.querySelector('.setting')
    const authorization = document.querySelector('.authorization')

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
      settings.setAttribute("href", '../database/')
      authorization.setAttribute("href", '../authorization/')
      compose.setAttribute("href", '../compose/')

    } else if (path == "/admin/users/") {
      home.setAttribute("href", "../");
      users.classList.add("active");
      users.setAttribute("href", "./");
      entities.setAttribute("href", "../entities/");
      process.setAttribute('href', '../process/')
      lists.setAttribute('href', '../lists/')
      settings.setAttribute("href", '../database/')
      authorization.setAttribute("href", '../authorization/')
      compose.setAttribute("href", '../compose/')

    } else if (path == "/admin/process/") {
      home.setAttribute("href", "../");
      process.classList.add("active");
      process.setAttribute("href", "./");
      entities.setAttribute("href", "../entities/");
      users.setAttribute("href", "../users/");
      lists.setAttribute('href', '../lists/')
      settings.setAttribute("href", '../database/')
      authorization.setAttribute("href", '../authorization/')
      compose.setAttribute("href", '../compose/')

    } else if (path == "/admin/lists/") {
      home.setAttribute("href", "../");
      lists.classList.add("active");
      lists.setAttribute("href", "./");
      entities.setAttribute("href", "../entities/");
      process.setAttribute('href', '../process/')
      users.setAttribute('href', '../users/')
      settings.setAttribute("href", '../database/')
      authorization.setAttribute("href", '../authorization/')
      compose.setAttribute("href", '../compose/')

    } else if (path == "/admin/database/") {
      home.setAttribute("href", "../");
      settings.classList.add("active");
      settings.setAttribute("href", "./");
      entities.setAttribute("href", "../entities/");
      process.setAttribute('href', '../process/')
      users.setAttribute('href', '../users/')
      lists.setAttribute("href", '../lists/')
      authorization.setAttribute("href", '../authorization/')
      compose.setAttribute("href", '../compose/')

    } else if (path == "/admin/authorization/") {
      home.setAttribute("href", "../");
      authorization.classList.add("active");
      authorization.setAttribute("href", "./");
      entities.setAttribute("href", "../entities/");
      process.setAttribute('href', '../process/')
      users.setAttribute('href', '../users/')
      lists.setAttribute("href", '../lists/')
      settings.setAttribute("href", '../database/')
      compose.setAttribute("href", '../compose/')
    } else if (path == "/admin/compose/") {
      home.setAttribute("href", "../");
      compose.classList.add("active");
      compose.setAttribute("href", "./");
      entities.setAttribute("href", "../entities/");
      process.setAttribute('href', '../process/')
      users.setAttribute('href', '../users/')
      lists.setAttribute("href", '../lists/')
      settings.setAttribute("href", '../database/')
      authorization.setAttribute("href", '../authorization/')
    }
  });

fetch(adminNavbarUrl)
  .then((response) => response.text())
  .then((html) => {
    const navbarContainer = document.querySelector(".admin-navbar");
    navbarContainer.innerHTML = html;
  });

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

const getData = $("#example1").DataTable({
  responsive: true,
  order: [[1, 'desc']],
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


const getDataCompose = $("#composeData").DataTable({
  responsive: true,
  order: [[1, 'desc']],
  destroy: true,
  autoWidth: false,
  ajax: {
    url: `http://${ip}:3000/compose/admin`,
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
        return `<div class="card m-0 border-secondary" data-bs-toggle="tooltip" data-bs-title="Count : ${row.count}, Counter : ${row.counter == null ? 0 : row.counter}">
        <div class= "card-body p-0 text-center text-dark" >
          ${row.data.substring(0, 10)}...
          </div >
        </div > `
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        return `<div class="card m-0 border-secondary">
           <div class="card-body p-0 text-center text-dark">
                ${row.offer}
                  </div>
        </div > `
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        return `<div class="card m-0 border-danger" >
  <div class="card-body p-0 text-center text-danger text-capitalize">
    ${row.isp}
  </div>
        </div > `
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        switch (row.status) {
          case 'FINISHED':
            return `<div class="card status-p-${row.id_process} m-0 border-success " >
  <div class="card-body p-0 text-center text-success">
    ${row.status}
  </div>
              </div > `
          case 'RUNNING':
            return `<div class="card status-p-${row.id_process} m-0 border-primary" >
  <div class="card-body p-0 text-center text-primary">
    ${row.status}
  </div>
                </div > `
          case 'PAUSED':
            return `<div class="card status-p-${row.id_process} m-0 border-warning" >
  <div class="card-body p-0 text-center text-warning">
    ${row.status}
  </div>
                  </div > `
          case 'STOPPED':
            return `<div class="card status-p-${row.id_process} m-0 border-danger" >
  <div class="card-body p-0 text-center text-danger">
    ${row.status}
  </div>
                    </div > `
          default:
            return `<div class="card status-p-${row.id_process} m-0 border-info" >
  <div class="card-body p-0 text-center text-info">
    ${row.status}
  </div>
                    </div > `
        }
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        return `<div class="card m-0" data - bs - toggle="tooltip" data - bs - title="${row.action}" >
  <div class="card-body p-0 text-center text-dark">
    ${row.action.substring(0, 20)}...
  </div>
         </div > `
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        if (row.status == 'idel' || row.status == 'STOPPED') {
          return `${new Date(row.add_date).toLocaleString()} <span class="text-danger">(Create at)</span>`
        }
        let start_in = new Date(row.start_in)
        let start = `${start_in.toLocaleString()} `
        return start
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        if (row.end_in == null || row.status == 'STOPPED') {
          return `<i class="fas fa-minus" ></i > `
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
          return `<button type = "button" class="btn btn-primary status" data - id="${row.id_process}" data - bs - toggle="tooltip" data - bs - title="View status" > <i class="far fa-eye"></i></button >
  <button type="button" class="btn btn-success" disabled data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Default tooltip"><i class="fas fa-check"></i></button>
  <button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
  <button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'RUNNING') {
          return `<button type = "button" class="btn btn-primary status" data - id="${row.id_process}" data - bs - toggle="tooltip" data - bs - title="View status" > <i class="far fa-eye"></i></button >
<button type="button" class="btn btn-warning pause"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Pause process"><i class="fas fa-pause"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'PAUSED') {
          return `<button type = "button" class="btn btn-primary status" data - id="${row.id_process}" data - bs - toggle="tooltip" data - bs - title="View status" > <i class="far fa-eye"></i></button >
<button type="button" class="btn btn-warning resume"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Resume process"><i class="fa fa-play"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else if (row.status == 'STOPPED') {
          return `<button type = "button" class="btn btn-primary status" data - id="${row.id_process}" data - bs - toggle="tooltip" data - bs - title="View status" > <i class="far fa-eye"></i></button >
<button type="button" class="btn btn-success start"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Restart process"><i class="fas fa-redo"></i></button>
<button type="button" class="btn btn-danger stop"  data-id="${row.id_process}" disabled data-bs-toggle="tooltip" data-bs-title="Reset process"><i class="fas fa-power-off reset"></i></button>
<button type="button" class="btn btn-info edit"  data-id="${row.id_process}" data-bs-toggle="tooltip" data-bs-title="Edit process action"><i class="fas fa-edit"></i></button>`
        } else {
          return `<button type = "button" class="btn btn-primary status" data - id="${row.id_process}" data - bs - toggle="tooltip" data - bs - title="View status" > <i class="far fa-eye"></i></button >
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

const getDatalist = $("#listTable").DataTable({
  responsive: true,
  deferRender: true,
  destroy: true,
  autoWidth: false,
  ajax: {
    url: `http://${ip}:3000/lists`,
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

const getDataEntity = $("#entityTable").DataTable({
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

const getDataUser = $("#userTable").DataTable({
  responsive: true,
  deferRender: true,
  destroy: true,
  autoWidth: false,
  ajax: {
    url: `http://${ip}:3000/users/`,
    dataSrc: '',
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
      searchable: false,
      orderable: false,
      render: function (data, type, row) {
        return `<div class="row m-0 justify-content-center">
         <!-- <div class="card m-0 bg-danger password_show col">
          <div class="card-body p-0 text-center blur text-light">
          ${row.password}
          </div>
        </div>-->
        <div class="col-md-auto btn btn-danger update_pass" data-id="${row.id_user}">
        <i class="fas fa-cog update_pass" data-id="${row.id_user}"></i>
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
              <div class="card-body p-0 text-center text-success status_change">
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
        return `<div class="bg-teal card m-0">
          <div class="card-body p-0 text-center text-light">
          ${row.isp}
          </div>
        </div>`
      }
    },
    {
      data: null,
      searchable: false,
      orderable: false,
      render: function (data, type, row) {
        return `<div class="text-center">
          <button type="button" class="btn btn-success edit"  data-id="${row.id_user}"><i class="fas fa-edit"></i></button>
        <button type="button" class="btn btn-danger delete" data-id="${row.id_user}"><i class="far fa-trash-alt"></i></button>
          </div>`
      }
    },

  ],
})

const getDataSettings = () => {
  $('.tables').empty()
  fetch(`http://${ip}:3000/settings/tables/`, { method: "GET" })
    .then(response => {
      return response.json()
    }).then(data => {
      data.forEach(elm => {
        fetch(`http://${ip}:3000/settings/columns/${elm.tablename}`, { method: "GET" })
          .then(response => {
            return response.json()
          }).then(data => {
            let rows = ''
            let table_name
            data.forEach(elm => {
              table_name = elm.table_name
              rows += `<tr><td>${elm.column_name}</td><td>${elm.data_type}</td><td><span class="btn btn-outline-danger column-drop" data-name="${elm.column_name}" data-table="${table_name}">DROP</span></td></tr>`
            })
            let collapse = `<div class="card card-primary card-outline">
            <a class="d-block w-100 collapsed" data-toggle="collapse" href="#${table_name}"
                aria-expanded="false">
                <div class="card-header">
                    <h4 class="card-title w-100">
                        ${table_name}
                    </h4 >
                </div >
            </a >
              <div id="${table_name}" class="collapse" data-parent="#accordion">
                <div class="card-body">
                  <div class="row text-right mb-3">
                    <div class="col">
                      <button class="btn btn-danger delete" data-name="${table_name}">DROP table</button>
                      <button class="btn btn-success add" data-name="${table_name}">Add column</button>
                     <!-- <button class="btn btn-primary" data-name="${table_name}">action-3</button>-->
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <table class="table">
                        <thead>
                          <tr>
                            <th scope="col">Column name</th>
                            <th scope="col">Data type</th>
                            <th scope="col">action</th>
                          </tr>
                        </thead>
                        <tbody class="columns">
                        ${rows}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div >`

            $('.tables').append(collapse)
          })
      })
    })
}

const getDataIP = $("#ipAuthorization").DataTable({
  responsive: true,
  deferRender: true,
  destroy: true,
  autoWidth: false,
  pageLength: 5,
  lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
  ajax: {
    url: `http://${ip}:3000/ip/`,
    dataSrc: '',
  },
  columns: [
    {
      data: null,
      searchable: false,
      orderable: false,
      defaultContent: "",
      render: function (data, type, row) {
        return `<input type="checkbox" class="check" value="${row.id}">`
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        return `<div class="card m-0">
          <div class="card-body p-0 text-center">
          ${row.ip}
          </div>
        </div>`
      }
    },
    {
      data: null,
      render: function (data, type, row) {
        return `<div class="card m-0 border-dark">
          <div class="card-body p-0 text-center text-dark">
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
          ${row.type}
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
        let add = new Date(row.createdat).toLocaleString()
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
        let add = new Date(row.updatedat).toLocaleString()
        return `<div class="b-action card m-0">
          <div class="card-body p-0 text-center text-dark">
          ${add}
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
          <button type="button" class="btn btn-success edit"  data-id="${row.id}"><i class="fas fa-edit"></i></button>
          </div>`
      }
    }
  ],
})

const getAccessGranted = $("#GrantedAccess").DataTable({
  responsive: true,
  deferRender: true,
  destroy: true,
  searching: false,
  ordering: false,
  paging: false,
  lengthChange: false,
  autoWidth: false,
  pageLength: 5,
  lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
  ajax: {
    url: `http://${ip}:3000/node/access/`,
    dataSrc: '',
  },
  columns: [
    // {
    //   data: null,
    //   searchable: false,
    //   orderable: false,
    //   defaultContent: "",
    //   render: function (data, type, row) {
    //     return `<input type="checkbox" class="check" value="${row.entity}">`
    //   }
    // },
    {
      data: null,
      render: function (data, type, row) {
        return row.entity
      }
    }
  ]
})

const getMode = () => {
  var settings = {
    url: `http://${ip}:3000/node/env/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
    },
    error: (err) => {
      location.href = '/views/access.html'
    }
  };
  $.ajax(settings).done(function (responseText) {
    if (responseText == 'production') {
      $('#mode').attr('checked', 'true')
    }
    $('.mode').html(responseText)
  });
}

if (path.includes("/admin/users/")) {
  getDataUser
} else if (path.includes("/admin/entities/")) {
  getDataEntity
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

      })
  })
} else if (path.includes("/admin/lists/")) {
  getDatalist
} else if (path.includes("/admin/database/")) {
  getDataSettings()
} else if (path.includes("/admin/authorization/")) {
  getDataIP
  getAccessGranted
  getMode()
} else if (path.includes("/admin/compose/")) {
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
  fetch(`http://${ip}:3000/lists`, {
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
    fetch(`http://${ip}:3000/lists`, {
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
