const togglePassword = document.querySelector(".switch");
togglePassword.addEventListener("click", function (e) {
  // toggle the type attributeW
  let input = document.querySelector("#Password");
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);
  // toggle the eye slash icon
  document.querySelector(".fa-eye").classList.toggle("fa-eye-slash");
});

/**
 * Patterns =>
 * Login validation pattern : /([A-Za-z])+([0-9]){1}\S/gi
 * Password validation pattern : /([A-Za-z])+@([0-9]){4}\S/gi
 */
const loginPattern = /([A-Za-z])+([0-9]){1}\S/i;
const passwordPattern = /([A-Za-z])+@([0-9]){4}\S/i;

/**
 *
 * @param {string} login
 * @param {string} password
 *
 * Validation the password and login =>
 * *  loginTest => in case passed : loginStat = passed ? loginStat = null
 * *  passwordTest => in case passed : password = passed ? password = null
 */

const validation = (login, password) => {
  let result = {
    loginStat: false,
    passwordStat: false,
  };
  let loginTest = loginPattern.test(login);
  let passwordTest = passwordPattern.test(password);
  switch (loginTest) {
    case true:
      result.loginStat = true;
      break;
    default:
      result.loginStat = false;
      break;
  }
  switch (passwordTest) {
    case true:
      result.passwordStat = true;
      break;
    default:
      result.passwordStat = false;
      break;
  }
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
  let result = validation(login.value, password.value);
  switch (result.loginStat) {
    case true:
      login.classList.remove("is-invalid");
      login.classList.add("is-valid");
      break;
    default:
      login.classList.remove("is-valid");
      login.classList.add("is-invalid");
      break;
  }

  switch (result.passwordStat) {
    case true:
      password.classList.remove("is-invalid");
      password.classList.add("is-valid");
      break;
    default:
      password.classList.remove("is-valid");
      password.classList.add("is-invalid");
      break;
  }

  if (result.loginStat && result.passwordStat == true) {
    fetch(`http://192.168.150.134:3000/users/0?login=${login.value}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let stmt = data[0].password == password.value;
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
        if (data[0].type == "admin" && data[0].status == "active") {
          window.location.href = "../admin/";
        } else if (data[0].type == "sup") {
          document.location.href = "../supervisor/";
        } else {
          document.location.href = "../mailer/";
        }
      });
  }
});
