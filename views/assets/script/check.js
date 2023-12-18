let authO = JSON.parse(sessionStorage.auth)
console.log(authO);
if (authO === 0 || authO === undefined) {
    // location.href = '/'
    console.log(authO);
}

let str = { ...localStorage }
let loop = str.ip

fetch(`http://${loop}:3000/proxy/`, {
    method: "GET"
}).then(res => {
    return res.json()
}).then(data => {
    if (data.message == 'You shall not pass') {
        location.href = '../../access.html'
    }
})

function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
        return match[2]
    }
}

let st = JSON.parse(getCookieValue('status'))
if (st[0].isLogin) {
    let user = JSON.parse(getCookieValue(st[0].session))
    sessionStorage.setItem("user", JSON.stringify(user));
    window.sessionStorage.setItem('auth', '1')
}

if (sessionStorage.user == undefined && sessionStorage.auth != undefined) {
    // location.href = '/'
    console.log(sessionStorage.user);
}

// let authO = JSON.parse(sessionStorage.auth)
// console.log(authO);
// if (authO == 0 || authO == undefined) {
//     location.href = '/'
// }

let link = document.location.toString()

let data = JSON.parse(sessionStorage.user)

if (link.includes('supervisor')) {
    switch (data.type) {
        case 'IT':
            location.href = '../../access.html'
            break;
        case 'mailer':
            location.href = '../../access.html'
            break;
        default:
            console.log(data.type);
            break;
    }
}

if (link.includes('admin')) {
    switch (data.type) {
        case 'sup':
            location.href = '../../access.html'
            break;
        case 'mailer':
            location.href = '../../access.html'
            break;
        default:
            console.log(data.type);
            break;
    }
}

if (link.includes('mailer')) {
    switch (data.type) {
        case 'IT':
            location.href = '../../access.html'
            break;
        case 'sup':
            location.href = '../../access.html'
            break;
        default:
            console.log(data.type);
            break;
    }
}