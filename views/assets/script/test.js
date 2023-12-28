// to = "iliasanouar0@gmail.com;iliasanouar01@gmail.com"
// let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
// if (to.includes(',')) {
//     console.log('mailto error : invalid separator use ";" instead')
//     return
// }

// if (to.split(';').length > 10) {
//     console.log('mailto error : maximum mail to is 10')
//     return
// }

// let spt = to.split(';')
// if (spt[spt.length - 1] == '') {
//     spt.pop()
// }
// to = spt.map((e) => {
//     console.log(e);
//     let test = pattern.test(e.trim())
//     console.log(test);
//     if (!test) {
//         return false
//     }
//     return e.trim()
// }).join(';')
// console.log(to);
// if (to.includes(false)) {
//     console.log('mailto error : enter valid data !!')
//     return
// }