const userData = JSON.parse(sessionStorage.user);
let userName = `${userData.f_name} ${userData.l_name}`;

$(document).on("click", ".info a", function () {
  $("#f_name").val(userData.f_name);
  $("#l_name").val(userData.l_name);
  $("#login").val(userData.login);
  $("#type").val(userData.type);
  $(".user_data").modal("show");
});

// let storage = { ...localStorage }
// console.log(storage);
// let ip = storage.ip

$(document).on("click", "#logout", () => {
  console.log('test');
  $("#modal-danger").modal("show");
});

$(document).on("click", "#add_user", () => {
  $(".add_user").modal("show");
});

$(document).on("click", "#add_entity", () => {
  $(".add_entity").modal("show");
});

$(document).on("click", "#add_process", () => {
  $(".add_process").modal("show");
});

$(window).on("load", function () {
  console.log("window loaded");
  console.log('%c Reporting!!', 'font-weight: bold; font-size: 50px;color: white; text-shadow: 4px 4px 0 yellow,7px 7px 0 blue');
  console.log('%c The one', 'font-size: 20px; color: green;');
  $(".info a").html(userName);
});

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

/**
 *
 *
 *
 *
 *
 */
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
      location.reload();
    });
  });
};

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

// console.log();
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
  // let isp_add = $('#isp_add').children()
  let isp_add = $("#isp_add option:selected").text();
  const result = isp_add.split(/(?=[A-Z])/);
  let isp = "";
  result.forEach((elm) => {
    isp += elm + ", ";
  });
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
    isp: `${result}`,
  };
  addUser(data);
  $(".add_user").modal("hide");
});

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

// const wsUri = "ws://localhost:7071/wss";
// const output = document.querySelector("#output");
// const websocket = new WebSocket(wsUri);
// function sendMessage(message) {
//   console.log(`SENT: ${message}`);
//   websocket.send(message);
// }

// websocket.onopen = (e) => {
//   console.log("CONNECTED");
//   sendMessage("ping");
//   pingInterval = setInterval(() => {
//     sendMessage("ping");
//   }, 500);
// };

// websocket.onclose = (e) => {
//   console.log("DISCONNECTED");
//   clearInterval(pingInterval);
// };

// websocket.onmessage = (e) => {
//   console.log(`RECEIVED: ${e.data}`);
// };

// websocket.onerror = (e) => {
//   console.log(`ERROR: ${e.data}`);
// };


