console.log(sessionStorage.auth);

if (sessionStorage.auth == undefined) {
    location.href = '../../access.html'
}

let authO = JSON.parse(sessionStorage.auth)
if (authO == 0 || authO == 'undefined') {
    location.href = '../../access.html'
}

if (sessionStorage.user == undefined && sessionStorage.auth != undefined) {
    location.href = '/'
}

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