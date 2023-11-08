let path =  document.location.toString()

if (path.includes('supervisor')) {
    switch (userData.type) {
        case 'IT':
            location.href = '../../access.html'
            break;
        case 'mailer':
            location.href = '../../access.html'
            break;
        default:
            console.log(userData.type);
            break;
    }
}

if (path.includes('admin')) {
    switch (userData.type) {
        case 'sup':
            location.href = '../../access.html'
            break;
        case 'mailer':
            location.href = '../../access.html'
            break;
        default:
            console.log(userData.type);
            break;
    }
}

if (path.includes('mailer')) {
    switch (userData.type) {
        case 'IT':
            location.href = '../../access.html'
            break;
        case 'sup':
            location.href = '../../access.html'
            break;
        default:
            console.log(userData.type);
            break;
    }
}