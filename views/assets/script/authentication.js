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
    passwordStat: false,
  };
  let passwordTest = passwordPattern.test(password);
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
  let result = validation(password.value);
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

  if (result.passwordStat == true) {
    fetch(`http://${ip}:3000/users/0?login=${login.value}`, {
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
