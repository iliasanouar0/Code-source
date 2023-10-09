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

const root = getRootWebSitePath();
const mailerSidebarUrl = `${root}/views/layout/mailer_sidebar.html`;
const mailerNavbarUrl = `${root}/views/layout/mailer_navbar.html`;
const _location = document.location.toString();
let path = _location.replace(root, "");

fetch(mailerSidebarUrl)
  .then((response) => response.text())
  .then((html) => {
    const sidebarContainer = document.querySelector(".mailer-sidebar");
    sidebarContainer.innerHTML = html;
  })
  .then(() => {
    const imgUrlLogo = `${root}/views/assets/images/R.jpg`;
    const imgUrlUser = `${root}/views/assets/images/user.png`;

    const imgSrcLogo = document.querySelector(".logo");
    const imgSrcUser = document.querySelector(".user");

    imgSrcLogo.setAttribute("src", imgUrlLogo);
    imgSrcUser.setAttribute("src", imgUrlUser);
  })
  .then(() => {
    const home = document.querySelector(".home");
    const list = document.querySelector(".lists");
    const seeds = document.querySelector(".seeds");

    if (path == "/views/mailer/") {
      home.classList.add("active");
      home.setAttribute("href", "./");
    } else if (path == "/views/mailer/seeds/") {
      home.setAttribute("href", "../");
      seeds.classList.add("active");
      seeds.setAttribute("href", "./");
      list.setAttribute("href", "../lists/");
    } else if (path == "/views/mailer/lists/") {
      home.setAttribute("href", "../");
      list.classList.add("active");
      list.setAttribute("href", "./");
      seeds.setAttribute("href", "../seeds/");
    }
  });

fetch(mailerNavbarUrl)
  .then((response) => response.text())
  .then((html) => {
    const navbarContainer = document.querySelector(".mailer-navbar");
    navbarContainer.innerHTML = html;
  });

const list_data = document.querySelector("#list_data");
// const entity_data = document.querySelector('#entity_data')

const createRow = (data) => {
  let rows = [];
  data.forEach((elm) => {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.innerHTML = `<input type="checkbox" class="check" value="${elm.id_list}">`;
    tr.appendChild(td);
    for (let val in elm) {
      let td = document.createElement("td");
      td.innerText = elm[val];
      tr.appendChild(td);
    }
    for (let val in elm) {
      if (val.includes("id")) {
        let td_actions = document.createElement("td");
        td_actions.innerHTML = `<button type="button" class="btn btn-primary add_seeds" data-id="${elm[val]}"><i class="fa fa-plus"></i></button>
                    <button type="button" class="btn btn-success edit" data-id="${elm[val]}"><i class="fas fa-edit"></i></button>
                  <button type="button" class="btn btn-info view" data-id="${elm[val]}"><i class="fa fa-eye" disabled></i></button>`;
        td_actions.classList.add("text-center");
        tr.appendChild(td_actions);
      }
      break;
    }
    rows.push(tr);
  });
  return rows;
};

if (path == "/views/mailer/lists/") {
  fetch("http://192.168.150.134:3000/lists", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let rows = createRow(data);
      rows.forEach((row) => {
        list_data.appendChild(row);
      });
    })
    .then(() => {
      let addBtn = document.querySelectorAll(".add_seeds");
      for (let i = 0; i < addBtn.length; i++) {
        addBtn[i].addEventListener("click", () => {
          let id = addBtn[i].dataset.id;
          document.querySelector("#l_seeds_add").dataset.id = id;
          document.querySelector(".bulk").dataset.id = id;
          const myModal = new bootstrap.Modal(
            document.querySelector(".add_seeds_md")
          );
          myModal.show();
        });
      }
    })
    .then(() => {
      let editBtn = document.querySelectorAll(".edit");
      for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].addEventListener("click", () => {
          let id = editBtn[i].dataset.id;
          let name = editBtn[i].parentElement.parentElement.children[2];
          let currentName = name.innerHTML;
          name.innerHTML = `<input type="text" class="form-control name_change" value="${currentName}">`;
          editBtn[
            i
          ].parentElement.innerHTML = `<button type="button" class="btn btn-success save_edit" data-id="${id}">save</button>`;
        });
      }
    });
}
