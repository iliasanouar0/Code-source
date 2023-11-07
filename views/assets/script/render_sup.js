function getRootWebSitePath() {
    var _location = document.location.toString();
    var applicationNameIndex = _location.indexOf("/", _location.indexOf("://") + 3);
    var applicationName = _location.substring(0, applicationNameIndex) + "/";
    var webFolderIndex = _location.indexOf("/", _location.indexOf(applicationName) + applicationName.length);
    var webFolderFullPath = _location.substring(0, webFolderIndex);
    return webFolderFullPath;
} console.log(sessionStorage.auth);
if (sessionStorage.auth == undefined) {
    location.href = '/'
}
let auth = JSON.parse(sessionStorage.auth)
if (auth == 0 || auth == 'undefined') {
    location.href = '/'
}
let storage = { ...localStorage }
let ip = storage.ip
let supervisorNavbarUrl = ""
let supervisorSidebarUrl = ""
const root = getRootWebSitePath();
if (root.includes('views')) {
    supervisorNavbarUrl = `${root}/layout/supervisor_navbar.html`;
    supervisorSidebarUrl = `${root}/layout/supervisor_sidebar.html`;
} else {
    supervisorNavbarUrl = `${root}/views/layout/supervisor_navbar.html`;
    supervisorSidebarUrl = `${root}/views/layout/supervisor_sidebar.html`;
}

const _location = document.location.toString();
let path = _location.replace(root, "");
fetch(supervisorSidebarUrl)
    .then((response) => response.text())
    .then((html) => {
        const sidebarContainer = document.querySelector(".sup-sidebar");
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
        const process = document.querySelector(".process");
        const lists = document.querySelector(".lists");
        console.log(path);
        if (path == "/supervisor/") {
            home.classList.add("active");
            home.setAttribute("href", "./");
        } else if (path == "/supervisor/process/") {
            home.setAttribute("href", "../");
            process.classList.add("active");
            process.setAttribute("href", "./");
            entities.setAttribute("href", "../entities/");
            users.setAttribute("href", "../users/");
            lists.setAttribute('href', '../lists/')
            settings.setAttribute("href", '../database/')
            authorization.setAttribute("href", '../authorization/')
        } else if (path == "/supervisor/lists/") {
            home.setAttribute("href", "../");
            lists.classList.add("active");
            lists.setAttribute("href", "./");
            entities.setAttribute("href", "../entities/");
            process.setAttribute('href', '../process/')
            users.setAttribute('href', '../users/')
            settings.setAttribute("href", '../database/')
            authorization.setAttribute("href", '../authorization/')
        }
    });

fetch(supervisorNavbarUrl)
    .then((response) => response.text())
    .then((html) => {
        const navbarContainer = document.querySelector(".sup-navbar");
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