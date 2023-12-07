console.log(sessionStorage.auth);
if (sessionStorage.auth == undefined) {
  location.href = '/'
}
let auth = JSON.parse(sessionStorage.auth)
if (auth == 0 || auth == 'undefined') {
  location.href = '/'
}

const togglePassword = document.querySelector(".switch");
togglePassword.addEventListener("click", function (e) {
  // toggle the type attributeW
  let input = document.querySelector("#Password");
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);
  // toggle the eye slash icon
  document.querySelector(".fa-eye").classList.toggle("fa-eye-slash");
});
let storage = { ...localStorage }
console.log(storage);
let ip = storage.ip
/**
 * Patterns =>
 * Login validation pattern : /([A-Za-z])+([0-9]){1}\S/gi
 * Password validation pattern : /([A-Za-z])+@([0-9]){4}\S/gi
 */
const passwordPattern = /([A-Za-z])+@([0-9]){4}\S/i;

/**
 *
 * @param {string} password
 *
 * Validation the password and login =>
 * *  loginTest => in case passed : loginStat = passed ? loginStat = null
 * *  passwordTest => in case passed : password = passed ? password = null
 */

const validation = (password) => {
  let result = {
    passwordStat: true,
  };
  return result;
};

/**
 * Listing to the click event =>
 * Calling the button element.
 * Validation the input value onClick.
 */

// Button
const submitButton = document.getElementById("login");
// Input => login
const login = document.getElementById("Login");
// Input password
const password = document.getElementById("Password");
// The click event
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  let error = document.querySelector(".error");
  if (login.value == "" || password.value == "") {
    error.innerHTML = "All fields required ***";
    return;
  } else {
    error.innerHTML = "";
  }
  let result = validation(password.value);
  if (result.passwordStat == true) {
    fetch(`http://${ip}:3000/users/0?login=${login.value}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          login.classList.remove("is-valid");
          login.classList.add("is-invalid");
          return
        }
        return response.json()
      })
      .then((data) => {
        console.log(data);
        console.log(data.length);
        if (data.length == 0) {
          login.classList.remove("is-valid");
          login.classList.add("is-invalid");
          return
        }
        login.classList.add("is-valid");
        login.classList.remove("is-invalid");
        var settings = {
          "url": `http://${ip}:3000/users/pass/${data[0].id_user}?pass=${password.value}`,
          "method": "GET",
          "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
          let stmt = response;
          switch (stmt) {
            case true:
              password.classList.remove("is-invalid");
              password.classList.add("is-valid");
              break;
            default:
              password.classList.remove("is-valid");
              password.classList.add("is-invalid");
              break;
          }
          if (!stmt) {
            return;
          }
          sessionStorage.setItem("user", JSON.stringify(data[0]));
          window.sessionStorage.setItem('auth', '1')
          if (data[0].type == "admin" || data[0].type == "IT") {
            window.location.href = "../admin/process";
          } else if (data[0].type == "sup") {
            document.location.href = "../supervisor/compose";
          } else {
            document.location.href = "../mailer/compose";
          }
        });
      });
  }
});
